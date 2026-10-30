import katex from 'katex';

/**
 * Safely renders LaTeX string into HTML with KaTeX.
 * If rendering fails, safely returns fallback escaped string.
 */
export function renderLatexToString(latex: string, displayMode = false): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode,
      output: 'htmlAndMathml',
    });
  } catch {
    return latex;
  }
}

/**
 * Parses mixed text containing inline ($...$) and display ($$...$$) LaTeX expressions
 * and renders them into an HTML string.
 */
export function renderMixedLatexToHtml(content: string): string {
  if (!content) return '';

  // First handle display math $$...$$
  let result = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    return `<div class="katex-display my-2">${renderLatexToString(math.trim(), true)}</div>`;
  });

  // Then handle inline math $...$
  result = result.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    return renderLatexToString(math.trim(), false);
  });

  // Also handle raw LaTeX commands if not wrapped in $ (e.g. \frac{a}{b})
  if (result === content && (content.includes('\\frac') || content.includes('\\sqrt') || content.includes('\\times') || content.includes('\\pm'))) {
    return renderLatexToString(content, false);
  }

  return result;
}
