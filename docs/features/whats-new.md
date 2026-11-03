---
layout: docs
title: What's New in PM2
description: "PM2 release highlights: version 7 with Node.js 18+ requirement, native Bun runtime support, TypeScript via Node.js type stripping, built-in host metrics, stricter env filtering, security fixes and reduced dependencies."
permalink: /docs/usage/whats-new/
last_modified_at: 2026-07-03
---

## What's New in PM2

Release highlights of the latest PM2 major versions. The complete list lives in the [CHANGELOG](https://github.com/Unitech/pm2/blob/master/CHANGELOG.md) and on the [GitHub releases page](https://github.com/Unitech/pm2/releases).

### PM2 7

The current major version. Check your version with `pm2 -v` and upgrade with `npm install pm2@latest -g && pm2 update`.

#### PM2 7.1

##### Breaking Changes

- **`filter_env: true`** works again (7.1.2, was ignored since 4.4.1): apps only inherit `PATH`, `HOME`, `USER`, locales and a few OS variables besides their `env` — `NODE_ENV`, `NODE_OPTIONS`, `HTTP_PROXY`... must be declared in `env`. It also applies to `--update-env` restart/reload and to cluster workers. Apps started before 7.1.2 or without `filter_env` (`dump.pm2` included) keep the env they already received: `pm2 delete` them and start them again — see [Environment Variables](/docs/usage/environment/)
- Shell variables named like a PM2 option (`name`, `namespace`, `instances`, `port`, `time`, `watch`...) no longer override the app configuration nor reach fork mode apps (7.1.0): declare them in `env:` — see [Application Declaration](/docs/usage/application-declaration/)
- PM2.io agent: `PM2_PROXY` support removed (broken since 7.0.0)

##### Features & Fixes

- `pm2 monit` / `pm2 dash` preload the last 200 log lines of every process (`--lines <n>` for more); Ctrl+Up / Ctrl+Down (and PageUp / PageDown) scroll the focused log pane
- `exec_mode: cluster` on a non Node.js/Bun script (bash, python, binary) falls back to fork mode with a warning
- Cluster mode: output bypassing `process.stdout.write` (pino, `npm start`, inherited stdio) now goes to the app log files instead of `pm2.log`
- `pm2 start --container` uses the `keymetrics/pm2:<node>-trixie` image — see [Docker Integration](/docs/usage/docker-pm2-nodejs/)

#### PM2 7.0.x

- Bun-only machines (no Node.js) need `node` symlinked to `bun`: `sudo ln -s $(which bun) /usr/local/bin/node` (7.0.1)
- **TypeScript without Bun** (7.0.4): `.ts` apps run with Node.js native type stripping when bun is not installed (Node.js >= 22.18 / 23.6, `--experimental-strip-types` added automatically on 22.6+) — see [Bun, Deno & other Runtimes](/docs/usage/bun-deno/)
- **Built-in host metrics** (7.0.2): the `pm2-sysmonit` module is replaced by a built-in collector (Linux/macOS); `pm2 ls` shows a host-metrics line (CPU, RAM, disks, active network interfaces, GPU). Disable with `pm2 set pm2:sysmonit false && pm2 update`
- `pm2 ls` adaptive layout: picks the widest of full, condensed or `mini` (`id · name · status · cpu · mem`) that fits the terminal

#### PM2 7.0.0

##### Breaking Changes

- Requires **Node.js >= 18** (Node.js 16 support dropped)

##### Runtime & Core

- **Native Bun support**: dedicated process containers for Bun in fork and cluster mode — see [Bun, Deno & other Runtimes](/docs/usage/bun-deno/)
- Major supply-chain surface reduction: `pm2-axon`, `pm2-axon-rpc`, `pm2-io-bpm`, `pm2-io-agent`, `fclone` and other dependencies internalized as local modules; `needle`, `enquirer`, `promptly`, `mkdirp`, `source-map-support`, `sprintf-js` and `fclone` removed from npm dependencies in favor of native Node.js APIs
- Rewritten **TreeKill**: a single process-snapshot with in-memory tree build eliminates race conditions when stopping process trees; SIGKILL escalation now targets surviving children directly
- OpenTelemetry tracing available via `pm2 install-otel` and `--trace`

##### Security

- Fixed CVE-2025-5891 (ReDoS in configuration parsing) and CVE-2026-27699 (updated proxy-agent and basic-ftp)
- Fixed command injection vectors in `open()` helpers (`exec()` replaced by `execFile()`, `SUDO_USER` validated)
- Fixed prototype pollution in `pm2 set`/`pm2 unset` via `__proto__` key traversal

##### Features & Fixes

- `pm2 serve --ftp` for directory listing (python `http.server` style)
- Fixed environment variables leaking as `[object Object]` to fork-mode subprocesses
- Windows fixes: home path resolution via `os.homedir()`, TreeKill callback consistency
- Source maps handled natively by Node.js (`.map` auto-detection dropped) — see [Source Maps](/docs/usage/source-map-support/)

### PM2 6.x Highlights

- **Bun support** landed in 6.0.5 (`pm2 start app.ts` runs with Bun)
- Git metadata parsing disabled by default (faster starts on large repositories)
- Smaller dependency footprint (`chalk` replaced, `npm-shrinkwrap` dropped in favor of fixed dependency versions)
- Module updates from tarballs and namespaced NPM modules (`@org/module-name`)

### Staying Up To Date

```bash
npm install pm2@latest -g
pm2 update          # replace the in-memory daemon, keeps your processes
```

See [Update PM2](/docs/usage/update-pm2/) for details.
