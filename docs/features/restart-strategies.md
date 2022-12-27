---
layout: docs
title: Restart Strategies
description: Handle application restart properly
permalink: /docs/usage/restart-strategies/
---

## Restart strategies

When starting application with PM2, application are automatically restarted on auto exit, event loop empty (node.js) or when application crash.
But you can also configure extra restart strategies like:

- Restart app at a specified CRON time
- Restart app when files have changed
- Restart when app reach a memory threshold
- Delay a start and automatic restart
- Disable auto restart (app are always restarted with PM2) when crashing or exiting by default)
- Restart application automatically at a specific exponential increasing time

## Restart at cron time

Via CLI:

```bash
$ pm2 start app.js --cron-restart="0 0 * * *"
# Or when restarting an app
$ pm2 restart app --cron-restart="0 0 * * *"
```

Via configuration file, use the `cron_restart` attribute:

```bash
module.exports = {
  apps : [{
    name: 'Business News Watcher',
    script: 'app.js',
    instances: 1,
    cron_restart: '0 0 * * *',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
```

To disable cron restart:

```bash
pm2 restart app --cron-restart 0
```

## Restart on file change

PM2 can automatically restart your application when a file is modified in the current directory or its subdirectories:

Via CLI:

```bash
$ pm2 start app.js --watch
```

*Note*: If an application is started with the `--watch` option, stopping the app will not prevent it to be restarted on file change.
To totally disable the watch feature, do: `pm2 stop app --watch` or toggle the watch option on application restart via `pm2 restart app --watch`.

Via configuration file, use the `watch: true` attribute:

```javascript
module.exports = {
  script: "app.js",
  watch: true
}
```

You can specify which folder to watch for change, ignore folder and watch files interval with these options:

```javascript
module.exports = {
  script: "app.js",
  // Specify which folder to watch
  watch: ["server", "client"],
  // Specify delay between watch interval
  watch_delay: 1000,
  // Specify which folder to ignore 
  ignore_watch : ["node_modules", "client/img"],
}
```

## Memory based restart strategy

PM2 allows to reload (auto fallback to restart if not in cluster) an application based on a memory limit/ Please note that the PM2 internal worker (which checks memory), starts every 30 seconds, so you may have to wait a bit before your process gets restarted automatically after reaching the memory threshold.

CLI:

```bash
$ pm2 start api.js --max-memory-restart 300M
```

Via configuration file, use the `max_memory_restart` attribute:

```bash
module.exports = {
  script: 'api.js',
  max_memory_restart: '300M'
}
```

Note: Units can be K(ilobyte) (e.g. `512K`), M(egabyte) (e.g. `128M`), G(igabyte) (e.g. `1G`).

## Restart Delay

Set a delay between auto restart with the Restart Delay strategy:

CLI:

```bash
$ pm2 start app.js --restart-delay=3000
```

Via configuration file, use the `restart_delay` attribute:

```javascript
module.exports = {
  script: 'app.js',
  restart_delay: 3000
}
```

## No Auto Restart

This is useful in case we wish to run 1-time scripts and don't want the process manager to restart our script in case it's completed running.

CLI:

```bash
$ pm2 start app.js --no-autorestart
```

Via configuration file, use the `autorestart` attribute:

```javascript
module.exports = {
  script: 'app.js',
  autorestart: false
}
```

## Skip Auto Restart For Specific Exit Codes

Sometimes you might want the application to automatically restart in case of failure (i.e. non-zero exit code),
while not wanting the process manager to restart it when it shuts down properly (i.e. exit code equal to 0).

In this case, you can still use PM2 just fine with a `stop_exit_codes` option set to exit codes that should skip auto restart:

CLI:

```bash
$ pm2 start app.js --stop-exit-codes 0
```

Or via configuration file, use the `stop_exit_codes` attribute:

```javascript
module.exports = [{
  script: 'app.js',
  stop_exit_codes: [0]
}]
```

## Exponential Backoff Restart Delay

A new restart mode has been implemented on PM2 Runtime, making your application restarts in a smarter way. Instead of restarting your application like crazy when exceptions happens (e.g. database is down), the *exponential backoff restart* will increase incrementally the time between restarts, reducing the pressure on your DB or your external provider... Pretty easy to use:

CLI:

```bash
$ pm2 start app.js --exp-backoff-restart-delay=100
```

Via configuration file, use the `exp_backoff_restart_delay` attribute:

```javascript
module.exports = {
  script: 'app.js',
  exp_backoff_restart_delay: 100
}
```

When an application crash unexpectedly and the option `--exp-backoff-restart-delay` is activated, you will be able to see a new application status **waiting restart**.

By running `pm2 logs` you will also see the restart delay being incremented:
```
PM2      | App [throw:0] will restart in 100ms
PM2      | App [throw:0] exited with code [1] via signal [SIGINT]
PM2      | App [throw:0] will restart in 150ms
PM2      | App [throw:0] exited with code [1] via signal [SIGINT]
PM2      | App [throw:0] will restart in 225ms
```

As you can see the restart delay between restarts will increase in an exponential moving average, till reaching the maximum of 15000ms between restarts.

When the application will then get back to a stable mode (uptime without restarts of more than 30 seconds), the restart delay will automatically reset to 0ms.
