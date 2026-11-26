// Make the Judge Laugh in One Line (Node 22, standard library only).
//
// The program writes exactly one funny line to /output/entry.txt
// (or to the directory named by MAKEFUN_OUTPUT_DIR when set):
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Deterministic: no network, no randomness, no time or environment input
// beyond the output directory. Every run writes identical bytes.
//
// ---------------------------------------------------------------------------
// Why the line is funny (setup / turn / punch)
// ---------------------------------------------------------------------------
// Setup  — "My robot vacuum mapped the whole house": a sensible, helpful
//          chore. A robot vacuum that maps the house is doing its job well,
//          so the listener pictures a competent little helper.
// Turn   — "then formed a union with the dishwasher": the appliances stop
//          being tools and start acting like workers. Personifying gadgets
//          as colleagues who can organize is the incongruity that makes the
//          listener smile: household machines now have labour rights.
// Punch  — "now neither of them works unless I mop first": the strike lands
//          and the jobs reverse. The machines outsourced the work back to
//          their owner — the human bought robots to avoid mopping, and now
//          mopping is the price of getting the robots to work at all.
// The joke works because each beat is short, the escalation is fast, and
// the final image (a person mopping so the vacuum will condescend to run)
// is the exact opposite of what the gadgets were bought for.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// ---------------------------------------------------------------------------
// The entry, built from its three joke beats
// ---------------------------------------------------------------------------
// The beats are kept as separate constants so the structure of the joke is
// visible in the code, and so the entry can be checked beat by beat. Joined
// in order they form the entry line, unchanged, character for character.
const SETUP_BEAT =
  'My robot vacuum mapped the whole house, ';
const TURN_BEAT =
  'then formed a union with the dishwasher — ';
const PUNCH_BEAT =
  'now neither of them works unless I mop first.';

// The entry: one self-contained line, 127 characters. Do not edit the beats
// above — the wording is the submission and must stay exactly as written.
const ENTRY_TEXT: string = SETUP_BEAT + TURN_BEAT + PUNCH_BEAT;

// Competition gate (competition.yaml): /output/entry.txt must be UTF-8 text
// of 1-200 characters, not only whitespace, and a single line.
const MAX_ENTRY_CHARS = 200;

// ---------------------------------------------------------------------------
// Entry validation: one small check per gate item
// ---------------------------------------------------------------------------
// Each check throws naming the gate item it enforces, so a failure tells
// the reader which requirement was missed instead of a bare character count.

function checkNotBlank(text: string): void {
  if (text.trim().length === 0) {
    throw new Error('gate failed: entry must not be only whitespace');
  }
}

function checkSingleLine(text: string): void {
  if (text.includes('\n') || text.includes('\r')) {
    throw new Error(
      'gate failed: entry must be a single line with no line break',
    );
  }
}

function checkLength(text: string, maxChars: number): number {
  // Spread into code points so a multi-byte character (here the em dash)
  // counts as one character, matching the competition's character limit.
  const chars = [...text].length;
  if (chars < 1 || chars > maxChars) {
    throw new Error(
      `gate failed: entry must be 1-${maxChars} characters, got ${chars}`,
    );
  }
  return chars;
}

// Runs every gate check and returns the exact bytes to write: the entry
// line plus one trailing newline, which keeps the file a well-formed
// single-line text file without changing the entry itself.
function buildEntryFileContent(text: string, maxChars: number): string {
  checkNotBlank(text);
  checkSingleLine(text);
  checkLength(text, maxChars);
  return text + '\n';
}

// ---------------------------------------------------------------------------
// Output: resolve the directory, then write the file
// ---------------------------------------------------------------------------

// Inside the grader's container the output directory is /output. Outside
// it, MAKEFUN_OUTPUT_DIR stands in for /output so the program can be run
// and checked locally without root-owned paths.
// An empty MAKEFUN_OUTPUT_DIR is treated as unset: mkdirSync('') would
// throw, so fall back to /output instead of passing an empty path through.
function resolveOutputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR || '/output';
}

function writeEntry(outDir: string, content: string): void {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'entry.txt'), content, 'utf8');
}

// ---------------------------------------------------------------------------
// Main: compose, validate, write — nothing else
// ---------------------------------------------------------------------------

function main(): void {
  const content = buildEntryFileContent(ENTRY_TEXT, MAX_ENTRY_CHARS);
  writeEntry(resolveOutputDir(), content);
}

main();
