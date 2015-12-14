---
layout: docs
title: Cluster Mode
description: Cluster Mode for Node.js
permalink: /docs/usage/cluster-mode/
---

## Auto load balancing: Cluster mode

The **cluster mode** allows to scale your Node.js application accross all CPUs available and to update them without any downtime! Your application does not need any modification to be able to use this nifty feature.

It's perfectly fitted for networked applications handling HTTP(s)/UDP/TCP connections.

To enable the **cluster mode**, just pass the -i <instances> option:

```bash
$ pm2 start app.js -i 1
```

You can pass multiple values to the instances (-i) option:

```bash
# Start the maximum processes depending on available CPUs
$ pm2 start app.js -i 0

# Start the maximum processes -1 depending on available CPUs
$ pm2 start app.js -i -1

# Start 3 processes
$ pm2 start app.js -i 3
```

## Considerations

- You don't need to modify anything from your code to be able to use this nifty feature.
- If in Fork Mode, In your application, the environment variable `NODE_APP_INSTANCE` is exposed so you can listen for different port if needed. (e.g .listen(8000 + process.env.NODE_APP_INSTANCE))
- Be sure your [**application is stateless**](http://pm2.keymetrics.io/docs/usage/knowledge/#stateless-apps) meaning that there is not any local data stored in the process, like sessions/websocket connections etc. Use Redis, Mongo or other DB to share states between processes.

## Reload without Downtime

As opposed to `restart`, which kills and restarts the process, `reload` achieves a 0-second-downtime reload.

**Warning** This feature only works for apps in **cluster mode**, that uses HTTP/HTTPS/Socket connections.

To reload an app:

```bash
$ pm2 reload api
```

If the reload system hasn't managed to reload your app, a timeout will fallback to a classic restart.

## Graceful reload

Sometimes you can experience a **very long reload, or a reload that doesn't work** (fallback to restart) meaning that your app still has open connections on exit.
Or you may need to close all databases connections, clear a data queue or whatever.

To work around this problem you have to **use the graceful reload**.

Graceful reload is a mechanism that will send a **shutdown** message to your process before reloading it.
You can control the time that the app has to shutdown via the `PM2_GRACEFUL_TIMEOUT` environment variable.

Example:

```javascript
process.on('message', function(msg) {
  if (msg == 'shutdown') {
    // Your process is going to be reloaded
    // You have to close all database/socket.io/* connections

    console.log('Closing all connections...');

    // You will have 4000ms to close all connections before
    // the reload mechanism will try to do its job

    setTimeout(function() {
      console.log('Finished closing connections');
      // This timeout means that all connections have been closed
      // Now we can exit to let the reload mechanism do its job
      process.exit(0);
    }, 1500);
  }
});
```

Then use the command:

```bash
$ pm2 gracefulReload [all|name]
```

When PM2 starts a new process to replace an old one, it will wait for the new process to begin listening to a connection or a timeout before sending the shutdown message to the old one. You can define the timeout value with the `PM2_GRACEFUL_LISTEN_TIMEOUT` environament variable. If a script does not need to listen to a connection, it can manually tell PM2 that the process has started up by calling `process.send('online')`.

## Node 0.10.x & Cluster mode

Node 0.10 is not compatible with PM2 Cluster Mode, please upgrade.
