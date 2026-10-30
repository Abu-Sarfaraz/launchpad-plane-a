import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

describe('Phase 1 Scaffolding & Guardrails', () => {
  it('executes verify-env hook script with exit code 0', () => {
    const scriptPath = path.resolve(__dirname, '../../scripts/hooks/verify-env.mjs');
    expect(fs.existsSync(scriptPath)).toBe(true);
    const output = execSync(`node "${scriptPath}"`, { encoding: 'utf8' });
    expect(output).toContain('[verify-env] SUCCESS');
  });

  it('sql-rls-circuit-breaker blocks DROP statements', () => {
    const scriptPath = path.resolve(__dirname, '../../scripts/hooks/sql-rls-circuit-breaker.mjs');
    expect(fs.existsSync(scriptPath)).toBe(true);

    expect(() => {
      execSync(`node "${scriptPath}" "DROP TABLE users;"`, { stdio: 'pipe' });
    }).toThrow();
  });

  it('sql-rls-circuit-breaker blocks TRUNCATE statements', () => {
    const scriptPath = path.resolve(__dirname, '../../scripts/hooks/sql-rls-circuit-breaker.mjs');
    expect(() => {
      execSync(`node "${scriptPath}" "TRUNCATE TABLE projects;"`, { stdio: 'pipe' });
    }).toThrow();
  });

  it('sql-rls-circuit-breaker blocks CREATE TABLE without ENABLE ROW LEVEL SECURITY', () => {
    const scriptPath = path.resolve(__dirname, '../../scripts/hooks/sql-rls-circuit-breaker.mjs');
    expect(() => {
      execSync(
        `node "${scriptPath}" "CREATE TABLE projects (id uuid primary key);"` ,
        { stdio: 'pipe' }
      );
    }).toThrow();
  });

  it('sql-rls-circuit-breaker permits valid CREATE TABLE with ENABLE ROW LEVEL SECURITY', () => {
    const scriptPath = path.resolve(__dirname, '../../scripts/hooks/sql-rls-circuit-breaker.mjs');
    const validSql = `
      CREATE TABLE projects (id uuid primary key);
      ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow authenticated read" ON projects FOR SELECT USING (auth.uid() IS NOT NULL);
    `;
    const output = execSync(`node "${scriptPath}" "${validSql}"`, { encoding: 'utf8' });
    expect(output).toContain('[sql-rls-circuit-breaker] PASSED');
  });

  it('confirms DESIGN.md and AGENTS.md exist in project root', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../DESIGN.md'))).toBe(true);
    expect(fs.existsSync(path.resolve(__dirname, '../../AGENTS.md'))).toBe(true);
  });
});
