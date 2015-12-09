---
layout: docs
title: Signals and clean restarts
description: How signals are handled in PM2
permalink: /docs/usage/signals-clean-restart/
---

## Signals

When a process is restarted/stoped by PM2, some signals are sent in a given order to your process.

First **SIGINT** signals are sent to your process [every 100ms](https://github.com/Unitech/pm2/blob/master/lib/God/Methods.js#L221). If your application does not get stopped (or stop itself) after [KILL_TIMEOUT ms (default to 1,6second)](https://github.com/Unitech/pm2/blob/master/constants.js#L80), it will send a final **SIGTERM** signal.

## Cleaning states and jobs before stop

If you need to clean some stuff (stop intervals, stop connection to database...) you can intercept the SIGINT signal to prepare your application to exit.

Here is a sample on how to intercept the SIGINT signal with Node.js:

```javascript
//[...]

process.on('SIGINT', function() {
  // My process has received a SIGINT signal
  // Meaning PM2 is now trying to stop the process

  // So I can clean some stuff before the final stop
  clearInterval(my_interval);
  my_db_connection.close();
  current_jobs.save();

  setTimeout(function() {
    // 300ms later the process kill it self to allow a restart
    process.exit(0);
  }, 300);
});
```

## Custom delay before SIGTERM

If your application receive the SIGTERM signal too soon, you can configure PM2 to increase the [KILL_TIMEOUT](https://github.com/Unitech/pm2/blob/master/constants.js#L80) variable.

To increase this value, add the PM2_KILL_TIMEOUT to /etc/environment and update PM2 via `pm2 update`

## Forbid PM2 to kill a process

Catch the **SIGINT** and **SIGTERM** signal:

```javascript
//[...]

process.on('SIGINT', function() {
  clearInterval(my_interval);
  my_db_connection.close();
  current_jobs.save();
});

process.on('SIGTERM', function() {
  // Wait 10 seconds before exiting process
  setTimeout(function() {
    process.exit(0);
  }, 10000);
});
```
