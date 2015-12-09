---
layout: docs
title: Signals and clean restarts
description: How signals are handled in PM2
permalink: /docs/usage/signals-clean-restart/
---

## Signals

When a process is restarted/stoped by PM2, some signals in a given order are sent to your process.

First a **SIGINT** signal is sent to your process. If your application does not get stopped (or stop itself) after 10 tries, it will send a final **SIGTERM** signal.

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
