---
layout: none
title: Load-Balancing | Guide | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/guide/load-balancing/"
last_modified_at: 2026-07-03
description: "The built-in load-balancer provides networked Node.js applications (http(s)/tcp/udp server) to be scaled across all CPUs available, without any code…"
sitemap: false
redirect_to: "/docs/usage/cluster-mode/"
---

# Load-Balancing (cluster mode)

![scale across all cpu's available]({{ site.baseurl }}{% link img/runtime/cluster-mode.png %})

The built-in load-balancer provides networked Node.js applications (http(s)/tcp/udp server) to be scaled across all CPUs available, without any code modifications.

## Usage

To enable the cluster mode, just pass the `-i <number-instances>` option:

```bash
pm2 start app.js -i max
```

`max` means that PM2 will auto detect the number of available CPUs and run as many processes as possible

Or via your ecosystem file (ecosystem.config.js):

```javascript
module.exports = {
  apps: [{
    script: "app.js",
    instances: "max",
  }]
}
```

The *instances* option can be:
- an Integer. This spreads the app across a specific number of clusters.
- the String 'max'. This spreads the app across all CPU cores.

 You can also use a negative integer. If 4 cores, `pm2 start -i -1` will spread 3 clusters (max - integer).
{: .tip}

## Stateless Application

In the context of clustering, you first need to be sure that your application has no internal state.

An internal state is typically some local data stored into its processes. It can be an array of websocket connections or a local session-memory for example. Use Redis or other databases instead to share the states between processes.

Follow our [tutorial]({{ site.baseurl }}{% link docs/runtime/best-practices/stateless-application.md %}) to make your app stateless.

## 0-seconds downtime reload

When you use `restart`, pm2 kills and restarts all the processes at the same time. There is a short period of time during which the service is unavailable.

With reload, pm2 restarts all processes one by one, always keeping at least one process running:
```bash
pm2 reload <app_name>
```

Or:

```bash
pm2 reload ecosystem.config.js
pm2 reload ecosystem.config.js --only app
```

If the reload system hasn't managed to reload your application, a timeout will fallback to a classic restart.

## Graceful Start & Shutdown

To be sure that all requests are properly handled in a reload, you need to be sure that your application shutdown, not leaving unanswered requests.

A graceful shutdown makes sure to handle all remaining queries before exiting the application and closes all external connections.

Get help to setup graceful shutdown with our [tutorial]({{ site.baseurl }}{% link docs/runtime/best-practices/graceful-shutdown.md %}).

## Cluster environment variable

The `NODE_APP_INSTANCE` environment variable is used to make a difference between cluster.

For example, if you want to run a cronjob only on one cluster, you can check if `process.env.NODE_APP_INSTANCE === '0'`.

This variable can be renamed in the ecosystem file:

```javascript
module.exports = {
  apps: [{
    name: "app",
    script: "./app.js",
    instance_var: "INSTANCE_ID",
  }]
}
```

 This is useful with the `node-config` package where name conflicts have been reported, check the [issue](https://github.com/Unitech/pm2/issues/2045).
{: .tip}

## Next Steps

[Development Tools]({{ site.baseurl }}{% link docs/runtime/guide/development-tools.md %})
{: .btn-stylized}
