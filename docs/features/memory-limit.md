---
layout: docs
title: Memory Limit Reload
description: Automatically reload Node.js applications when they exceed a memory threshold with the PM2 max-memory-restart option.
permalink: /docs/usage/memory-limit/
last_modified_at: 2026-07-02
---

## Max Memory Threshold Auto Reload

PM2 allows to reload (auto fallback to restart if not in cluster) an application based on a memory limit/ Please note that the PM2 internal worker (which checks memory), starts every 30 seconds, so you may have to wait a bit before your process gets restarted automatically after reaching the memory threshold.

CLI:

```bash
pm2 start api.js --max-memory-restart 300M
```

Config file (ecosystem.config.js):

```bash
module.exports = {
  apps: [{
    name: 'api',
    script: 'api.js',
    max_memory_restart: '300M'
  }]
}
```

*Note:* Units can be K(ilobyte), M(egabyte), G(igabyte).
