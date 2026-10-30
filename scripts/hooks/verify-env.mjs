#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// 1. Verify Node.js version >= 20
const currentVersion = process.versions.node;
const majorVersion = parseInt(currentVersion.split('.')[0], 10);

if (majorVersion < 20) {
  console.error(`[verify-env] ERROR: Node.js version >= 20 is required. Current version: ${currentVersion}`);
  process.exit(1);
}

// 2. Verify existence of DESIGN.md and AGENTS.md
const cwd = process.cwd();
const requiredFiles = ['DESIGN.md', 'AGENTS.md'];

for (const file of requiredFiles) {
  const filePath = path.join(cwd, file);
  if (!fs.existsSync(filePath)) {
    console.error(`[verify-env] ERROR: Required specification file missing: ${file}`);
    process.exit(1);
  }
}

// 3. Check for required environment variable names (NEVER print values)
// In development, we allow fallback/mock values if configured, but report status cleanly
const coreEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const optionalOrPhaseSpecificVars = [
  'SUPABASE_PROJECT_REF',
  'SUPABASE_ACCESS_TOKEN',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STITCH_API_KEY',
  'VERCEL_TOKEN',
  'GITHUB_PAT',
];

const missingCore = coreEnvVars.filter((varName) => !process.env[varName]);
if (missingCore.length > 0) {
  console.warn(`[verify-env] NOTE: Core environment variables not currently set: ${missingCore.join(', ')}.`);
  console.warn(`[verify-env] Ensure .env.local or environment settings provide them for production/auth.`);
}

console.log(`[verify-env] SUCCESS: Node.js v${currentVersion} verified, DESIGN.md and AGENTS.md confirmed.`);
process.exit(0);
