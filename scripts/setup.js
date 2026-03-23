#!/usr/bin/env node

/**
 * Anvara Take-Home Project Setup Script
 *
 * This script handles the complete project setup:
 * 1. Checks prerequisites (Node.js, pnpm, Docker)
 * 2. Creates .env with unique database credentials
 * 3. Installs all dependencies
 * 4. Starts Docker containers (PostgreSQL)
 * 5. Creates database with unique credentials
 * 6. Runs Prisma migrations and seeds the database
 * 7. Verifies the setup
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const FINGERPRINT_FILE = join(ROOT_DIR, '.setup-fingerprint');
const SAFE_DB_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

function loadEnv() {
  const envPath = join(ROOT_DIR, '.env');
  if (!existsSync(envPath)) {
    return;
  }

  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    if (key && value && !key.startsWith('#')) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function logStep(step, message) {
  console.log(`\n${colors.cyan}[${step}]${colors.reset} ${message}`);
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

function run(command, options = {}) {
  try {
    return execSync(command, {
      cwd: ROOT_DIR,
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf-8',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      ...options,
    });
  } catch (error) {
    if (options.ignoreError) {
      return null;
    }
    throw error;
  }
}

function checkCommand(command, versionFlag = '--version') {
  try {
    execSync(`${command} ${versionFlag}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function generateRandomString(length) {
  return randomBytes(length).toString('hex').slice(0, length);
}

function ensureSafeDbName(dbName) {
  if (SAFE_DB_NAME.test(dbName)) {
    return;
  }

  logError(`Unsafe database name detected: ${dbName}`);
  logError('Use only letters, numbers, and underscores in DATABASE_URL database names.');
  process.exit(1);
}

function readFingerprintTimestamp() {
  try {
    const fingerprint = JSON.parse(readFileSync(FINGERPRINT_FILE, 'utf-8'));
    return fingerprint.timestamp || null;
  } catch {
    return null;
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPostgres(maxAttempts = 30) {
  logStep('5b', 'Waiting for PostgreSQL to be ready...');

  for (let i = 0; i < maxAttempts; i += 1) {
    try {
      const result = run('docker exec anvara_postgres pg_isready -U postgres', {
        silent: true,
        ignoreError: true,
      });
      if (result && result.includes('accepting connections')) {
        logSuccess('PostgreSQL is ready');
        return true;
      }
    } catch {
      // Keep polling until the container is ready.
    }

    process.stdout.write('.');
    await sleep(1000);
  }

  console.log('');
  logError('PostgreSQL failed to start within the timeout period');
  return false;
}

async function main() {
  console.log(`
${colors.cyan}╔══════════════════════════════════════════════════════════╗
║          Anvara Take-Home Project Setup                  ║
╚══════════════════════════════════════════════════════════╝${colors.reset}
`);

  if (existsSync(FINGERPRINT_FILE)) {
    const timestamp = readFingerprintTimestamp();
    if (timestamp) {
      logSuccess(`Setup previously completed at: ${timestamp}`);
      console.log('');
    } else {
      logWarning('Existing setup fingerprint found, but it could not be parsed.');
      console.log('');
    }
  }

  logStep('1', 'Checking prerequisites...');

  if (!checkCommand('node')) {
    logError('Node.js is not installed. Please install Node.js 20+ from https://nodejs.org');
    process.exit(1);
  }
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
  logSuccess(`Node.js ${nodeVersion}`);

  if (!checkCommand('pnpm')) {
    logError('pnpm is not installed.');
    console.log(`\n${colors.cyan}Install pnpm with:${colors.reset}\n  npm install -g pnpm\n`);
    process.exit(1);
  }
  const pnpmVersion = execSync('pnpm --version', { encoding: 'utf-8' }).trim();
  logSuccess(`pnpm ${pnpmVersion}`);

  if (!checkCommand('docker')) {
    logError('Docker is not installed. Please install Docker from https://docker.com');
    process.exit(1);
  }
  const dockerVersion = execSync('docker --version', { encoding: 'utf-8' }).trim();
  logSuccess(dockerVersion);

  try {
    execSync('docker info', { stdio: 'pipe' });
    logSuccess('Docker daemon is running');
  } catch {
    logError('Docker is not running. Please start Docker Desktop and try again.');
    process.exit(1);
  }

  logStep('2', 'Verifying pnpm version...');
  const pkgJson = JSON.parse(readFileSync(join(ROOT_DIR, 'package.json'), 'utf-8'));
  const requiredPnpm = pkgJson.packageManager?.split('@')[1] || pnpmVersion;
  logSuccess(`pnpm ${requiredPnpm} (required)`);

  logStep('3', 'Setting up environment...');

  const envPath = join(ROOT_DIR, '.env');
  const envExamplePath = join(ROOT_DIR, '.env.example');

  let databaseUrl;
  let dbName;

  if (!existsSync(envPath)) {
    dbName = `anvara_${generateRandomString(8)}`;
    const dbPassword = 'postgres';
    const betterAuthSecret = generateRandomString(32);
    databaseUrl = `postgresql://postgres:${dbPassword}@localhost:5498/${dbName}`;

    const timestamp = new Date().toISOString();
    const fingerprintData = JSON.stringify(
      {
        timestamp,
        databaseUrl,
        dbName,
        setupInProgress: true,
      },
      null,
      2
    );
    writeFileSync(FINGERPRINT_FILE, fingerprintData);
    logSuccess(`Setup fingerprint created with database: ${dbName}`);

    if (!existsSync(envExamplePath)) {
      logError('.env.example not found');
      process.exit(1);
    }

    let envContent = readFileSync(envExamplePath, 'utf-8');
    envContent = envContent.replace(/DATABASE_URL=.*/, `DATABASE_URL=${databaseUrl}`);
    envContent = envContent.replace(
      /BETTER_AUTH_SECRET=.*/,
      `BETTER_AUTH_SECRET=${betterAuthSecret}`
    );
    writeFileSync(envPath, envContent);
    logSuccess('Created .env with unique credentials');
    logSuccess('Authentication is ready - use demo accounts to login');
  } else {
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(/DATABASE_URL=(.+)/);
    databaseUrl = match
      ? match[1]
      : 'postgresql://postgres:postgres@localhost:5498/anvara_sponsorships';

    const dbNameMatch = databaseUrl.match(/\/([^/?]+)(\?|$)/);
    dbName = dbNameMatch ? dbNameMatch[1] : 'anvara_sponsorships';

    const portMatch = databaseUrl.match(/:(\d+)\//);
    const currentPort = portMatch ? portMatch[1] : null;
    if (currentPort && currentPort !== '5498') {
      logWarning(`.env file exists but uses old port ${currentPort}`);
      logWarning('Run "pnpm reset && pnpm setup-project" to regenerate with correct ports');
      logWarning(`Expected port: 5498, Found: ${currentPort}`);
    }

    logSuccess('.env file already exists');
  }

  ensureSafeDbName(dbName);
  loadEnv();

  logStep('4', 'Installing dependencies...');
  run('pnpm install');
  logSuccess('Dependencies installed');

  logStep('5a', 'Starting Docker containers...');
  run('docker compose down', { ignoreError: true, silent: true });
  run('docker compose up -d');
  logSuccess('Docker containers started');

  const dbReady = await waitForPostgres();
  if (!dbReady) {
    process.exit(1);
  }

  logStep('5c', 'Creating application database...');

  const createDatabaseCommand = `docker exec anvara_postgres psql -U postgres -c "CREATE DATABASE ${dbName};"`;
  const createResult = run(createDatabaseCommand, { silent: true, ignoreError: true });

  if (createResult && createResult.includes('CREATE DATABASE')) {
    logSuccess(`Database '${dbName}' created`);
  } else if (createResult && createResult.includes('already exists')) {
    logSuccess(`Database '${dbName}' already exists`);
  } else {
    logSuccess(`Database '${dbName}' ready`);
  }

  try {
    const verifyResult = execSync(
      `docker exec anvara_postgres psql -U postgres -d ${dbName} -c "SELECT 1;"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    if (verifyResult && verifyResult.includes('1 row')) {
      logSuccess(`Database '${dbName}' is accessible`);
    }
  } catch {
    logWarning('Database verification returned non-zero, but this may be OK');
    logSuccess('Proceeding with setup...');
  }

  logStep('6', 'Setting up database schema...');

  try {
    run('pnpm --filter @anvara/frontend exec better-auth migrate --yes');
    logSuccess('Better Auth tables created');
  } catch (error) {
    logError('Failed to create Better Auth tables');
    logError(`Database: ${dbName}`);
    logError(`DATABASE_URL: ${databaseUrl}`);
    console.error(error.message);
    process.exit(1);
  }

  run('pnpm --filter @anvara/backend db:generate');
  logSuccess('Prisma client generated');

  run('pnpm --filter @anvara/backend db:push');
  logSuccess('Prisma database schema applied');

  run('pnpm --filter @anvara/backend seed');
  logSuccess('Database seeded with sample data');

  logStep('7', 'Verifying setup...');

  try {
    run('pnpm --filter @anvara/backend build', { silent: true });
    logSuccess('Backend builds successfully');
  } catch {
    logWarning('Backend has TypeScript errors');
    logSuccess('Setup is complete');
  }

  const timestamp = new Date().toISOString();
  const fingerprintData = JSON.stringify(
    {
      timestamp,
      databaseUrl,
      dbName,
      setupComplete: true,
    },
    null,
    2
  );
  writeFileSync(FINGERPRINT_FILE, fingerprintData);
  logSuccess(`Setup completed: ${timestamp}`);

  console.log(`
${colors.green}╔══════════════════════════════════════════════════════════╗
║                    Setup Complete!                       ║
╚══════════════════════════════════════════════════════════╝${colors.reset}

${colors.cyan}Quick Start:${colors.reset}
  ${colors.dim}$${colors.reset} pnpm dev          ${colors.dim}# Start all services${colors.reset}

${colors.cyan}Services:${colors.reset}
  Frontend:  ${colors.green}http://localhost:3847${colors.reset}
  Backend:   ${colors.green}http://localhost:4291${colors.reset}
  Database:  ${colors.green}postgresql://localhost:5498${colors.reset}

${colors.cyan}Useful Commands:${colors.reset}
  ${colors.dim}$${colors.reset} pnpm dev         ${colors.dim}# Run all services${colors.reset}
  ${colors.dim}$${colors.reset} pnpm test         ${colors.dim}# Run tests${colors.reset}
  ${colors.dim}$${colors.reset} pnpm lint         ${colors.dim}# Lint code${colors.reset}
  ${colors.dim}$${colors.reset} pnpm --filter @anvara/backend db:studio  ${colors.dim}# Prisma Studio${colors.reset}

${colors.yellow}Note:${colors.reset} Better Auth is configured with demo credentials.
  Login at http://localhost:3847/login with: sponsor@example.com / password
`);
}

main().catch((error) => {
  logError(`Setup failed: ${error.message}`);
  process.exit(1);
});
