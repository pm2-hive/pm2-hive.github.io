---
layout: docs
title: Cluster Mode
description: Cluster Mode for Node.js
permalink: /docs/usage/cluster-mode/
---

## Cluster Mode

The **cluster mode** allows networked Node.js applications (http(s)/tcp/udp server) to be scaled accross all CPUs available, without any modifications. This increase overall reliability and performance, depending on the number of CPUs available.

Compared to a single instance setup, using the cluster mode can **increase performance up to 650% on a 8 cores CPU**.

## Usage

To enable the **cluster mode**, just pass the -i <instances> option:

```bash
$ pm2 start  app.js -i max
```

Or via a [yaml/json file](http://pm2.keymetrics.io/docs/usage/application-declaration/):

```yaml
apps:
  script    : api.js
  instances : max
  exec_mode : cluster
```

```bash
$ pm2 start processes.yml
```

The *-i* or *instances* option can be:
- **max** to spread the app across all CPUs
- **-1** to spread the app across all CPUs - 1
- **number** to spread the app across **number** CPUs

## Reload

As opposed to `restart`, which kills and restarts the process, `reload` achieves a 0-second-downtime reload.

To reload an app:

```bash
$ pm2 reload <app_name>
```

Or:

```bash
$ pm2 reload process.yml
$ pm2 reload process.yml --only api
```

If the reload system hasn't managed to reload your app, a timeout will fallback to a classic restart.

## Stateless-fy your app

Be sure your [**application is stateless**](http://pm2.keymetrics.io/docs/usage/specifics/#stateless-apps) meaning that there is not any local data stored in the process, like sessions/websocket connections etc. Use Redis, Mongo or other DB to share states between processes.

## Close all connections

Sometimes you can experience a **very long reload, or a reload that doesn't work** (fallback to restart) meaning that your app still has open connections on exit or you may need to close all databases connections, clear a data queue or whatever.

To work around this problem you have to **close all connections and blocking stuff** with the [Clean Restart](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/) feature.
