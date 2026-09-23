import { DownloadFormat, ProcessedDocumentData } from '../types';
import { documentsApi } from './api';

/**
 * Service to handle document downloads.
 * Downloads verified binary documents from backend API.
 */
export async function downloadCleanedDocument(
  doc: ProcessedDocumentData,
  format: DownloadFormat,
  originalFilename = 'cleaned_document'
): Promise<{ success: boolean; filename: string }> {
  const baseName = originalFilename.replace(/\.[^/.]+$/, '');
  const finalFilename = `${baseName}_cleaned.${format}`;

  // 1. Download real binary file from backend API
  if (doc.id) {
    try {
      await documentsApi.downloadCleaned(doc.id, finalFilename, format);
      return { success: true, filename: finalFilename };
    } catch (apiErr: any) {
      console.error('Backend download error:', apiErr?.message || apiErr);
      throw new Error(`Failed to download ${format.toUpperCase()} file from server: ${apiErr?.message || 'Download error'}`);
    }
  }

  // 2. Fallback for text format if doc.id is unexpectedly missing
  if (format === 'txt') {
    const textContent = doc.cleanedText || doc.originalText || '';
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return { success: true, filename: finalFilename };
  }

  throw new Error(`Document session missing ID. Please re-upload your document.`);
}
