import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Phase 5 Layout Grid & Viewport Standards (DESIGN.md Section 4)', () => {
  it('confirms 3 target viewports are defined in playwright.config.ts', () => {
    const configPath = path.resolve(__dirname, '../../playwright.config.ts');
    expect(fs.existsSync(configPath)).toBe(true);
    const content = fs.readFileSync(configPath, 'utf8');

    // Desktop 1440px
    expect(content).toContain('1440');
    // Tablet 768px
    expect(content).toContain('768');
    // Mobile 390px
    expect(content).toContain('390');
  });

  it('confirms tailwind.config.ts maps responsive breakpoints properly', () => {
    const twPath = path.resolve(__dirname, '../../tailwind.config.ts');
    const content = fs.readFileSync(twPath, 'utf8');

    expect(content).toContain("sm: '390px'");
    expect(content).toContain("md: '768px'");
    expect(content).toContain("'2xl': '1440px'");
  });

  it('confirms accessibility test suite exists with WCAG AA tags', () => {
    const a11ySpecPath = path.resolve(
      __dirname,
      '../../tests/e2e/accessibility-axe.spec.ts'
    );
    expect(fs.existsSync(a11ySpecPath)).toBe(true);
    const content = fs.readFileSync(a11ySpecPath, 'utf8');
    expect(content).toContain("'wcag2a'");
    expect(content).toContain("'wcag2aa'");
  });
});
