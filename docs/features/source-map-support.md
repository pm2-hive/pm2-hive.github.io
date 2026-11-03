---
layout: docs
title: Source map support
description: Source map support for BabelJS/Typescript and any transpiler
permalink: /docs/usage/source-map-support/
last_modified_at: 2026-11-03
---

If you use [BabelJS](https://babeljs.io/), [Typescript](http://www.typescriptlang.org/) or any other Javascript superset you may have noticed that when an exception occurs, the stacktrace is not meaningful at all. To get useful information you need to generate [source map files](https://developer.mozilla.org/en-US/docs/Glossary/Source_map).

## Source map

Since PM2 7, source maps are handled natively by Node.js: every process container calls `process.setSourceMapsEnabled(true)` before loading your app, so stack traces are mapped back to the original sources.

Node.js finds the map through the `//# sourceMappingURL=` comment emitted by your transpiler (e.g. `tsc --sourceMap`, `babel --source-maps`). There is nothing to configure in PM2.

PM2 7 no longer auto-detects `app.js.map` files nor ships the `source-map-support` package: `--source-map-support` / `source_map_support` are still accepted but do nothing.

### Inspect exceptions

Exceptions are logged into your application error log file.

To check your logs to detect exceptions, you can type:

```bash
pm2 logs main
```

Otherwise, use [PM2.io](https://pm2.io/) to have a clean listing and notifications of new alerts.

### Disable source map support

To start an app without source map support:

```bash
pm2 start app.js --disable-source-map-support
```

Or `disable_source_map_support: true` in the ecosystem file.
