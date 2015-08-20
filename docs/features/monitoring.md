---
layout: docs
title: Monitoring
description: Monitoring applications
permalink: /docs/usage/monitoring/
---

## Monitoring CPU/Memory

<center>
<img src="/images/pm2-monit.png" title="PM2 Monit"/>
</center>

PM2 gives you a simple way to monitor the resource usage of your application.
You can monitor memory and cpu very easily, straight from your terminal:

```bash
$ pm2 monit
```

## Keymetrics monitoring

[![Keymetrics Dashboard](https://keymetrics.io/assets/images/application-demo.png)](https://app.keymetrics.io/#/register)

If you manage your NodeJS app with PM2, Keymetrics makes it easy to monitor and manage apps accross servers.
Feel free to try it:

[Discover the monitoring dashboard for PM2](https://app.keymetrics.io/#/register)

Thanks in advance and we hope that you like PM2!

## Max Memory Restart

PM2 allows to restart an application based on a memory limit.

### CLI

```bash
$ pm2 start big-array.js --max-memory-restart 20M
```

### JSON

```json
{
  "name"   : "max_mem",
  "script" : "big-array.js",
  "max_memory_restart" : "20M"
}
```

### Programmatic

```
pm2.start({
  name               : "max_mem",
  script             : "big-array.js",
  max_memory_restart : "20M"
}, function(err, proc) {
  // Processing
});
```

### Units

Units can be K(ilobyte), M(egabyte), G(igabyte).

```
50M
50K
1G
```
