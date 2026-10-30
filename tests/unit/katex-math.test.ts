import { describe, it, expect } from 'vitest';
import { renderLatexToString, renderMixedLatexToHtml } from '@/lib/math/katex';

describe('KaTeX Math Equation Engine', () => {
  it('renders standard mathematical fractions to HTML string', () => {
    const latex = '\\frac{a}{b} \\cdot \\sqrt{x^2 + y^2}';
    const html = renderLatexToString(latex, false);

    expect(html).toContain('katex');
    expect(html).toContain('mfrac');
  });

  it('renders display mode equations with proper markup', () => {
    const latex = 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}';
    const html = renderLatexToString(latex, true);

    expect(html).toContain('katex-display');
  });

  it('handles inline math $...$ and display math $$...$$ in mixed text', () => {
    const mixed = 'Evaluate the integral $I = \\int_0^1 x^2 \\, dx$ and state the theorem:\n$$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$';
    const html = renderMixedLatexToHtml(mixed);

    expect(html).toContain('katex');
    expect(html).toContain('katex-display');
    expect(html).toContain('Evaluate the integral');
  });

  it('safely handles malformed LaTeX expressions without throwing exceptions', () => {
    const malformed = '\\frac{incomplete{unclosed';
    expect(() => {
      const result = renderLatexToString(malformed);
      expect(typeof result).toBe('string');
    }).not.toThrow();
  });

  it('renders un-delimited LaTeX environments such as cases and matrices', () => {
    const rawCases = 'Solve the system:\\begin{cases} 3x + 2y = 12 \\\\ x - y = 1 \\end{cases}';
    const html = renderMixedLatexToHtml(rawCases);

    expect(html).toContain('katex-display');
    expect(html).toContain('Solve the system:');
  });

  it('preserves English words as plain text when math is delimited with $', () => {
    const mixed = 'Calculate $\\frac{3.4 \\times 10^7}{8.5 \\times 10^{-3}}$, giving your answer in standard form $A \\times 10^n$ where $1 \\le A < 10$.';
    const html = renderMixedLatexToHtml(mixed);

    expect(html).toContain('Calculate');
    expect(html).toContain('giving your answer in standard form');
    expect(html).toContain('katex');
    expect(html).toContain('mfrac');
  });
});
