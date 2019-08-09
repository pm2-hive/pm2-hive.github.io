const fs = require("fs");
const path = require("path");

const files = new Set([
  "docs/features/quick-start.md",
  ...fs.readdirSync("docs/features").map(file => `docs/features/${file}`)
]);

const pattern = /^(= yaml =|---)$[\s\S]*?\1$/m;

function normalize(markdown) {
  return markdown.replace(pattern, "");
}

const fp = fs.openSync("docs/full.md", "w");

fs.writeSync(
  fp,
  `\
---
layout: docs
title: Single Page Doc
description: One page documentation
permalink: /docs/usage/pm2-doc-single-page/
---
`
);

for (const file of files) {
  fs.writeSync(fp, normalize(fs.readFileSync(file, { encoding: "utf-8" })));
}
fs.closeSync(fp);
