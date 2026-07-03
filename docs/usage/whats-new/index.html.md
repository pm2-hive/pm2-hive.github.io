# What's New
Source: https://pm2.keymetrics.io/docs/usage/whats-new/

## What's New in PM2

Release highlights of the latest PM2 major versions. The complete list lives in the [CHANGELOG](https://github.com/Unitech/pm2/blob/master/CHANGELOG.md) and on the [GitHub releases page](https://github.com/Unitech/pm2/releases).

### PM2 7

The current major version. Check your version with `pm2 -v` and upgrade with `npm install pm2@latest -g && pm2 update`.

#### Breaking Changes

- Requires **Node.js >= 20** (Node.js 16 and 18 support dropped)

#### Runtime & Core

- **Native Bun support**: dedicated process containers for Bun in fork and cluster mode — see [Bun, Deno & other Runtimes](/docs/usage/bun-deno/)
- Major supply-chain surface reduction: `pm2-axon`, `pm2-axon-rpc`, `pm2-io-agent` and other dependencies internalized as local modules; `needle`, `enquirer`, `promptly`, `mkdirp`, `source-map-support`, `sprintf-js` and `fclone` removed from npm dependencies in favor of native Node.js APIs
- Rewritten **TreeKill**: a single process-snapshot with in-memory tree build eliminates race conditions when stopping process trees; SIGKILL escalation now targets surviving children directly
- OpenTelemetry tracing available via `pm2 install-otel` and `--trace`

#### Security

- Fixed CVE-2025-5891 (ReDoS in configuration parsing) and CVE-2026-27699 (updated proxy-agent and basic-ftp)
- Fixed command injection vectors in `open()` helpers (`exec()` replaced by `execFile()`, `SUDO_USER` validated)
- Fixed prototype pollution in `pm2 set`/`pm2 unset` via `__proto__` key traversal

#### Features & Fixes

- `pm2 serve --ftp` for directory listing (python `http.server` style)
- Fixed environment variables leaking as `[object Object]` to fork-mode subprocesses
- Windows fixes: home path resolution via `os.homedir()`, TreeKill callback consistency

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
