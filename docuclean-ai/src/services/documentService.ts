import { CleaningOptionItem, ProcessedDocumentData, UploadedFileInfo } from '../types';

export const CLEANING_OPTIONS: CleaningOptionItem[] = [
  {
    id: 'remove-spaces',
    title: 'Remove Extra Spaces',
    description: 'Eliminates repetitive whitespaces, tabs, double spacing, and trailing character gaps.',
    recommended: true,
  },
  {
    id: 'fix-line-breaks',
    title: 'Fix Line Breaks',
    description: 'Reconstructs accidental hard wraps, orphaned headings, and mid-sentence paragraph breaks.',
    recommended: true,
  },
  {
    id: 'correct-ocr',
    title: 'Correct OCR Errors',
    description: 'Context-aware neural AI resolves number-letter substitutions, punctuation slips, and typos.',
    recommended: true,
  },
  {
    id: 'remove-noise',
    title: 'Remove Noise',
    description: 'Erases scanner speckles, coffee stains, punch-hole dark marks, and border shadows.',
  },
  {
    id: 'normalize-formatting',
    title: 'Normalize Formatting',
    description: 'Standardizes font scaling, heading hierarchies, indentation, and table borders.',
  },
  {
    id: 'enhance-readability',
    title: 'Enhance Readability',
    description: 'Adjusts contrast, sharpens soft text glyphs, and balances margin gutters.',
  },
  {
    id: 'searchable-pdf',
    title: 'Convert to Searchable PDF',
    description: 'Embeds an invisible machine-readable text layer behind image-based documents.',
  },
  {
    id: 'deskew-document',
    title: 'Deskew Document',
    description: 'Detects skew angles up to ±45 degrees and straightens tilted scans automatically.',
  },
];

export const PROCESSING_STEPS = [
  { label: 'Reading document', desc: 'Parsing binary streams and verifying structural integrity' },
  { label: 'Analyzing content', desc: 'Neural inspection of glyphs, noise artifacts, and text blocks' },
  { label: 'Applying selected cleaning options', desc: 'Executing algorithmic and contextual transformations' },
  { label: 'Improving formatting', desc: 'Realigning layout geometry, typography, and paragraph hierarchy' },
  { label: 'Finalizing document', desc: 'Packaging pristine output and generating audit metrics' },
];

/**
 * Service function to process a document.
 * Structured so a real backend / REST API endpoint can easily replace this implementation.
 */
export async function processDocument(
  fileInfo: UploadedFileInfo,
  selectedOptions: string[]
): Promise<ProcessedDocumentData> {
  // Simulates processing work
  await new Promise((resolve) => setTimeout(resolve, 800));

  const sampleName = fileInfo.name || 'document.pdf';
  const hasOCR = selectedOptions.includes('correct-ocr');
  const hasSpaces = selectedOptions.includes('remove-spaces');
  const hasLineBreaks = selectedOptions.includes('fix-line-breaks');
  const hasFormat = selectedOptions.includes('normalize-formatting');

  const originalSample = `CONFIDENTIAL  QUARTERLY  AUDIT   REP0RT  --  2O24
DocuClean  Enterpr1se   Soluti0ns   Group

1.  EXECUTIVE   SUMMARY
Dur1ng  the  prev1ous   operat1onal  quarter ,  our   mult1-reg1onal
fac1lities  encountered   substant1al  bottlenecks  in  the   ingest1on
of   uncategor1zed   analog   cop1es . Scanned   mater1als   frequently
exh1bited   art1facts   such  as :
-  scanner   speckle   no1se  and  skewed   b0rders
-  errat1c   hard   breaks  in
the  middle  of   statutory  c1tations
-  degraded   contrast   lead1ng  to  OCR   m1sreadings   like  'rn'   read  as  'm'

2.  QUANTITAT1VE   ANALYS1S
T0tal  scanned   pages:  12,480   docurnents
Average   clar1ty   index:  61.4%   (Sub-opt1mal)
Corrective   act1on   requ1red:  Immed1ate   AI  restorat1on`;

  const cleanedSample = `CONFIDENTIAL QUARTERLY AUDIT REPORT — 2024
DocuClean Enterprise Solutions Group

1. EXECUTIVE SUMMARY
During the previous operational quarter, our multi-regional facilities encountered substantial bottlenecks in the ingestion of uncategorized analog copies. Scanned materials frequently exhibited artifacts such as:
• Scanner speckle noise and skewed borders
• Erratic hard breaks in statutory citations
• Degraded contrast leading to OCR misreadings like 'rn' read as 'm'

2. QUANTITATIVE ANALYSIS
Total scanned pages: 12,480 documents
Average clarity index: 99.4% (Pristine)
Corrective action required: None (AI Restoration Complete)`;

  return {
    title: sampleName.replace(/\.[^/.]+$/, ''),
    pageCount: Math.max(1, Math.min(12, Math.round(fileInfo.size / (1024 * 150)) || 3)),
    originalText: originalSample,
    cleanedText: cleanedSample,
    artifactsRemoved: 42 + selectedOptions.length * 15,
    spacesFixed: hasSpaces ? 86 : 12,
    lineBreaksFixed: hasLineBreaks ? 28 : 4,
    ocrCorrectionsCount: hasOCR ? 19 : 2,
    readabilityScoreBefore: 61,
    readabilityScoreAfter: 99,
    cleanedAt: new Date(),
  };
}
