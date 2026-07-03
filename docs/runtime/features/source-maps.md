---
layout: docs-io
title: Memory Threshold Auto Reload | Features | PM2 Documentation
description: Set a memory limit and allow soft reloads without downtime
lang: en
section: runtime
permalink: "/docs/runtime/features/javascript-source-maps/"
---

## Source Map

If you use [BabelJS](https://babeljs.io/), [Typescript](http://www.typescriptlang.org/) or any other Javascript superset you may have noticed that when an exception occurs, the stacktrace is not meaningful at all. To get interesting informations you need to generate [source map files](http://www.html5rocks.com/docs/tutorials/developertools/sourcemaps/).

Once these source map files are generated, PM2 will automatically detects them and will help you inspect errors.

**PM2 automatically detects javascript source map files** if the file you start (let's say app.js) has his map equivalence (e.g app.js.map).

### Inspect exceptions

Exceptions are logged into your application error log file.

To check your logs to detect exceptions, you simply have to type:

```bash
pm2 logs main
```

Or use PM2+ to get emailed and get exceptions analysis when it happens

### Disable source map support

If you do not want PM2 to automatically support javascript source map you can use the option `--disable-source-map-support`.

It can be done both via CLI and via JSON file.
