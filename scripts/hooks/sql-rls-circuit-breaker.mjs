#!/usr/bin/env node
import fs from 'node:fs';

/**
 * SQL / RLS Circuit Breaker Hook
 * Matches: mcp(supabase/apply_migration) | mcp(supabase/execute_sql)
 * - Blocks DROP and TRUNCATE statements.
 * - Blocks CREATE TABLE statements lacking ENABLE ROW LEVEL SECURITY.
 */

async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
    // In case stdin is empty or not attached
    setTimeout(() => {
      if (!data) resolve('');
    }, 100);
  });
}

async function main() {
  const stdinData = await readStdin();
  let sqlPayload = '';

  if (stdinData && stdinData.trim()) {
    try {
      const parsed = JSON.parse(stdinData);
      // Tool call payload can be in tool_call.arguments.query or tool_call.arguments.sql or arguments
      const args = parsed.arguments || (parsed.tool_call && parsed.tool_call.arguments) || parsed;
      sqlPayload = args.query || args.sql || args.migration || (typeof args === 'string' ? args : '');
    } catch {
      sqlPayload = stdinData;
    }
  }

  // Also check if SQL was passed via process.argv
  if (!sqlPayload && process.argv.length > 2) {
    const arg = process.argv[2];
    if (fs.existsSync(arg)) {
      sqlPayload = fs.readFileSync(arg, 'utf8');
    } else {
      sqlPayload = arg;
    }
  }

  if (!sqlPayload || !sqlPayload.trim()) {
    // If no SQL payload inspected, exit clean
    process.exit(0);
  }

  const upperSql = sqlPayload.toUpperCase();

  // 1. Block destructive DROP statements (e.g. DROP TABLE, DROP DATABASE, DROP SCHEMA)
  if (/\bDROP\s+(TABLE|DATABASE|SCHEMA)\b/.test(upperSql)) {
    console.error('[sql-rls-circuit-breaker] BLOCKED: Destructive DROP statement detected.');
    process.exit(1);
  }

  // 2. Block TRUNCATE statements
  if (/\bTRUNCATE\b/.test(upperSql)) {
    console.error('[sql-rls-circuit-breaker] BLOCKED: Destructive TRUNCATE statement detected.');
    process.exit(1);
  }

  // 3. For any CREATE TABLE, enforce ENABLE ROW LEVEL SECURITY
  const createTableMatches = upperSql.match(/\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_."]+)/g);
  if (createTableMatches && createTableMatches.length > 0) {
    if (!upperSql.includes('ENABLE ROW LEVEL SECURITY')) {
      console.error(
        '[sql-rls-circuit-breaker] BLOCKED: CREATE TABLE detected without ALTER TABLE ... ENABLE ROW LEVEL SECURITY.'
      );
      process.exit(1);
    }
  }

  console.log('[sql-rls-circuit-breaker] PASSED: SQL migration passed safety and RLS validation.');
  process.exit(0);
}

main().catch((err) => {
  console.error('[sql-rls-circuit-breaker] Internal Error:', err);
  process.exit(1);
});
