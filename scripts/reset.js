#!/usr/bin/env node

/**
 * Anvara Take-Home Project Reset Script
 *
 * This script resets the project to a clean state by removing:
 * - node_modules and pnpm cache
 * - Build outputs (.next, dist, build)
 * - Setup fingerprint
 * - Optionally: environment and database
 */

import { execSync } from 'child_process';
import { existsSync, rmSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

function logError(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

function removeDir(path, name) {
  if (!existsSync(path)) {
    return;
  }

  try {
    rmSync(path, { recursive: true, force: true });
    logSuccess(`Removed ${name}`);
  } catch (error) {
    logWarning(`Failed to remove ${name}: ${error}`);
  }
}

async function main() {
  console.log(`
${colors.cyan}╔══════════════════════════════════════════════════════════╗
║             Anvara Take-Home Project Reset               ║
╚══════════════════════════════════════════════════════════╝${colors.reset}

This will clean the project and remove build artifacts.
`);

  log('\nCleaning dependencies...');
  removeDir(join(ROOT_DIR, 'node_modules'), 'root node_modules');
  removeDir(join(ROOT_DIR, 'apps/frontend/node_modules'), 'frontend node_modules');
  removeDir(join(ROOT_DIR, 'apps/backend/node_modules'), 'backend node_modules');
  removeDir(join(ROOT_DIR, 'packages/config/node_modules'), 'config node_modules');
  removeDir(join(ROOT_DIR, 'packages/eslint-config/node_modules'), 'eslint-config node_modules');
  removeDir(
    join(ROOT_DIR, 'packages/prettier-config/node_modules'),
    'prettier-config node_modules'
  );

  removeDir(join(ROOT_DIR, '.pnpm-store'), '.pnpm-store');

  log('\nCleaning build outputs...');
  removeDir(join(ROOT_DIR, 'apps/frontend/.next'), '.next (frontend)');
  removeDir(join(ROOT_DIR, 'apps/frontend/dist'), 'dist (frontend)');
  removeDir(join(ROOT_DIR, 'apps/backend/dist'), 'dist (backend)');
  removeDir(join(ROOT_DIR, 'apps/backend/build'), 'build (backend)');

  log('\nCleaning generated files...');
  removeDir(join(ROOT_DIR, 'apps/backend/src/generated'), 'Prisma client (generated)');

  log('\nCleaning setup artifacts...');
  removeDir(join(ROOT_DIR, '.setup-fingerprint'), 'setup fingerprint');

  const envPath = join(ROOT_DIR, '.env');
  if (existsSync(envPath)) {
    try {
      const timestamp = Date.now().toString().slice(-6);
      const backupPath = join(ROOT_DIR, `.env.old.${timestamp}`);
      renameSync(envPath, backupPath);
      logSuccess(`Backed up .env to .env.old.${timestamp}`);
    } catch (error) {
      logWarning(`Failed to backup .env: ${error}`);
    }
  }

  log('\nCleaning Docker containers and volumes...');
  try {
    execSync('docker compose down -v', {
      cwd: ROOT_DIR,
      stdio: 'ignore',
    });
    logSuccess('Docker containers and volumes removed');
  } catch {
    logWarning('Docker cleanup skipped (Docker not running or compose not found)');
  }

  console.log(`
${colors.green}✓${colors.reset} Project reset complete!

To set up again, run:
  ${colors.cyan}pnpm setup-project${colors.reset}
`);
}

main().catch((error) => {
  logError(`Reset failed: ${error.message}`);
  process.exit(1);
});
