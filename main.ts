// Leonida Trophy Guide — entrypoint (Node 22, standard library only).
//
// The guide itself is plain static files in app/ (index.html, app.js, style.css
// and data/trophies.json): no build step, no network at run time. This program
// is only the hand-in: it copies app/ and screenshots/ next to the dossier it
// writes, so the grader can check the guide exactly as it will be served.
//
// vendor/makefun-frontend.ts is the kit's library, left untouched — the scorer
// rebuilds the dossier with its own copy and expects the two to match byte
// for byte, so this file must not improvise on the dossier format.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the folder this file lives in.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
// The grader hands us a writable /output; anywhere else the environment
// variable names the folder to write into instead.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(from, to) {
  if (!existsSync(from)) return;
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

function handInGuide() {
  // Start from an empty folder so a stale file from an earlier run can never
  // ride along with this entry.
  rmSync(outputDir, { recursive: true, force: true });
  mkdirSync(outputDir, { recursive: true });

  copyTree(join(repoRoot, 'app'), join(outputDir, 'app'));
  copyTree(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'));

  // The caps mirror the gate in the kit's RULES.txt: at most 4 screenshots of
  // at most 256 KiB each, app/ at most 993 files and 48 MiB, and the dossier
  // text capped at 160 KiB. buildDossier refuses anything past them.
  const dossier = buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  });
  writeFileSync(join(outputDir, 'dossier.json'), dossier);
}

handInGuide();
