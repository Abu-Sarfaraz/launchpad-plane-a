import { describe, it, expect } from 'vitest';
import { generatePdfBlob, generateDocBlob } from '@/lib/export/documents';

describe('Document Export Engine (PDF & DOC)', () => {
  const sampleTitle = 'CAIE IGCSE Physics Mock Paper 1';
  const sampleContent = `# CAIE IGCSE Physics Mock Paper 1
## Instructions to Candidates
Answer all questions. You may use a scientific calculator.

## Section A: Mechanics
1. A car accelerates uniformly from rest to 24 m/s in 8.0 s.
Calculate the acceleration of the car. [2 marks]

## Section B: Mark Scheme
1. a = (v - u) / t = (24 - 0) / 8.0 = 3.0 m/s^2 [1 mark for formula, 1 mark for correct value and units]`;

  const sampleMetadata = {
    subject: 'Physics',
    syllabus: 'Cambridge IGCSE (0625)',
    date: '2026-10-30',
  };

  async function readBlobAsText(blob: Blob): Promise<string> {
    if (typeof (blob as any).text === 'function') {
      return (blob as any).text();
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(blob);
    });
  }

  describe('generatePdfBlob', () => {
    it('creates a valid PDF-1.4 Blob with application/pdf MIME type', async () => {
      const blob = generatePdfBlob(sampleTitle, sampleContent, sampleMetadata);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/pdf');
      expect(blob.size).toBeGreaterThan(200);

      const text = await readBlobAsText(blob);

      // Verify PDF header and trailer structures
      expect(text.startsWith('%PDF-1.4')).toBe(true);
      expect(text).toContain('/Type /Catalog');
      expect(text).toContain('/Type /Pages');
      expect(text).toContain('/Type /Page');
      expect(text).toContain('/MediaBox [0 0 595 842]'); // A4 size
      expect(text).toContain('/Type /Font');
      expect(text).toContain('/BaseFont /Helvetica');
      expect(text).toContain('xref');
      expect(text).toContain('trailer');
      expect(text.trim().endsWith('%%EOF')).toBe(true);

      // Verify content and metadata inclusion
      expect(text).toContain('CAIE IGCSE Physics Mock Paper 1');
      expect(text).toContain('Cambridge IGCSE');
    });

    it('paginates long content into multiple pages gracefully', async () => {
      // Create content with 100 lines (which should span >= 3 pages at 40 lines/page)
      const longLines = Array.from({ length: 100 }, (_, idx) => `Line ${idx + 1}: Experimental question test analysis details.`);
      const longContent = longLines.join('\n');

      const blob = generatePdfBlob('Long Exam Paper', longContent);
      const text = await readBlobAsText(blob);

      expect(text).toContain('/Count 3');
      expect(text).toContain('Page 1/3');
      expect(text).toContain('Page 2 of 3');
      expect(text).toContain('Page 3 of 3');
    });
  });

  describe('generateDocBlob', () => {
    it('creates a valid Word document Blob with application/msword MIME type', async () => {
      const blob = generateDocBlob(sampleTitle, sampleContent, sampleMetadata);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/msword;charset=utf-8');
      expect(blob.size).toBeGreaterThan(200);

      const text = await readBlobAsText(blob);

      // Verify Word XML namespaces and HTML document structure
      expect(text).toContain("xmlns:w='urn:schemas-microsoft-com:office:word'");
      expect(text).toContain('<w:WordDocument>');
      expect(text).toContain('<w:View>Print</w:View>');
      expect(text).toContain(sampleTitle);
      expect(text).toContain('Cambridge IGCSE (0625)');
      expect(text).toContain('Physics');

      // Verify styled markdown headings transformed to HTML
      expect(text).toContain('<h1 style="color:#0f172a;');
      expect(text).toContain('<h2 style="color:#1e293b;');
      expect(text).toContain('Instructions to Candidates');
      expect(text).toContain('Section A: Mechanics');
    });
  });
});
