---
layout: docs
title: pm2-dev for development
description: Use pm2-dev to run Node.js applications in development mode with automatic restart on file change and inline log streaming.
permalink: /docs/usage/pm2-development/
last_modified_at: 2026-07-03
---

PM2 comes with a handy development tool that allow you to start an application and restart it on file change:

```bash
# Start your application in development mode
# it print the logs and restart on file change too

# Two way of running your application :
pm2-dev start my-app.js

# or

pm2-dev my-app.js
```

pm2-dev watches the application folder (dotfiles and `node_modules` are ignored), streams the logs in the terminal and restarts the app on file change. Ctrl+C deletes the apps and stops the session.

pm2-dev runs its own daemon with its own home, `~/.pm2-dev`, so it does not interfere with the processes of your regular `pm2` (`~/.pm2`).

## Options

| Option | Description |
|:-------|:------------|
| `--ignore [files]` | Comma-separated files/folders to ignore while watching (`node_modules` is always added) |
| `--post-exec [cmd]` | Execute an extra command each time the app restarts after a change |
| `--silent-exec` | Do not output the result of the `--post-exec` command |
| `--timestamp` | Prefix logs with a timestamp (`YYYY-MM-DD-HH:mm:ss`) |
| `--raw` | Raw log output |
| `--env [name]` | Inject the `env_[name]` variables of the ecosystem file |
| `--auto-exit` | Exit when all processes are errored/stopped or no app was launched |
| `--interpreter <interpreter>` | Interpreter used to run the app (bash, python...) |
| `--node-args <node_args>` | Space-delimited arguments passed to node, e.g. `--node-args="--trace-deprecation"` |

```bash
pm2-dev start ecosystem.config.js --env development --ignore "tmp,logs" --post-exec "npm run lint"
```
