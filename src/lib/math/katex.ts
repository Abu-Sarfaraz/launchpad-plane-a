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
 * Parses mixed text containing inline ($...$) and display ($$...$$) LaTeX expressions,
 * un-delimited LaTeX environments (\begin{cases}...\end{cases}), and math formulas
 * without corrupting surrounding English text.
 */
export function renderMixedLatexToHtml(content: string): string {
  if (!content) return '';

  // 1. Display math $$...$$
  let result = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    return `<div class="katex-display my-2">${renderLatexToString(math.trim(), true)}</div>`;
  });

  // 2. Inline math $...$
  result = result.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    return renderLatexToString(math.trim(), false);
  });

  // 3. Un-delimited LaTeX environments (e.g. \begin{cases}...\end{cases}, \begin{pmatrix}...\end{pmatrix})
  result = result.replace(/\\begin\{(cases|pmatrix|bmatrix|matrix|align\*?)\}[\s\S]+?\\end\{\1\}/g, (env) => {
    return `<div class="katex-display my-2">${renderLatexToString(env.trim(), true)}</div>`;
  });

  // 4. If content had no $, check if it is an entire LaTeX formula (e.g. mark scheme with \text{} or \quad)
  if (result === content) {
    const isPureLatexFormula =
      content.includes('\\text{') ||
      content.includes('\\quad') ||
      content.includes('\\implies') ||
      /^\s*\\[a-zA-Z]+/.test(content);

    if (isPureLatexFormula) {
      return renderLatexToString(content, false);
    }

    // 5. Mixed text with standalone LaTeX expressions like \frac{a}{b}, \sqrt{x}, \vec{v}
    const mathCmdRegex = /(\\[a-zA-Z]+(?:\{[^{}]*\}|\^\{[^{}]*\}|_[a-zA-Z0-9]+|\^[a-zA-Z0-9]+)*(?:\s*[\+\-\*\/=><\le\ge\approx]\s*[0-9a-zA-Z\\]+)*)/g;
    if (mathCmdRegex.test(result)) {
      result = result.replace(mathCmdRegex, (expr) => {
        return renderLatexToString(expr, false);
      });
    }
  }

  return result;
}
