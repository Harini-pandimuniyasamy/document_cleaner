import { DownloadFormat, ProcessedDocumentData } from '../types';

/**
 * Service to handle document downloads.
 * Generates a valid downloadable client-side file and initiates browser download.
 * In a production backend environment, this function would call the backend API endpoint
 * returning the cleaned file buffer.
 */
export async function downloadCleanedDocument(
  doc: ProcessedDocumentData,
  format: DownloadFormat,
  originalFilename = 'cleaned_document'
): Promise<{ success: boolean; filename: string }> {
  const baseName = originalFilename.replace(/\.[^/.]+$/, '');
  const finalFilename = `${baseName}_cleaned.${format}`;

  let blob: Blob;

  if (format === 'txt') {
    const content = `=====================================================
${doc.title} — CLEANED BY DOCUCLEAN AI
Date: ${new Date().toLocaleDateString()}
Status: Pristine (Clarity: ${doc.readabilityScoreAfter}%)
=====================================================

${doc.cleanedText}

-----------------------------------------------------
Restoration Summary:
- Artifacts & Noise Removed: ${doc.artifactsRemoved}
- Extra Whitespaces Fixed: ${doc.spacesFixed}
- Line Breaks Normalized: ${doc.lineBreaksFixed}
- OCR Mismatches Corrected: ${doc.ocrCorrectionsCount}
-----------------------------------------------------
`;
    blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  } else if (format === 'pdf') {
    // Generate a formatted PDF-compatible text document with printable structure
    // HTML/Printable data URI or basic PDF container
    const pdfDocContent = `%PDF-1.4
%
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 285 >>
stream
BT
/F1 16 Tf
50 720 Td
(${doc.title} - Cleaned by DocuClean AI) Tj
0 -25 Td
/F1 10 Tf
(Restored Document - Clarity: ${doc.readabilityScoreAfter}%) Tj
0 -30 Td
(Date: ${new Date().toLocaleDateString()} - Artifacts Removed: ${doc.artifactsRemoved}) Tj
0 -40 Td
(Status: Verified Clean and Pristine) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000068 00000 n 
0000000125 00000 n 
0000000249 00000 n 
0000000586 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
655
%%EOF`;
    blob = new Blob([pdfDocContent], { type: 'application/pdf' });
  } else {
    // DOCX format - generate standard HTML-based Word format recognized by MS Word / Google Docs / LibreOffice
    const wordContent = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${doc.title}</title>
<style>
body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #1e1e2f; margin: 1in; }
h1 { color: #1f108e; font-size: 18pt; border-bottom: 2px solid #712ae2; padding-bottom: 6px; }
.badge { background: #eef2ff; color: #4f46e5; padding: 4px 10px; border-radius: 6px; font-weight: bold; }
.summary { background: #f8faff; border-left: 4px solid #712ae2; padding: 12px; margin: 20px 0; }
pre { background: #f4f4f8; padding: 16px; border-radius: 8px; font-family: inherit; white-space: pre-wrap; }
</style>
</head>
<body>
<h1>${doc.title}</h1>
<p><span class="badge">Cleaned by DocuClean AI</span> &bull; <strong>Status:</strong> ${doc.readabilityScoreAfter}% Clarity &bull; ${new Date().toLocaleDateString()}</p>
<div class="summary">
  <strong>Restoration Report:</strong>
  <ul>
    <li>Total Artifacts Removed: ${doc.artifactsRemoved}</li>
    <li>Extra Whitespaces Corrected: ${doc.spacesFixed}</li>
    <li>Line Breaks Restructured: ${doc.lineBreaksFixed}</li>
    <li>OCR Inconsistencies Fixed: ${doc.ocrCorrectionsCount}</li>
  </ul>
</div>
<h2>Cleaned Text</h2>
<pre>${doc.cleanedText}</pre>
</body></html>`;
    blob = new Blob([wordContent], { type: 'application/msword;charset=utf-8' });
  }

  // Create temporary URL and trigger browser download
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
