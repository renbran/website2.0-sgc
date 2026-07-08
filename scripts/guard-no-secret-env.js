#!/usr/bin/env node
/**
 * Pre-tool hook guard for Bash invocations.
 *
 * Refuses commands that try to read or write files inside a `.env*`
 * pattern, which would leak secrets to the assistant transcript.
 *
 * Wired in `.claude/settings.json` under `hooks.PreToolUse` for the `Bash`
 * matcher. Exit code 0 = allow, 2 = block.
 */
const input = (() => {
  try {
    const raw = require("fs").readFileSync(0, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
})();

const command = input?.tool_input?.command ?? "";
const lower = command.toLowerCase();

const blocked = [
  /cat\s+\.env/,
  /cat\s+.*\.env\.local/,
  /type\s+\.env/,
  /less\s+\.env/,
  /more\s+\.env/,
  /head\s+\.env/,
  /tail\s+\.env/,
  /\bvi\s+\.env/,
  /\bnano\s+\.env/,
  /\bcode\s+\.env/,
  /\bcp\s+\.env/,
  /\bmv\s+\.env/,
  /\brm\s+\.env/,
  /echo\s+.*>\s*\.env/,
  /echo\s+.*>>\s*\.env/,
  /\btee\s+\.env/,
];

if (blocked.some((re) => re.test(lower))) {
  console.error(
    "Refusing to run a command that touches a .env* file. Secrets stay out of the transcript.",
  );
  process.exit(2);
}

process.exit(0);