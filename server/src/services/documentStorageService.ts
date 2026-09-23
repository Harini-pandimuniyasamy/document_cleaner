import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import { Document as DocxDoc, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { Response } from 'express';

const uploadsBase = path.resolve(process.cwd(), 'server/uploads');
const originalDir = path.join(uploadsBase, 'original');
const cleanedDir = path.join(uploadsBase, 'cleaned');

if (!fs.existsSync(originalDir)) {
  fs.mkdirSync(originalDir, { recursive: true });
}
if (!fs.existsSync(cleanedDir)) {
  fs.mkdirSync(cleanedDir, { recursive: true });
}

/**
 * Returns the GridFS bucket for persistent document file storage in MongoDB Atlas
 */
export function getGridFsBucket(): mongoose.mongo.GridFSBucket {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('[GridFS] Database connection is not established.');
  }
  return new mongoose.mongo.GridFSBucket(db, { bucketName: 'document_files' });
}

/**
 * Saves an in-memory buffer to MongoDB Atlas GridFS
 */
export async function saveBufferToGridFS(
  fileName: string,
  buffer: Buffer,
  contentType: string,
  metadata: Record<string, any> = {}
): Promise<mongoose.Types.ObjectId> {
  const bucket = getGridFsBucket();
  const uploadStream = bucket.openUploadStream(fileName, {
    contentType,
    metadata: {
      ...metadata,
      uploadedAt: new Date(),
      byteLength: buffer.length,
    },
  });

  return new Promise((resolve, reject) => {
    uploadStream.on('finish', () => resolve(uploadStream.id as mongoose.Types.ObjectId));
    uploadStream.on('error', (err) => reject(err));
    uploadStream.end(buffer);
  });
}

/**
 * Retrieves an in-memory buffer from MongoDB Atlas GridFS by ID
 */
export async function getBufferFromGridFS(fileId: mongoose.Types.ObjectId): Promise<Buffer> {
  const bucket = getGridFsBucket();
  const downloadStream = bucket.openDownloadStream(fileId);
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    downloadStream.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
    downloadStream.on('error', (err) => reject(err));
  });
}

/**
 * Streams a GridFS file directly to an Express HTTP response with proper headers
 */
export async function streamGridFsFileToResponse(
  fileId: mongoose.Types.ObjectId,
  res: Response,
  contentType: string,
  fileName: string
): Promise<void> {
  const bucket = getGridFsBucket();
  const files = await bucket.find({ _id: fileId }).toArray();
  if (files.length === 0) {
    throw new Error(`File ${fileId} not found in GridFS`);
  }

  const fileDoc = files[0];
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', fileDoc.length.toString());
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);

  const downloadStream = bucket.openDownloadStream(fileId);
  downloadStream.on('error', (err) => {
    console.error('[GridFS] Stream download error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed streaming document from database' });
    }
  });
  downloadStream.pipe(res);
}

/**
 * Builds a valid, verified binary PDF using PDFKit containing the actual cleaned content.
 * Validates PDF signature (%PDF-).
 */
export function createPdfFromCleanedText(title: string, cleanedText: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 54,
        size: 'A4',
        info: {
          Title: `${title} — Cleaned Document`,
          Author: 'DocuClean AI',
          Subject: 'Restored & Formatted Document',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const finalPdf = Buffer.concat(chunks);
        // VALIDATION: Must start with %PDF- and be non-empty
        if (finalPdf.length < 100 || finalPdf.subarray(0, 4).toString('utf8') !== '%PDF') {
          reject(new Error('PDF generation produced an invalid or corrupted file header'));
          return;
        }
        resolve(finalPdf);
      });
      doc.on('error', (err) => reject(err));

      // Document Header
      doc.font('Helvetica-Bold').fontSize(16).fillColor('#1E293B').text(title, { align: 'left' });
      doc.moveDown(0.3);
      doc.font('Helvetica').fontSize(9).fillColor('#64748B').text(
        `DocuClean AI Cleaned Document • Restored with Verified Quality • ${new Date().toLocaleDateString()}`
      );
      doc.moveDown(0.7);

      // Separator rule
      doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(54, doc.y).lineTo(541, doc.y).stroke();
      doc.moveDown(1);

      // Document Body
      doc.font('Helvetica').fontSize(10.5).fillColor('#0F172A');

      const paragraphs = cleanedText.split(/\n\s*\n/);
      for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i].trim();
        if (!p) continue;

        // Check if paragraph looks like a section header
        if (/^[0-9]+\.\s+[A-Z\s]+$/.test(p) || (/^[A-Z0-9\s:_-]{4,}$/.test(p) && p.length < 60)) {
          doc.moveDown(0.5);
          doc.font('Helvetica-Bold').fontSize(12).fillColor('#1E293B').text(p);
          doc.font('Helvetica').fontSize(10.5).fillColor('#0F172A');
          doc.moveDown(0.3);
        } else {
          doc.text(p, {
            align: 'left',
            lineGap: 3.5,
            paragraphGap: 6,
          });
        }
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Builds a valid, verified binary DOCX (Office Open XML) using docx.js containing the actual cleaned content.
 * Validates ZIP signature (0x50 0x4B 0x03 0x04).
 */
export async function createDocxFromCleanedText(title: string, cleanedText: string): Promise<Buffer> {
  const lines = cleanedText.split('\n');
  const paragraphs: Paragraph[] = [];

  // Title header
  paragraphs.push(
    new Paragraph({
      text: `${title} — Cleaned Document`,
      heading: HeadingLevel.TITLE,
      spacing: { after: 180 },
    })
  );

  // Subtitle
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `DocuClean AI Restored Output • Verified Pristine • ${new Date().toLocaleDateString()}`,
          italics: true,
          color: '64748B',
          size: 18, // 9pt
        }),
      ],
      spacing: { after: 260 },
    })
  );

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ text: '', spacing: { after: 80 } }));
      continue;
    }

    // Section Headings
    if (/^[0-9]+\.\s+[A-Z\s]+$/.test(trimmed) || (/^[A-Z\s]{4,}$/.test(trimmed) && trimmed.length < 50)) {
      paragraphs.push(
        new Paragraph({
          text: trimmed,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 180, after: 100 },
        })
      );
    } else if (/^[-*•]\s+/.test(trimmed)) {
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun(trimmed.replace(/^[-*•]\s+/, ''))],
          spacing: { after: 80 },
        })
      );
    } else {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 22 })], // 11pt
          spacing: { after: 120, line: 276 }, // 1.15 line spacing
        })
      );
    }
  }

  const doc = new DocxDoc({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const docxBuf = await Packer.toBuffer(doc);

  // VALIDATION: Must start with ZIP header PK\x03\x04 (50 4b 03 04)
  if (docxBuf.length < 100 || docxBuf.subarray(0, 4).toString('hex') !== '504b0304') {
    throw new Error('DOCX generation produced an invalid or corrupted file header');
  }

  return docxBuf;
}

export interface GeneratedOutputs {
  cleanedPdfFileName: string;
  cleanedPdfPath: string;
  cleanedPdfSize: number;
  cleanedPdfGridFsId?: mongoose.Types.ObjectId;

  cleanedDocxFileName: string;
  cleanedDocxPath: string;
  cleanedDocxSize: number;
  cleanedDocxGridFsId?: mongoose.Types.ObjectId;

  cleanedTxtFileName: string;
  cleanedTxtPath: string;
  cleanedTxtSize: number;
  cleanedTxtGridFsId?: mongoose.Types.ObjectId;

  primaryCleanedFileName: string;
  primaryCleanedFilePath: string;
  primaryCleanedFileType: string;
  primaryCleanedFileSize: number;
}

/**
 * Generates and verifies ALL THREE cleaned document formats (PDF, DOCX, TXT)
 * immediately after cleaning, stores them on disk AND in MongoDB GridFS,
 * and validates that all generated binary files are non-empty and well-formed.
 */
export async function saveAllCleanedFormats(
  baseName: string,
  originalExt: string,
  cleanedText: string,
  title: string,
  userId: mongoose.Types.ObjectId | string
): Promise<GeneratedOutputs> {
  if (!cleanedText || cleanedText.trim().length === 0) {
    throw new Error('Cannot generate cleaned files: cleaned document content is empty.');
  }

  const sanitized = baseName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50) || 'document';
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 1. Generate & Validate PDF
  const pdfBuffer = await createPdfFromCleanedText(title, cleanedText);
  const pdfFileName = `${sanitized}_cleaned_${uniqueId}.pdf`;
  const pdfFilePath = path.join(cleanedDir, pdfFileName);
  fs.writeFileSync(pdfFilePath, pdfBuffer);

  // 2. Generate & Validate DOCX
  const docxBuffer = await createDocxFromCleanedText(title, cleanedText);
  const docxFileName = `${sanitized}_cleaned_${uniqueId}.docx`;
  const docxFilePath = path.join(cleanedDir, docxFileName);
  fs.writeFileSync(docxFilePath, docxBuffer);

  // 3. Generate & Validate TXT (UTF-8)
  const txtBuffer = Buffer.from(cleanedText, 'utf8');
  const txtFileName = `${sanitized}_cleaned_${uniqueId}.txt`;
  const txtFilePath = path.join(cleanedDir, txtFileName);
  fs.writeFileSync(txtFilePath, txtBuffer);

  // Verify all 3 files exist on disk and have non-zero sizes
  const pdfStat = fs.statSync(pdfFilePath);
  const docxStat = fs.statSync(docxFilePath);
  const txtStat = fs.statSync(txtFilePath);

  if (pdfStat.size === 0 || docxStat.size === 0 || txtStat.size === 0) {
    throw new Error('One or more cleaned output formats generated 0 bytes on disk.');
  }

  // Persist to MongoDB GridFS if database connection is available
  let pdfGridFsId: mongoose.Types.ObjectId | undefined;
  let docxGridFsId: mongoose.Types.ObjectId | undefined;
  let txtGridFsId: mongoose.Types.ObjectId | undefined;

  try {
    if (mongoose.connection.db) {
      pdfGridFsId = await saveBufferToGridFS(pdfFileName, pdfBuffer, 'application/pdf', {
        userId,
        type: 'cleaned_pdf',
        baseName,
      });
      docxGridFsId = await saveBufferToGridFS(
        docxFileName,
        docxBuffer,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        {
          userId,
          type: 'cleaned_docx',
          baseName,
        }
      );
      txtGridFsId = await saveBufferToGridFS(txtFileName, txtBuffer, 'text/plain; charset=utf-8', {
        userId,
        type: 'cleaned_txt',
        baseName,
      });
    }
  } catch (gridFsErr: any) {
    console.warn('[GridFS] Warning: Failed saving cleaned files to GridFS (filesystem storage retained):', gridFsErr.message);
  }

  // Determine primary output matching uploaded file type
  const normExt = originalExt.toLowerCase();
  let primaryCleanedFileName = txtFileName;
  let primaryCleanedFilePath = txtFilePath;
  let primaryCleanedFileType = 'text/plain';
  let primaryCleanedFileSize = txtStat.size;

  if (normExt === '.pdf') {
    primaryCleanedFileName = pdfFileName;
    primaryCleanedFilePath = pdfFilePath;
    primaryCleanedFileType = 'application/pdf';
    primaryCleanedFileSize = pdfStat.size;
  } else if (normExt === '.docx' || normExt === '.doc') {
    primaryCleanedFileName = docxFileName;
    primaryCleanedFilePath = docxFilePath;
    primaryCleanedFileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    primaryCleanedFileSize = docxStat.size;
  }

  return {
    cleanedPdfFileName: pdfFileName,
    cleanedPdfPath: pdfFilePath,
    cleanedPdfSize: pdfStat.size,
    cleanedPdfGridFsId: pdfGridFsId,

    cleanedDocxFileName: docxFileName,
    cleanedDocxPath: docxFilePath,
    cleanedDocxSize: docxStat.size,
    cleanedDocxGridFsId: docxGridFsId,

    cleanedTxtFileName: txtFileName,
    cleanedTxtPath: txtFilePath,
    cleanedTxtSize: txtStat.size,
    cleanedTxtGridFsId: txtGridFsId,

    primaryCleanedFileName,
    primaryCleanedFilePath,
    primaryCleanedFileType,
    primaryCleanedFileSize,
  };
}

/**
 * Backward-compatible single file save
 */
export async function saveCleanedFile(
  baseName: string,
  extension: string,
  cleanedText: string,
  title: string
): Promise<{ cleanedFileName: string; cleanedFilePath: string; cleanedFileSize: number; cleanedFileType: string }> {
  const outputs = await saveAllCleanedFormats(baseName, extension, cleanedText, title, 'system');
  return {
    cleanedFileName: outputs.primaryCleanedFileName,
    cleanedFilePath: outputs.primaryCleanedFilePath,
    cleanedFileSize: outputs.primaryCleanedFileSize,
    cleanedFileType: outputs.primaryCleanedFileType,
  };
}

/**
 * Removes original and cleaned files from filesystem.
 */
export function removeDocumentFiles(originalPath?: string, cleanedPath?: string): void {
  if (originalPath && fs.existsSync(originalPath)) {
    try {
      fs.unlinkSync(originalPath);
    } catch (e) {
      console.error('Error deleting original file:', e);
    }
  }
  if (cleanedPath && fs.existsSync(cleanedPath)) {
    try {
      fs.unlinkSync(cleanedPath);
    } catch (e) {
      console.error('Error deleting cleaned file:', e);
    }
  }
}
