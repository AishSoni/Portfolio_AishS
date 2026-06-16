#!/usr/bin/env node
/**
 * CI guard: portfolio must never reference service_role (spec 14 §7).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN_DIRS = ["src", ".env.example"];
const IGNORE = new Set(["check-security.mjs"]);
const ALLOW_SERVICE_ROLE_MENTION = new Set([
  "src/utils/supabase.ts",
  ".env.example",
]);

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (IGNORE.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (/\.(ts|tsx|js|mjs|example)$/.test(name)) files.push(p);
  }
  return files;
}

const hits = [];
for (const rel of SCAN_DIRS) {
  const abs = join(ROOT, rel);
  try {
    const st = statSync(abs);
    const files = st.isDirectory() ? walk(abs) : [abs];
    for (const file of files) {
      const rel = file.replace(ROOT, "").replace(/^\//, "");
      if (ALLOW_SERVICE_ROLE_MENTION.has(rel)) continue;
      const content = readFileSync(file, "utf8");
      if (/service_role/i.test(content)) {
        hits.push(rel);
      }
    }
  } catch {
    // skip missing paths
  }
}

if (hits.length > 0) {
  console.error("service_role must not appear in portfolio source:");
  for (const h of hits) console.error(" ", h);
  process.exit(1);
}

const ALLOW_GET_SUPABASE = [
  "src/utils/supabase.ts",
  "src/lib/dashboard/supabase.repository.ts",
  "src/utils/resume.ts",
  "src/app/r/",
];

const supabaseImports = [];
for (const file of walk(join(ROOT, "src"))) {
  const relPath = file.replace(ROOT, "").replace(/^\//, "");
  if (ALLOW_GET_SUPABASE.some((p) => relPath === p || relPath.startsWith(p))) continue;
  const content = readFileSync(file, "utf8");
  if (content.includes("getSupabase")) {
    supabaseImports.push(relPath);
  }
}

if (supabaseImports.length > 0) {
  console.error(
    "getSupabase() outside allowed paths (resume + dashboard repository):"
  );
  for (const h of supabaseImports) console.error(" ", h);
  process.exit(1);
}

const CLIENT_ANALYTICS_PREFIXES = [
  "src/lib/analytics/",
  "src/components/analytics/",
];

const secretHits = [];
for (const file of walk(join(ROOT, "src"))) {
  const relPath = file.replace(ROOT, "").replace(/^\//, "");
  if (!CLIENT_ANALYTICS_PREFIXES.some((p) => relPath.startsWith(p))) continue;
  const content = readFileSync(file, "utf8");
  if (/SECRET_PORTFOLIO|MERM_API_URL/i.test(content)) {
    secretHits.push(relPath);
  }
}

if (secretHits.length > 0) {
  console.error("Analytics client code must not reference MERM secrets or API URL:");
  for (const h of secretHits) console.error(" ", h);
  process.exit(1);
}

console.log("Security checks passed.");
