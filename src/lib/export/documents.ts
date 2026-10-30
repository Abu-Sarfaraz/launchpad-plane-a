/**
 * Document Export Engine for PaperCraft & Prompt2Paper
 * Generates publication-ready PDF and Microsoft Word (.doc) files natively with zero external runtime dependencies.
 */

export interface DocumentMetadata {
  subject?: string;
  syllabus?: string;
  author?: string;
  institution?: string;
  date?: string;
  marks?: number;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\- ]/g, '').trim().replace(/\s+/g, '_') || 'document';
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Multi-page A4 PDF binary generator compliant with PDF-1.4 specification
 */
export function generatePdfBlob(title: string, content: string, metadata?: DocumentMetadata): Blob {
  const cleanTitle = title.replace(/[()]/g, '');
  const lines: string[] = [];

  // Break text into lines wrapped at ~80 characters
  for (const raw of content.split('\n')) {
    let text = raw;
    while (text.length > 80) {
      lines.push(text.slice(0, 80));
      text = text.slice(80);
    }
    lines.push(text);
  }

  const linesPerPage = 40;
  const pagesLines: string[][] = [];
  for (let i = 0; i < Math.max(1, lines.length); i += linesPerPage) {
    pagesLines.push(lines.slice(i, i + linesPerPage));
  }

  const numPages = pagesLines.length;
  const objects: string[] = [];

  const pageObjIds: number[] = [];
  const streamObjIds: number[] = [];
  for (let i = 0; i < numPages; i++) {
    pageObjIds.push(3 + i * 2);
    streamObjIds.push(4 + i * 2);
  }
  const fontObjId = 3 + numPages * 2;

  // 1: Catalog
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');

  // 2: Pages Catalog
  const kidsStr = pageObjIds.map((id) => `${id} 0 R`).join(' ');
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${numPages} >>\nendobj`);

  // 3..N: Page & Stream pairs
  for (let i = 0; i < numPages; i++) {
    const pid = pageObjIds[i];
    const sid = streamObjIds[i];
    const pLines = pagesLines[i];

    objects.push(
      `${pid} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${sid} 0 R /Resources << /Font << /F1 ${fontObjId} 0 R >> >> >>\nendobj`
    );

    const streamParts: string[] = [];
    let y = 740;

    if (i === 0) {
      // Header banner on first page
      streamParts.push(`BT /F1 16 Tf 50 780 Td (${cleanTitle}) Tj ET`);
      const subtitle = metadata?.syllabus
        ? `PaperCraft Examination - ${metadata.syllabus} (${metadata.subject || 'Standard'})`
        : 'PaperCraft AI Studio - Official Examination Paper';
      streamParts.push(`BT /F1 9 Tf 50 760 Td (${subtitle}) Tj ET`);
      y = 720;
    } else {
      streamParts.push(`BT /F1 8 Tf 50 805 Td (${cleanTitle} - Page ${i + 1} of ${numPages}) Tj ET`);
      y = 770;
    }

    for (const l of pLines) {
      const safe = l.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      streamParts.push(`BT /F1 10 Tf 50 ${y} Td (${safe}) Tj ET`);
      y -= 16;
    }

    // Page footer
    streamParts.push(`BT /F1 8 Tf 500 30 Td (Page ${i + 1}/${numPages}) Tj ET`);

    const streamData = streamParts.join('\n') + '\n';
    const streamLen = new TextEncoder().encode(streamData).length;

    objects.push(`${sid} 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamData}endstream\nendobj`);
  }

  // Font object
  objects.push(`${fontObjId} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`);

  // Cross-reference table
  let pdfString = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(new TextEncoder().encode(pdfString).length);
    pdfString += obj + '\n';
  }

  const xrefOffset = new TextEncoder().encode(pdfString).length;
  pdfString += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

  for (let i = 1; i < offsets.length; i++) {
    const off = String(offsets[i]).padStart(10, '0');
    pdfString += `${off} 00000 n \n`;
  }

  pdfString += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const bytes = new TextEncoder().encode(pdfString);
  return new Blob([bytes], { type: 'application/pdf' });
}

export function downloadAsPdf(title: string, content: string, metadata?: DocumentMetadata): void {
  const blob = generatePdfBlob(title, content, metadata);
  const filename = `${sanitizeFilename(title)}.pdf`;
  triggerDownload(blob, filename);
}

/**
 * Formatted Microsoft Word (.doc) document generator with MSOffice XML namespaces
 */
export function generateDocBlob(title: string, content: string, metadata?: DocumentMetadata): Blob {
  const formattedHtml = content
    .split('\n\n')
    .map((paragraph) => {
      if (paragraph.startsWith('# ')) {
        return `<h1 style="color:#0f172a; text-align:center; font-size:20pt; margin-bottom:12pt;">${paragraph.slice(2)}</h1>`;
      }
      if (paragraph.startsWith('## ')) {
        return `<h2 style="color:#1e293b; font-size:15pt; border-bottom:1pt solid #cbd5e1; padding-bottom:4pt; margin-top:16pt; margin-bottom:8pt;">${paragraph.slice(3)}</h2>`;
      }
      if (paragraph.startsWith('### ')) {
        return `<h3 style="color:#334155; font-size:12pt; margin-top:12pt; margin-bottom:6pt;">${paragraph.slice(4)}</h3>`;
      }
      return `<p style="margin-bottom:8pt; line-height:1.6; font-size:11pt; color:#1e293b;">${paragraph.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');

  const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 8.5in 11in;
      margin: 1in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
    }
    body {
      font-family: 'Times New Roman', 'Calibri', serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #0f172a;
    }
    .header-box {
      border-bottom: 2pt solid #0f172a;
      padding-bottom: 8pt;
      margin-bottom: 20pt;
      text-align: center;
    }
    .meta-table {
      width: 100%;
      margin-bottom: 16pt;
      font-size: 10pt;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="header-box">
    <h1 style="margin:0; font-size:18pt; color:#0f172a;">${title}</h1>
    <div style="font-size:10pt; color:#64748b; margin-top:4pt;">
      ${metadata?.syllabus ? `Syllabus: ${metadata.syllabus} | ` : ''}
      ${metadata?.subject ? `Subject: ${metadata.subject} | ` : ''}
      Date: ${metadata?.date || new Date().toLocaleDateString()}
    </div>
  </div>

  <div class="content-body">
    ${formattedHtml}
  </div>

  <div style="margin-top:30pt; padding-top:10pt; border-top:1pt solid #cbd5e1; font-size:9pt; color:#94a3b8; text-align:center;">
    Generated autonomously by PaperCraft AI Studio & Prompt2Paper Engineering Engine.
  </div>
</body>
</html>
  `.trim();

  return new Blob(['\ufeff' + docHtml], { type: 'application/msword;charset=utf-8' });
}

export function downloadAsDoc(title: string, content: string, metadata?: DocumentMetadata): void {
  const blob = generateDocBlob(title, content, metadata);
  const filename = `${sanitizeFilename(title)}.doc`;
  triggerDownload(blob, filename);
}
