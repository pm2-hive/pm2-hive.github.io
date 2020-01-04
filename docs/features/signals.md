---
layout: docs
title: Graceful Start/Shutdown
description: How signals are handled in PM2
permalink: /docs/usage/signals-clean-restart/
---

## Graceful Stop

To allow graceful restart/reload/stop processes, make sure you intercept the **SIGINT** signal and clear everything needed (like database connections, processing jobs...) before letting your application exit.

```javascript
process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });
});
```

Now `pm2 reload` will become a gracefulReload.

### Configure the kill timeout

Via CLI, this will lengthen the timeout to 3000ms:

```bash
pm2 start app.js --kill-timeout 3000
```

Via [Ecosystem File](http://pm2.keymetrics.io/docs/usage/application-declaration/):

```javascript
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    kill_timeout : 3000
  }]
}
```

## Graceful start

Sometimes you might need to wait for your application to have etablished connections with your DBs/caches/workers/whatever. PM2 needs to wait before considering your application as `online`. To do this, you need to provide `--wait-ready` to the CLI or provide `wait_ready: true` in a process file. This will make PM2 listen for that event. In your application you will need to add `process.send('ready');` when you want your application to be considered as ready.

```javascript
var http = require('http');

var app = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('hey');
})

var listener = app.listen(0, function() {
  console.log('Listening on port ' + listener.address().port);
  // Here we send the ready signal to PM2
  process.send('ready');
});
```

Then start the application:

```bash
pm2 start app.js --wait-ready
```

### Configure the ready timeout

By default, PM2 wait 3000ms for the `ready` signal.

Via CLI, this will lengthen the timeout to 3000ms:

```bash
pm2 start app.js --wait-ready --listen-timeout 3000
```

Via [JSON declaration](http://pm2.keymetrics.io/docs/usage/application-declaration/):

```json
{
  "apps" : [{
    "name"         : "api",
    "script"       : "app.js",
    "listen_timeout" : 3000
  }]
}
```

### Graceful start using http.Server.listen

There is still the default system that hooks into `http.Server.listen` method. When your http server accepts a connection, it will automatically state your application as ready. You can increase the PM2 waiting time the listen using the same variable as `--wait-ready` graceful start : `listen_timeout` entry in process file or `--listen-timeout=XXXX` via CLI.

## Explanation: Signals flow

When a process is stopped/restarted by PM2, some system signals are sent to your process in a given order.

First a **SIGINT** a signal is sent to your processes, signal you can catch to know that your process is going to be stopped. If your application does not exit by itself before 1.6s *([customizable](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/#customize-exit-delay))* it will receive a **SIGKILL** signal to force the process exit.

## Windows graceful stop

When signals are not available your process gets killed. In that case, you need to listen for `shutdown` events:

```javascript
process.on('message', function(msg) {
  if (msg == 'shutdown') {
    console.log('Closing all connections...');
    setTimeout(function() {
      console.log('Finished closing connections');
      process.exit(0);
    }, 1500);
  }
});
```
