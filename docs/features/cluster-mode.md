---
layout: docs
title: Cluster Mode
description: Cluster Mode for Node.js
permalink: /docs/usage/cluster-mode/
---

## Cluster Mode

The **cluster mode** allows networked Node.js applications (http(s)/tcp/udp server) to be scaled accross all CPUs available, without any code modifications. This greatly increases the performance and reliability of your applications, depending on the number of CPUs available.

## Usage

To enable the **cluster mode**, just pass the -i <instances> option:

```bash
$ pm2 start  app.js -i 0
```

Or via a [js/yaml/json file](http://pm2.keymetrics.io/docs/usage/application-declaration/):

```json
{
  "apps" : [{
    "script"    : "api.js",
    "instances" : 0,
    "exec_mode" : "cluster"
  }]
}
```

Then to start the Process File:

```bash
$ pm2 start processes.json
```

The *-i* or *instances* option can be:
- **max** to spread the app across all CPUs
- **-1** to spread the app across all CPUs - 1
- **number** to spread the app across **number** CPUs

## Reload

As opposed to `restart`, which kills and restarts the process, `reload` achieves a **0-second-downtime** reload.

To reload an app:

```bash
$ pm2 reload <app_name>
```

Or:

```bash
$ pm2 reload process.json
$ pm2 reload process.json --only api
```

If the reload system hasn't managed to reload your application, a timeout will fallback to a classic restart.

## Graceful Shutdown

In production environment, you may need to wait for remaining queries to be processed or close all connections before exiting the application. On the *PM2 reload context* it can be translated into a very long reload or a reload that doesn't work (fallback to restart) meaning that your application still has open connections on exit. You may alternatively need to close all databases connections, clear data queues or whatever.

To Gracefully Shutdown an application you can catch the **SIGINT** signal (the first signal sent on exit by PM2) and execute actions to wait/clear all these states:

```javascript
process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });
});
```

[Read more about Graceful Shutdown](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/) feature.

## Statelessify your application

Be sure your [**application is stateless**](http://pm2.keymetrics.io/docs/usage/specifics/#stateless-apps) meaning that no local data is stored in the process, for example sessions/websocket connections, session-memory and related. Use Redis, Mongo or other databases to share states between processes.

