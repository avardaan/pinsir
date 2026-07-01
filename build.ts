import { cpSync, mkdirSync, existsSync, rmSync } from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

// Clean dist
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true });
}
mkdirSync(distDir, { recursive: true });

// Copy static files
const filesToCopy = [
  'manifest.json',
  'src/popup.html',
  'src/popup.css',
];

for (const file of filesToCopy) {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, path.basename(file));
  cpSync(src, dest, { recursive: true });
}

// Copy assets directory
const assetsSrc = path.join(rootDir, 'assets');
const assetsDest = path.join(distDir, 'assets');
cpSync(assetsSrc, assetsDest, { recursive: true });

// Run tsc
const tscResult = Bun.spawnSync({
  cmd: ['tsc'],
  cwd: rootDir,
  stdout: 'inherit',
  stderr: 'inherit',
});

if (tscResult.exitCode !== 0) {
  process.exit(tscResult.exitCode ?? 1);
}

console.log('Build complete.');
