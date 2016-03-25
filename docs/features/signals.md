---
layout: docs
title: Signals and clean restarts
description: How signals are handled in PM2
permalink: /docs/usage/signals-clean-restart/
---

## Signals

When a process is stopped/restarted by PM2, some process signals are sent in a given order to your process.

First a **SIGINT** a signal is sent to your processes, signal you can catch to know that your process is going to be stopped. If your application does not exit by itself before 1.6s (PM2_KILL_TIMEOUT (PM2 < 0.16.0) or --kill-timeout <number> (PM2 > 0.16.0)) it will receive a **SIGKILL** signal to force the process exit.

## Cleaning states and jobs

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

## Custom delay before SIGKILL

If your application receive the SIGKILL signal too soon, you can configure PM2 to increase the [KILL_TIMEOUT](https://github.com/Unitech/pm2/blob/master/constants.js#L80) variable.

To increase this value, add the PM2_KILL_TIMEOUT to /etc/environment and update PM2 via `pm2 update`

## Note about SIGKILL

The **SIGKILL** event cannot be intercepted in your application (newer Node.js version will throw an error if you are trying to install a signal handler on SIGKILL or SIGSTOP)
