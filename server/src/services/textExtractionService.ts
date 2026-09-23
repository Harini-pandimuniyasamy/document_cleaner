import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';

/**
 * Extracts raw textual content from an uploaded document on disk.
 * Supports PDF, DOCX, DOC, and TXT with format-specific parsing.
 * For scanned/image-based PDFs with no text layer, executes OCR via Gemini API.
 */
export async function extractTextFromDocument(
  filePath: string,
  originalFileName: string
): Promise<string> {
  const ext = path.extname(originalFileName).toLowerCase();

  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist at path: ${filePath}`);
  }

  const stats = fs.statSync(filePath);
  if (stats.size === 0) {
    throw new Error('Uploaded document is empty (0 bytes).');
  }

  // 1. Plain Text (.txt)
  if (ext === '.txt') {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content;
    } catch (err: any) {
      throw new Error(`Failed to read TXT document: ${err.message}`);
    }
  }

  // 2. PDF Document (.pdf)
  if (ext === '.pdf') {
    const fileBuffer = fs.readFileSync(filePath);
    let extracted = '';

    // A. Attempt fast text layer extraction
    try {
      const parser = new PDFParse({ data: fileBuffer });
      const parsedData = await parser.getText();
      await parser.destroy();
      extracted = parsedData?.text || '';
    } catch (err: any) {
      console.warn(`[TextExtraction] PDFParse text extraction note: ${err.message}`);
    }

    // If text layer was present and contains readable words, return it
    if (extracted && extracted.trim().length > 20) {
      return extracted;
    }

    // B. OCR for Scanned or Image-based PDFs via Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        console.log(`[TextExtraction] PDF has no embedded text layer (scanned or image-only). Performing Gemini OCR on ${originalFileName}...`);
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const base64Pdf = fileBuffer.toString('base64');
        const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

        for (const model of candidateModels) {
          try {
            const res = await ai.models.generateContent({
              model,
              contents: [
                {
                  inlineData: {
                    mimeType: 'application/pdf',
                    data: base64Pdf,
                  },
                },
                {
                  text: 'Extract and transcribe all text from every page of this scanned document. Preserve all words, numbers, paragraphs, headings, and tables exactly as they appear in the original document. Output only the extracted document text.',
                },
              ],
            });

            if (res.text && res.text.trim().length > 0) {
              console.log(`[TextExtraction] Gemini OCR succeeded on ${originalFileName} (${res.text.length} chars).`);
              return res.text;
            }
          } catch (modelErr: any) {
            console.warn(`[TextExtraction] Gemini OCR with model ${model} failed: ${modelErr.message}`);
          }
        }
      } catch (ocrErr: any) {
        console.warn(`[TextExtraction] Gemini OCR encountered an error: ${ocrErr.message}`);
      }
    }

    // Fallback: extract string streams from PDF buffer if any text markers exist
    try {
      const str = fileBuffer.toString('binary');
      const textMatches = str.match(/\((.*?)\)\s*Tj/g);
      if (textMatches && textMatches.length > 0) {
        return textMatches.map((m) => m.replace(/[()]/g, '').replace(/Tj$/, '').trim()).join(' ');
      }
    } catch {
      // ignore
    }

    if (extracted && extracted.trim().length > 0) {
      return extracted;
    }

    throw new Error('No readable text could be extracted from this PDF.');
  }

  // 3. Word Document (.docx)
  if (ext === '.docx') {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      if (result.value && result.value.trim().length > 0) {
        return result.value;
      }
      const buffer = fs.readFileSync(filePath);
      const bufResult = await mammoth.extractRawText({ buffer });
      if (bufResult.value && bufResult.value.trim().length > 0) {
        return bufResult.value;
      }
      return bufResult.value || '';
    } catch (err: any) {
      throw new Error(`Failed to extract text from DOCX: ${err.message}`);
    }
  }

  // 4. Legacy Word Document (.doc)
  if (ext === '.doc') {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      if (result.value && result.value.trim().length > 0) {
        return result.value;
      }
    } catch {
      // Mammoth can fail on binary OLE .doc files
    }

    // Binary text extraction fallback for OLE DOC
    try {
      const buffer = fs.readFileSync(filePath);
      const asciiStrings: string[] = [];
      let current = '';
      for (let i = 0; i < buffer.length; i++) {
        const byte = buffer[i];
        if (byte >= 32 && byte <= 126) {
          current += String.fromCharCode(byte);
        } else if (byte === 10 || byte === 13) {
          if (current.length > 3) asciiStrings.push(current);
          current = '';
        } else {
          if (current.length > 3) asciiStrings.push(current);
          current = '';
        }
      }
      if (current.length > 3) asciiStrings.push(current);
      return asciiStrings.join('\n');
    } catch (err: any) {
      throw new Error(`Failed to parse legacy DOC: ${err.message}`);
    }
  }

  // Default fallback for other text-like files
  return fs.readFileSync(filePath, 'utf8');
}
