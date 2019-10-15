---
layout: docs
title: Restart Strategies
description: Handle application restart properly
permalink: /docs/usage/restart-strategies/
---

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

## Fixed Restart Delay

*Available in PM2 >= 0.9*

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

## Memory based reload strategy

Checkout [/docs/usage/memory-limit/](/docs/usage/memory-limit/)

## 0 second Downtime Reload

Checkout the cluster mode to get [this behavior](/docs/usage/cluster-mode/#reload)

## No Auto Restart

This is useful in case we wish to run 1-time scripts and don't want the process manager to restart our script in case it's completed running.

Simply running these scripts from bash would terminate the script in case the ssh-session is terminated and the script should not get restarted when it completes execution.

PM2 is perfect for such cases, providing robust monitoring and logging

CLI:

```bash
$ pm2 start app.js --no-autorestart
```
