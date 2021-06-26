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
pm2 start app.js --cron-restart="0 0 * * *"
# Or when restarting an app
pm2 restart app --cron-restart="0 0 * * *"
```

Via ecosystem.config.js with `cron_restart` attribute:

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

## Restart on file change

PM2 can automatically restart your application when a file is modified in the current directory or its subdirectories:

Via CLI:

```bash
pm2 start app.js --watch
```

Via ecosystem.config.js with `watch: true` attribute.

### Behavior of PM2 CLI with --watch

If an application is started with the `--watch` option, stopping the app will not prevent it to be restarted on file change.
To totally disable the watch feature, do: `pm2 stop app --watch` or toggle the watch option on application restart via `pm2 restart app --watch`.

To watch specific paths, please use a [Ecosystem File](/docs/usage/application-declaration/), `watch` can take a string or an array of paths. Default is `true`:

```javascript
module.exports = {
  apps: [{
    script: "app.js",
    watch: ["server", "client"],
    // Delay between restart
    watch_delay: 1000,
    ignore_watch : ["node_modules", "client/img"],
  }]
}
```

## Memory based restart strategy

PM2 allows to reload (auto fallback to restart if not in cluster) an application based on a memory limit/ Please note that the PM2 internal worker (which checks memory), starts every 30 seconds, so you may have to wait a bit before your process gets restarted automatically after reaching the memory threshold.

CLI:

```bash
pm2 start api.js --max-memory-restart 300M
```

Config file (ecosystem.config.js):

```bash
module.exports = {
  apps: [{
    name: 'api',
    script: 'api.js',
    max_memory_restart: '300M'
  }]
}
```

*Note:* Units can be K(ilobyte), M(egabyte), G(igabyte).

## Restart Delay

You can also use the `restart_delay` to set a fixed timing between restarts:

CLI:
```bash
$ pm2 start app.js --restart-delay=3000
```

Or via ecosystem.config.js file:

```javascript
module.exports = [{
  script: 'app.js',
  restart_delay: 3000
}]
```

## No Auto Restart

This is useful in case we wish to run 1-time scripts and don't want the process manager to restart our script in case it's completed running.

Simply running these scripts from bash would terminate the script in case the ssh-session is terminated and the script should not get restarted when it completes execution.

PM2 is perfect for such cases, providing robust monitoring and logging

CLI:

```bash
$ pm2 start app.js --no-autorestart
```

## Exponential Backoff Restart Delay

A new restart mode has been implemented on PM2 Runtime, making your application restarts in a smarter way. Instead of restarting your application like crazy when exceptions happens (e.g. database is down), the *exponential backoff restart* will increase incrementaly the time between restarts, reducing the pressure on your DB or your external provider... Pretty easy to use:

CLI:
```bash
$ pm2 start app.js --exp-backoff-restart-delay=100
```

Or via ecosystem.config.js file:
```javascript
module.exports = [{
  script: 'app.js',
  exp_backoff_restart_delay: 100
}]
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

## 0 second Downtime Reload

Checkout the cluster mode to get [this behavior](/docs/usage/cluster-mode/#reload)
