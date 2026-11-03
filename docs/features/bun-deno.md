---
layout: docs
title: "Bun, Deno & other Runtimes"
description: "Run Bun and TypeScript applications with PM2: Bun or Node.js type stripping for .ts files, cluster mode under Bun, and Deno or any other runtime via --interpreter."
permalink: /docs/usage/bun-deno/
last_modified_at: 2026-11-03
---

## Using Bun, Deno and other Runtimes with PM2

PM2 is not limited to Node.js: it has first-class support for [Bun](https://bun.sh/) and can manage applications running on Deno, Python, Ruby or any other interpreter.

### Bun

PM2 supports Bun natively. When Bun is installed, TypeScript files are started with Bun automatically:

```bash
# .ts and .tsx files default to the bun interpreter
pm2 start app.ts
```

On a Bun-only machine (no Node.js), symlink `node` to `bun` so the `pm2` command (`#!/usr/bin/env node`) resolves:

```bash
sudo ln -s $(which bun) /usr/local/bin/node
```

To run any application with Bun explicitly, set the interpreter:

```bash
pm2 start index.js --interpreter bun
```

Or in a [configuration file](/docs/usage/application-declaration/):

```javascript
module.exports = {
  apps: [{
    name: "api",
    script: "./app.ts",
    interpreter: "bun",
    node_args: "--smol"   // flags passed to the bun binary
  }]
}
```

All the usual PM2 features work with Bun applications: log management, restart strategies, max memory restart, graceful shutdown and monitoring.

### TypeScript without Bun

Since PM2 7.0.4, when bun is not installed, `.ts` apps run with Node.js native type stripping:

- Node.js >= 22.18 / >= 23.6: works out of the box
- Node.js 22.6 to 22.17 and 23.0 to 23.5: PM2 adds `--experimental-strip-types` to `node_args` automatically
- Older Node.js: `pm2 start` fails; install bun or set a custom interpreter (e.g. `--interpreter ts-node`)

Type stripping only removes type annotations (no `enum`, `namespace`...). `.tsx` files still require bun.

### Cluster Mode with Bun

[Cluster mode](/docs/usage/cluster-mode/) follows the runtime of the PM2 daemon itself. To load-balance a Bun application over multiple cores, run PM2 with Bun (Bun >= 1.1.25 is required, as earlier versions lack cluster support):

```bash
# stop any daemon started with Node first
pm2 kill

# launch PM2 under the Bun runtime
bunx --bun pm2 start app.ts -i max
```

The daemon keeps the runtime it was first started with: use `pm2 kill` before switching between Node and Bun.

### Deno

Deno applications run through PM2's generic interpreter support, in fork mode:

```bash
pm2 start app.ts --interpreter="deno" --interpreter-args="run --allow-net"
```

Or in a configuration file:

```javascript
module.exports = {
  apps: [{
    name: "deno-api",
    script: "./app.ts",
    interpreter: "deno",
    interpreter_args: "run --allow-net --allow-read"
  }]
}
```

Note that cluster mode is not available for Deno applications; scale them by starting several processes on different ports behind a [reverse proxy](/docs/tutorials/pm2-nginx-production-setup/).

### Other Interpreters

PM2 picks the interpreter from the file extension:

| Extension | Interpreter |
|:----------|:------------|
| `.js` | node (or bun when PM2 runs under Bun) |
| `.ts` | bun (Node.js type stripping when bun is not installed) |
| `.tsx` | bun |
| `.py` | python |
| `.rb` | ruby |
| `.sh` | bash |
| `.php` | php |
| `.pl` | perl |
| `.coffee` | coffee |
| `.ls` | lsc |

Any other runtime works by setting `--interpreter` (CLI) or `interpreter` / `interpreter_args` (configuration file) explicitly:

```bash
pm2 start app.py --interpreter python3
pm2 start ./binary-file   # binaries run directly, no interpreter
```

Cluster mode is only available for Node.js and Bun applications; every other runtime uses fork mode. See also [using transpilers with PM2](/docs/tutorials/using-transpilers-with-pm2/).
