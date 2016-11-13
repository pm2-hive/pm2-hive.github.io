---
layout: docs
title: Graceful restart/reload/stop
description: How signals are handled in PM2
permalink: /docs/usage/signals-clean-restart/
---

**NOTE for Windows users : Graceful action aren't working on Windows since signals doesn't exist on this plateform, when we send a SIGINT to notify the process like below, the process is directly kill.**

## Graceful Stop

To allow gracefull restart/reload/stop processes, make sure you intercept the **SIGINT** signal and clear everything needed (like database connections, processing jobs...) before letting your application exit. 

```javascript
process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });
});
```

Now `pm2 reload` will become a gracefulReload.

## Explanation: Signals flow

When a process is stopped/restarted by PM2, some system signals are sent to your process in a given order.

First a **SIGINT** a signal is sent to your processes, signal you can catch to know that your process is going to be stopped. If your application does not exit by itself before 1.6s *([customizable](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/#customize-exit-delay))* it will receive a **SIGKILL** signal to force the process exit.

## Cleaning states and jobs

As stated before, if you need to clean some stuff (stop intervals, stop connection to database...) you can intercept the SIGINT signal to prepare your application to exit.

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

## Customize exit delay

Via CLI, this will lengthen the timeout to 3000ms:

```bash
$ pm2 start app.js --kill-timeout 3000
```

Via [JSON declaration](http://pm2.keymetrics.io/docs/usage/application-declaration/):

```json
{
  "apps" : [{
    "name"         : "api",
    "script"       : "app.js",
    "kill_timeout" : 3000
  }]
}
```

## Graceful start

You can from now (pm2 version `2.1.x`) make a graceful start. Sometimes you want to wait for your application to have etablished connections with your DBs/caches/workers/whatever, so PM2 need to wait before considering your application as `online`. 
To do this, you need to provide `--wait-ready` to the CLI or provide `wait_ready: true` in a process file so PM2 listen for that event, and in your application you will need to add `process.send('ready');` when you want your application to be considered as ready.

Note that PM2 have a timeout in case the event is never call, so in case your startup is longer than the default timeout (`3000` ms), you will want to increase it using `PM2_GRACEFUL_LISTEN_TIMEOUT` env variable or `listen_timeout` entry in process file. 

```javascript
var http = require('http');
var app = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('hey');
})
var listener = app.listen(0, function() {
  console.log('Listening on port ' + listener.address().port);
  process.send('ready');
});
```
