import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import mongoose from 'express';
import { Types } from 'mongoose';
import { AuthRequest } from '../middleware/authMiddleware';
import { Document } from '../models/Document';
import { extractTextFromDocument } from '../services/textExtractionService';
import { cleanDocumentText } from '../services/documentCleaningService';
import {
  saveAllCleanedFormats,
  saveCleanedFile,
  removeDocumentFiles,
  saveBufferToGridFS,
  streamGridFsFileToResponse,
  createPdfFromCleanedText,
  createDocxFromCleanedText,
} from '../services/documentStorageService';
import { connectDB } from '../config/db';

/**
 * Finds a document by MongoDB ObjectId
 */
async function findDocById(id: string): Promise<any> {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return Document.findById(id);
}

/**
 * Maps extension to standard MIME types
 */
function getMimeType(ext: string): string {
  switch (ext.toLowerCase()) {
    case '.pdf':
      return 'application/pdf';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case '.doc':
      return 'application/msword';
    case '.txt':
      return 'text/plain; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
}

/**
 * @desc    Upload & process document
 * @route   POST /api/documents/upload
 * @access  Private
 */
export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  let initialDocRecord: any = null;

  try {
    await connectDB();

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized, please log in.' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, message: 'Please provide a document file to upload.' });
      return;
    }

    const file = req.file;
    const originalFileName = file.originalname;
    const originalFilePath = file.path;
    const originalFileType = file.mimetype || getMimeType(path.extname(originalFileName));
    const originalFileSize = file.size;
    const ext = path.extname(originalFileName);
    const baseName = path.basename(originalFileName, ext);

    // EMPTY FILE VALIDATION: Uploaded file must not be 0 bytes
    if (originalFileSize === 0) {
      try {
        fs.unlinkSync(originalFilePath);
      } catch {
        // ignore
      }
      res.status(400).json({
        success: false,
        message: 'The uploaded file is empty (0 bytes). Please upload a valid document containing text.',
      });
      return;
    }

    // Save original file to GridFS for persistent database backup
    let originalGridFsId: Types.ObjectId | undefined;
    try {
      if (fs.existsSync(originalFilePath)) {
        const origBuf = fs.readFileSync(originalFilePath);
        originalGridFsId = await saveBufferToGridFS(originalFileName, origBuf, originalFileType, {
          userId: req.user._id,
          type: 'original_upload',
        });
      }
    } catch (gErr: any) {
      console.warn('[DocumentController] Notice: GridFS original upload backup:', gErr.message);
    }

    // Parse options if provided
    let options: string[] = ['remove-spaces', 'fix-line-breaks', 'correct-ocr', 'normalize-headings', 'remove-noise'];
    if (req.body.options) {
      try {
        options = typeof req.body.options === 'string' ? JSON.parse(req.body.options) : req.body.options;
      } catch {
        // use default
      }
    }

    // Create initial document record in MongoDB with status 'processing'
    initialDocRecord = await Document.create({
      userId: req.user._id,
      originalFileName,
      originalFilePath,
      originalFileType,
      originalFileSize,
      originalExtension: ext,
      originalGridFsId,
      fileType: originalFileType,
      fileSize: originalFileSize,
      inputType: 'file',
      status: 'processing',
      ocrStatus: 'pending',
      cleaningStatus: 'pending',
      options,
      processingStartedAt: new Date(),
    });

    // 1. Extract raw textual content from the uploaded document (includes Gemini OCR for scanned PDFs)
    let rawText = '';
    try {
      rawText = await extractTextFromDocument(originalFilePath, originalFileName);
    } catch (extractErr: any) {
      console.error('[DocumentController] Text extraction failed:', extractErr.message);
      initialDocRecord.status = 'failed';
      initialDocRecord.ocrStatus = 'failed';
      initialDocRecord.errorMessage = `Extraction failed: ${extractErr.message}`;
      await initialDocRecord.save();

      res.status(422).json({
        success: false,
        message: `Failed to extract text from document: ${extractErr.message}`,
        documentId: initialDocRecord._id,
      });
      return;
    }

    // EMPTY CONTENT CHECK
    if (!rawText || rawText.trim().length === 0) {
      const errMsg =
        ext.toLowerCase() === '.pdf'
          ? 'No readable text could be extracted from this PDF.'
          : 'Extracted content is empty. The uploaded file does not contain readable text.';

      initialDocRecord.status = 'failed';
      initialDocRecord.ocrStatus = 'failed';
      initialDocRecord.errorMessage = errMsg;
      await initialDocRecord.save();

      res.status(400).json({
        success: false,
        message: errMsg,
        documentId: initialDocRecord._id,
      });
      return;
    }

    // 2. Perform AI cleaning preserving complete content and structure
    const cleaningResult = await cleanDocumentText(rawText, options);

    if (!cleaningResult.cleanedText || cleaningResult.cleanedText.trim().length === 0) {
      initialDocRecord.status = 'failed';
      initialDocRecord.cleaningStatus = 'failed';
      initialDocRecord.errorMessage = 'Document cleaning resulted in empty content unexpectedly.';
      await initialDocRecord.save();

      res.status(500).json({
        success: false,
        message: 'Document cleaning resulted in empty content unexpectedly.',
        documentId: initialDocRecord._id,
      });
      return;
    }

    // 3. Generate ALL 3 OUTPUT FORMATS (PDF, DOCX, TXT) and store on disk + GridFS
    const generatedOutputs = await saveAllCleanedFormats(
      baseName,
      ext || '.txt',
      cleaningResult.cleanedText,
      baseName,
      req.user._id
    );

    // Calculate approximate page count
    const pageCount = Math.max(1, Math.min(50, Math.ceil(cleaningResult.cleanedText.length / 2500)));

    // 4. Update the document record in MongoDB with all outputs and metadata
    initialDocRecord.cleanedFileName = generatedOutputs.primaryCleanedFileName;
    initialDocRecord.cleanedFilePath = generatedOutputs.primaryCleanedFilePath;
    initialDocRecord.cleanedFileType = generatedOutputs.primaryCleanedFileType;
    initialDocRecord.cleanedFileSize = generatedOutputs.primaryCleanedFileSize;

    initialDocRecord.cleanedPdfFileName = generatedOutputs.cleanedPdfFileName;
    initialDocRecord.cleanedPdfPath = generatedOutputs.cleanedPdfPath;
    initialDocRecord.cleanedPdfSize = generatedOutputs.cleanedPdfSize;
    initialDocRecord.cleanedPdfGridFsId = generatedOutputs.cleanedPdfGridFsId;

    initialDocRecord.cleanedDocxFileName = generatedOutputs.cleanedDocxFileName;
    initialDocRecord.cleanedDocxPath = generatedOutputs.cleanedDocxPath;
    initialDocRecord.cleanedDocxSize = generatedOutputs.cleanedDocxSize;
    initialDocRecord.cleanedDocxGridFsId = generatedOutputs.cleanedDocxGridFsId;

    initialDocRecord.cleanedTxtFileName = generatedOutputs.cleanedTxtFileName;
    initialDocRecord.cleanedTxtPath = generatedOutputs.cleanedTxtPath;
    initialDocRecord.cleanedTxtSize = generatedOutputs.cleanedTxtSize;
    initialDocRecord.cleanedTxtGridFsId = generatedOutputs.cleanedTxtGridFsId;

    initialDocRecord.originalText = rawText;
    initialDocRecord.cleanedText = cleaningResult.cleanedText;
    initialDocRecord.metrics = cleaningResult.metrics;
    initialDocRecord.previewInfo = {
      pageCount,
      originalSnippet: rawText.slice(0, 500),
      cleanedSnippet: cleaningResult.cleanedText.slice(0, 500),
    };
    initialDocRecord.status = 'completed';
    initialDocRecord.ocrStatus = 'completed';
    initialDocRecord.cleaningStatus = 'completed';
    initialDocRecord.fileSize = generatedOutputs.primaryCleanedFileSize;
    initialDocRecord.fileType = generatedOutputs.primaryCleanedFileType;
    initialDocRecord.processingCompletedAt = new Date();

    await initialDocRecord.save();

    console.log(
      `[DocumentController] Successfully processed document ${initialDocRecord._id} for user ${req.user._id} (PDF: ${generatedOutputs.cleanedPdfSize}b, DOCX: ${generatedOutputs.cleanedDocxSize}b, TXT: ${generatedOutputs.cleanedTxtSize}b)`
    );

    res.status(201).json({
      success: true,
      message: 'Document uploaded and cleaned successfully',
      document: initialDocRecord,
    });
  } catch (error: any) {
    console.error('[DocumentController] Upload document error:', error);
    if (initialDocRecord) {
      initialDocRecord.status = 'failed';
      initialDocRecord.cleaningStatus = 'failed';
      initialDocRecord.errorMessage = error.message || 'Internal processing error';
      await initialDocRecord.save().catch(() => {});
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error processing document upload',
    });
  }
};

/**
 * @desc    Submit raw or pasted text for cleaning
 * @route   POST /api/documents/text
 * @access  Private
 */
export const submitTextDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await connectDB();

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { text, title, options: rawOptions } = req.body;

    if (!text || !text.trim()) {
      res.status(400).json({ success: false, message: 'Please enter or paste document text' });
      return;
    }

    const documentTitle = title?.trim() || `Pasted_Text_${Date.now()}`;
    const baseName = documentTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
    const originalFileName = `${baseName}.txt`;

    let options: string[] = ['remove-spaces', 'fix-line-breaks', 'correct-ocr', 'normalize-headings', 'remove-noise'];
    if (rawOptions) {
      try {
        options = typeof rawOptions === 'string' ? JSON.parse(rawOptions) : rawOptions;
      } catch {
        // default
      }
    }

    // 1. Clean the text using AI pipeline
    const cleaningResult = await cleanDocumentText(text, options);

    // 2. Save original text to disk in server/uploads/original/
    const uploadsBase = path.resolve(process.cwd(), 'server/uploads');
    const originalDir = path.join(uploadsBase, 'original');
    if (!fs.existsSync(originalDir)) {
      fs.mkdirSync(originalDir, { recursive: true });
    }

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const originalFilePath = path.join(originalDir, `${baseName}_orig_${uniqueId}.txt`);
    fs.writeFileSync(originalFilePath, text, 'utf8');

    const originalBuf = Buffer.from(text, 'utf8');
    let originalGridFsId: Types.ObjectId | undefined;
    try {
      originalGridFsId = await saveBufferToGridFS(originalFileName, originalBuf, 'text/plain; charset=utf-8', {
        userId: req.user._id,
        type: 'original_text_submission',
      });
    } catch {
      // ignore
    }

    // 3. Generate ALL THREE FORMATS (PDF, DOCX, TXT)
    const generatedOutputs = await saveAllCleanedFormats(
      baseName,
      '.txt',
      cleaningResult.cleanedText,
      baseName,
      req.user._id
    );

    const pageCount = Math.max(1, Math.min(50, Math.ceil(cleaningResult.cleanedText.length / 2500)));

    // 4. Create document record in MongoDB
    const document = await Document.create({
      userId: req.user._id,
      originalFileName,
      originalFilePath,
      originalFileType: 'text/plain; charset=utf-8',
      originalFileSize: originalBuf.length,
      originalExtension: '.txt',
      originalGridFsId,

      cleanedFileName: generatedOutputs.primaryCleanedFileName,
      cleanedFilePath: generatedOutputs.primaryCleanedFilePath,
      cleanedFileType: generatedOutputs.primaryCleanedFileType,
      cleanedFileSize: generatedOutputs.primaryCleanedFileSize,

      cleanedPdfFileName: generatedOutputs.cleanedPdfFileName,
      cleanedPdfPath: generatedOutputs.cleanedPdfPath,
      cleanedPdfSize: generatedOutputs.cleanedPdfSize,
      cleanedPdfGridFsId: generatedOutputs.cleanedPdfGridFsId,

      cleanedDocxFileName: generatedOutputs.cleanedDocxFileName,
      cleanedDocxPath: generatedOutputs.cleanedDocxPath,
      cleanedDocxSize: generatedOutputs.cleanedDocxSize,
      cleanedDocxGridFsId: generatedOutputs.cleanedDocxGridFsId,

      cleanedTxtFileName: generatedOutputs.cleanedTxtFileName,
      cleanedTxtPath: generatedOutputs.cleanedTxtPath,
      cleanedTxtSize: generatedOutputs.cleanedTxtSize,
      cleanedTxtGridFsId: generatedOutputs.cleanedTxtGridFsId,

      originalText: text,
      cleanedText: cleaningResult.cleanedText,
      metrics: cleaningResult.metrics,
      previewInfo: {
        pageCount,
        originalSnippet: text.slice(0, 500),
        cleanedSnippet: cleaningResult.cleanedText.slice(0, 500),
      },
      inputType: 'text',
      fileType: generatedOutputs.primaryCleanedFileType,
      fileSize: generatedOutputs.primaryCleanedFileSize,
      status: 'completed',
      ocrStatus: 'completed',
      cleaningStatus: 'completed',
      options,
      processingStartedAt: new Date(),
      processingCompletedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Pasted document text cleaned and persisted successfully',
      document,
    });
  } catch (error: any) {
    console.error('[DocumentController] Submit text document error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing text document',
    });
  }
};

/**
 * @desc    Get all documents for the authenticated user from MongoDB
 * @route   GET /api/documents/my-documents
 * @access  Private
 */
export const getMyDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await connectDB();

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    // Query documents strictly for this authenticated user
    const documents = await Document.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error: any) {
    console.error('[DocumentController] Get my documents error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving document history',
    });
  }
};

/**
 * @desc    View document details or inline content
 * @route   GET /api/documents/:id/view
 * @access  Private
 */
export const viewDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await connectDB();

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const document = await findDocById(req.params.id);

    if (!document) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    // Verify user ownership
    if (document.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to access this document' });
      return;
    }

    // Check if JSON explicitly requested
    const acceptHeader = req.headers.accept || '';
    const wantsJson = req.query.format === 'json' || (acceptHeader.includes('application/json') && !acceptHeader.includes('text/html'));

    if (wantsJson) {
      res.json({
        success: true,
        document,
      });
      return;
    }

    let targetPath = document.cleanedFilePath || document.originalFilePath;

    if (!fs.existsSync(targetPath)) {
      if (document.cleanedText) {
        const ext = path.extname(document.cleanedFileName) || '.txt';
        const base = path.basename(document.cleanedFileName, ext);
        const regenerated = await saveCleanedFile(base, ext, document.cleanedText, document.originalFileName);
        document.cleanedFilePath = regenerated.cleanedFilePath;
        await document.save();
        targetPath = regenerated.cleanedFilePath;
      } else {
        res.status(404).json({ success: false, message: 'Physical document file not found' });
        return;
      }
    }

    const contentType = document.cleanedFileType || document.fileType || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(document.cleanedFileName || document.originalFileName)}"`);
    res.sendFile(path.resolve(targetPath));
  } catch (error: any) {
    console.error('[DocumentController] View document error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving document',
    });
  }
};

/**
 * @desc    Download original uploaded document
 * @route   GET /api/documents/:id/download-original
 * @access  Private
 */
export const downloadOriginalDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await connectDB();

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const document = await findDocById(req.params.id);

    if (!document) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    // Ownership check
    if (document.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to download this document' });
      return;
    }

    const filePath = document.originalFilePath;

    // Check disk first
    if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
      res.download(filePath, document.originalFileName, (err) => {
        if (err && !res.headersSent) {
          console.error('[DocumentController] Original download stream error:', err);
          res.status(500).json({ success: false, message: 'Error streaming original document file' });
        }
      });
      return;
    }

    // Fallback: GridFS
    if (document.originalGridFsId) {
      try {
        await streamGridFsFileToResponse(
          document.originalGridFsId,
          res,
          document.originalFileType || 'application/octet-stream',
          document.originalFileName
        );
        return;
      } catch (gErr: any) {
        console.warn('[DocumentController] GridFS original stream note:', gErr.message);
      }
    }

    // Fallback: text reconstruction
    if (document.originalText) {
      const uploadsBase = path.resolve(process.cwd(), 'server/uploads/original');
      if (!fs.existsSync(uploadsBase)) fs.mkdirSync(uploadsBase, { recursive: true });
      const fallbackPath = path.join(uploadsBase, document.originalFileName);
      fs.writeFileSync(fallbackPath, document.originalText, 'utf8');
      document.originalFilePath = fallbackPath;
      await document.save();
      res.download(fallbackPath, document.originalFileName);
      return;
    }

    res.status(404).json({ success: false, message: 'Original document file not found on server' });
  } catch (error: any) {
    console.error('[DocumentController] Download original error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error downloading original document',
    });
  }
};

/**
 * @desc    Download cleaned document file (PDF, DOCX, or TXT)
 * @route   GET /api/documents/:id/download-cleaned
 * @route   GET /api/documents/:id/download (backward compatibility)
 * @access  Private
 */
export const downloadCleanedDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await connectDB();

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const document = await findDocById(req.params.id);

    if (!document) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    // Strict Ownership verification
    if (document.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to download this document' });
      return;
    }

    const requestedFormat = ((req.query.format as string) || '').toLowerCase();
    const baseOriginal = path.basename(document.originalFileName, path.extname(document.originalFileName));
    const cleanedText = document.cleanedText || document.originalText || '';

    if (!cleanedText || cleanedText.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Cleaned document has no readable content to download.' });
      return;
    }

    // Determine target format: pdf, docx, or txt
    let format = requestedFormat;
    if (!['pdf', 'docx', 'doc', 'txt'].includes(format)) {
      const origExt = path.extname(document.originalFileName).toLowerCase().replace('.', '');
      format = ['pdf', 'docx', 'doc', 'txt'].includes(origExt) ? origExt : 'pdf';
    }
    if (format === 'doc') format = 'docx';

    // ==========================================
    // 1. DOCX DOWNLOAD — VALID OFFICE OPEN XML
    // ==========================================
    if (format === 'docx') {
      const downloadFileName = `${baseOriginal}_cleaned.docx`;
      const docxPath = document.cleanedDocxPath;

      // Check if pre-generated valid DOCX exists on disk
      if (docxPath && fs.existsSync(docxPath) && fs.statSync(docxPath).size > 100) {
        const stats = fs.statSync(docxPath);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Length', stats.size.toString());
        res.download(docxPath, downloadFileName);
        return;
      }

      // Check GridFS
      if (document.cleanedDocxGridFsId) {
        try {
          await streamGridFsFileToResponse(
            document.cleanedDocxGridFsId,
            res,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            downloadFileName
          );
          return;
        } catch (gErr) {
          console.warn('[DocumentController] GridFS docx note, regenerating on the fly...');
        }
      }

      // Generate valid binary DOCX on the fly using docx library
      const docxBuffer = await createDocxFromCleanedText(baseOriginal, cleanedText);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Length', docxBuffer.length.toString());
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
      res.send(docxBuffer);
      return;
    }

    // ==========================================
    // 2. PDF DOWNLOAD — VALID BINARY PDF
    // ==========================================
    if (format === 'pdf') {
      const downloadFileName = `${baseOriginal}_cleaned.pdf`;
      const pdfPath = document.cleanedPdfPath;

      // Check if pre-generated valid PDF exists on disk
      if (pdfPath && fs.existsSync(pdfPath) && fs.statSync(pdfPath).size > 100) {
        const stats = fs.statSync(pdfPath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', stats.size.toString());
        res.download(pdfPath, downloadFileName);
        return;
      }

      // Check GridFS
      if (document.cleanedPdfGridFsId) {
        try {
          await streamGridFsFileToResponse(
            document.cleanedPdfGridFsId,
            res,
            'application/pdf',
            downloadFileName
          );
          return;
        } catch (gErr) {
          console.warn('[DocumentController] GridFS pdf note, regenerating on the fly...');
        }
      }

      // Generate valid binary PDF on the fly using PDFKit
      const pdfBuffer = await createPdfFromCleanedText(baseOriginal, cleanedText);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
      res.send(pdfBuffer);
      return;
    }

    // ==========================================
    // 3. TXT DOWNLOAD — VALID UTF-8
    // ==========================================
    const downloadFileName = `${baseOriginal}_cleaned.txt`;
    const txtBuffer = Buffer.from(cleanedText, 'utf8');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Length', txtBuffer.length.toString());
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
    res.send(txtBuffer);
  } catch (error: any) {
    console.error('[DocumentController] Download cleaned error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error downloading cleaned document',
    });
  }
};

/**
 * @desc    Get single document details by ID from MongoDB
 * @route   GET /api/documents/:id
 * @access  Private
 */
export const getDocumentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await connectDB();

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const document = await findDocById(req.params.id);

    if (!document) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    // Verify user ownership
    if (document.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to access this document' });
      return;
    }

    res.json({
      success: true,
      document,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving document',
    });
  }
};

/**
 * @desc    Delete a document
 * @route   DELETE /api/documents/:id
 * @access  Private
 */
export const deleteDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await connectDB();

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const document = await findDocById(req.params.id);

    if (!document) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    // Verify user ownership
    if (document.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this document' });
      return;
    }

    // Remove physical files
    removeDocumentFiles(document.originalFilePath, document.cleanedFilePath);
    if (document.cleanedPdfPath) removeDocumentFiles(document.cleanedPdfPath);
    if (document.cleanedDocxPath) removeDocumentFiles(document.cleanedDocxPath);
    if (document.cleanedTxtPath) removeDocumentFiles(document.cleanedTxtPath);

    await Document.findByIdAndDelete(document._id);

    res.json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting document',
    });
  }
};
