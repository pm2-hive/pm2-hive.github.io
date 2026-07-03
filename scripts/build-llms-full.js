// Generates the LLM-oriented documentation artifacts (https://llmstxt.org):
// - /llms-full.txt: the whole documentation as a single Markdown file,
//   ordered like _data/nav.yml
// - per-page Markdown mirrors at <permalink>index.html.md, so agents
//   following llms.txt links get clean Markdown instead of full HTML
// Usage: node scripts/build-llms-full.js  (from the repository root)

const fs = require("fs");
const path = require("path");

const SITE_URL = "https://pm2.keymetrics.io";
const FRONT_MATTER = /^(= yaml =|---)$[\s\S]*?\1$/m;

// _data/nav.yml is a flat two-level list of title/url pairs; a line-based
// parser keeps the script dependency-free (the repo has no package.json).
function parseNav(file) {
  const entries = [];
  let inSubnav = false;
  let pending = null;
  for (const line of fs.readFileSync(file, "utf-8").split("\n")) {
    if (/^- title:/.test(line)) {
      inSubnav = false;
    } else if (/^\s+subnav:/.test(line)) {
      inSubnav = true;
    } else if (inSubnav) {
      const title = line.match(/^\s+- title:\s*(.+?)\s*$/);
      const url = line.match(/^\s+url:\s*(\S+)/);
      if (title) pending = title[1].replace(/^"(.*)"$/, "$1");
      if (url && pending) {
        entries.push({ title: pending, url: url[1] });
        pending = null;
      }
    }
  }
  return entries;
}

function collectDocs(dir, map = {}) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectDocs(file, map);
    } else if (
      entry.name.endsWith(".md") &&
      entry.name !== "index.html.md" &&
      file !== path.join("docs", "full.md")
    ) {
      const source = fs.readFileSync(file, "utf-8");
      const permalink = source.match(/^permalink:\s*(\S+)/m);
      if (permalink) map[permalink[1]] = source;
    }
  }
  return map;
}

const nav = parseNav(path.join("_data", "nav.yml"));
const docs = collectDocs("docs");

const missing = nav.filter(entry => !docs[entry.url]);
if (missing.length > 0) {
  console.error("No docs file found for nav entries:");
  missing.forEach(entry => console.error(`  ${entry.title} (${entry.url})`));
  process.exit(1);
}

const sections = nav.map(entry => {
  const body = docs[entry.url].replace(FRONT_MATTER, "").trim();
  return `# ${entry.title}\nSource: ${SITE_URL}${entry.url}\n\n${body}\n`;
});

const header = `\
# PM2 Documentation

> PM2 is a production process manager for Node.js applications with a built-in
> load balancer. It keeps applications alive forever, reloads them without
> downtime, manages logs, and facilitates common system admin tasks.

`;

fs.writeFileSync("llms-full.txt", header + sections.join("\n---\n\n"));
console.log(`llms-full.txt written (${sections.length} pages)`);

// Per-page Markdown mirrors: <permalink>index.html.md (static passthrough,
// no front-matter, so Jekyll copies them verbatim and skips them in sitemap)
const wanted = new Set();
nav.forEach((entry, i) => {
  const mirror = path.join(entry.url.replace(/^\//, ""), "index.html.md");
  wanted.add(mirror);
  fs.mkdirSync(path.dirname(mirror), { recursive: true });
  fs.writeFileSync(mirror, sections[i]);
});

// Remove mirrors whose permalink no longer exists in the nav
function collectMirrors(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) collectMirrors(file, files);
    else if (entry.name === "index.html.md") files.push(file);
  }
  return files;
}
for (const mirror of collectMirrors("docs")) {
  if (!wanted.has(mirror)) {
    fs.unlinkSync(mirror);
    console.log(`removed stale mirror: ${mirror}`);
  }
}
console.log(`markdown mirrors written (${wanted.size} pages)`);
