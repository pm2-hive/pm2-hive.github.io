// Consolidates the PM2 Plus and PM2 Enterprise doc trees (imported from
// pm2.io) into one page per product:
//   docs/plus/**       -> docs/plus-full.md       (/docs/pm2-plus/)
//   docs/enterprise/** -> docs/enterprise-full.md (/docs/pm2-enterprise/)
//
// Each source page keeps its own file (with a redirect_to pointing at its
// anchor in the consolidated page); this script strips the front matter and
// concatenates the bodies, prefixing each with an <a id> anchor derived from
// the old permalink so those redirects land on the right section.

const fs = require("fs");
const path = require("path");

const pattern = /^(= yaml =|---)$[\s\S]*?\1$/m;

const PRODUCTS = [
  {
    dir: "docs/plus",
    out: "docs/plus-full.md",
    permalink: "/docs/pm2-plus/",
    title: "PM2 Plus Documentation",
    description:
      "The complete PM2 Plus documentation on a single page: monitoring dashboard, custom metrics and actions, realtime logs, profiling and notifications.",
    // Former sidebar order (_data/nav_io.yml); remaining pages follow alphabetically.
    first: [
      "docs/plus/overview.md",
      "docs/plus/quick-start.md",
      "docs/plus/guide/server-apps-overview.md",
      "docs/plus/guide/app-dashboard.md",
      "docs/plus/guide/notifications.md",
      "docs/plus/guide/issue-dashboard.md",
      "docs/plus/guide/custom-metrics.md",
      "docs/plus/guide/custom-actions.md",
      "docs/plus/guide/realtime-logs.md",
      "docs/plus/reference/pm2io.md",
      "docs/plus/guide/modules.md",
      "docs/plus/best-practices/metrics-glossary.md",
    ],
    last: ["docs/plus/faq.md"],
  },
  {
    dir: "docs/enterprise",
    out: "docs/enterprise-full.md",
    permalink: "/docs/pm2-enterprise/",
    title: "PM2 Enterprise Documentation",
    description:
      "The complete PM2 Enterprise documentation on a single page: on-premise installation, collectors, distributed tracing, frontend monitoring, alerting and dashboards.",
    first: [
      "docs/enterprise/overview.md",
      "docs/enterprise/guides/distributed-tracing.md",
      "docs/enterprise/guides/profiling.md",
      "docs/enterprise/guides/alerting.md",
      "docs/enterprise/guides/dashboard.md",
      "docs/enterprise/guides/log.md",
      "docs/enterprise/guides/webchecks.md",
      "docs/enterprise/collector/go.md",
      "docs/enterprise/collector/prometheus.md",
    ],
    last: [],
  },
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : [];
  });
}

function frontMatter(markdown) {
  const match = markdown.match(pattern);
  return match ? match[0] : "";
}

function field(fm, name) {
  const match = fm.match(new RegExp(`^${name}: *"?([^"\\n]*)"?$`, "m"));
  return match ? match[1].trim() : "";
}

function anchor(permalink) {
  return permalink
    .replace(/^\/docs\/(plus|enterprise)\//, "")
    .replace(/\/+$/, "")
    .replace(/\//g, "-");
}

for (const product of PRODUCTS) {
  const ordered = [...product.first];
  for (const file of walk(product.dir).sort()) {
    if (!ordered.includes(file) && !product.last.includes(file)) ordered.push(file);
  }
  ordered.push(...product.last);

  const fp = fs.openSync(product.out, "w");
  fs.writeSync(
    fp,
    `\
---
layout: docs-io
title: ${product.title}
description: "${product.description}"
permalink: ${product.permalink}
---
`
  );

  let count = 0;
  for (const file of ordered) {
    const markdown = fs.readFileSync(file, { encoding: "utf-8" });
    const fm = frontMatter(markdown);
    const permalink = field(fm, "permalink");
    const redirect = field(fm, "redirect_to");

    // Pages redirecting elsewhere (e.g. on-premise README -> GitHub) carry no content.
    if (redirect && !redirect.startsWith(product.permalink)) continue;

    fs.writeSync(fp, `\n<a id="${anchor(permalink)}"></a>\n`);
    fs.writeSync(fp, markdown.replace(pattern, "").trim() + "\n");
    count++;
  }
  fs.closeSync(fp);
  console.log(`${product.out} written (${count} pages)`);
}
