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
You can monitor memory and CPU easily and straight from your terminal:

```bash
pm2 monit
```

## PM2.io

If you manage your Node.js application with PM2, we invite you to try [PM2.io](https://pm2.io). It makes monitoring and managing applications accross servers easier than ever.

Feel free to try it:
[Discover the monitoring dashboard for PM2](https://app.pm2.io/#/register)

## Memory threshold

PM2 allows to reload (auto fallback to restart) an application based on a memory limit. 
Please note that the PM2 internal worker (which checks memory and related), starts every 30 seconds, so you may have to wait a bit before your process gets restarted automatically after reaching the memory threshold.

### CLI

```bash
pm2 start big-array.js --max-memory-restart 20M
```

### Via Ecosystem File

```javascript
module.exports = {
   name: 'max-mem',
   script: 'big-array.js',
   max_memory_restart: '100M'
}
```

### Programmatic

```javascript
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
