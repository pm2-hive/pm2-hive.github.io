// Sets last_modified_at in the front-matter of every docs page from its
// last git commit date. Idempotent: only rewrites files whose date changed.
// Consumed by the TechArticle JSON-LD (_includes/head.html) and the
// sitemap <lastmod> (_includes/sitemapxml.html).
// Usage: node scripts/update-last-modified.js  (from the repository root)

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function collectPages(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) collectPages(file, files);
    else if (entry.name.endsWith(".md") && entry.name !== "index.html.md") files.push(file);
  }
  return files;
}

let updated = 0;
for (const file of collectPages("docs")) {
  if (file === path.join("docs", "full.md")) continue;
  const source = fs.readFileSync(file, "utf-8");
  if (!/^permalink:/m.test(source)) continue;

  const date = execFileSync("git", ["log", "-1", "--format=%as", "--", file], {
    encoding: "utf-8"
  }).trim();
  if (!date) continue; // not committed yet

  let result;
  if (/^last_modified_at:/m.test(source)) {
    result = source.replace(/^last_modified_at:.*$/m, `last_modified_at: ${date}`);
  } else {
    result = source.replace(/^(permalink:.*)$/m, `$1\nlast_modified_at: ${date}`);
  }
  if (result !== source) {
    fs.writeFileSync(file, result);
    updated++;
  }
}
console.log(`last_modified_at: ${updated} file(s) updated`);
