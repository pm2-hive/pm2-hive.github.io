---
layout: docs-io
title: Multiple PM2 Runtime | Features | PM2 Documentation
description: PM2 Inception
lang: en
section: runtime
permalink: "/docs/runtime/features/multiple-pm2/"
---

## Running Multiple PM2

If you want to run multiple PM2 under the same user, you can override the variable `PM2_HOME`. Setting the PM2_HOME will change the PM2 configuration folder, like communication sockets (`$HOME/.pm2/pub.sock` and `$HOME/.pm2/rpc.sock`), default logs location path, pids and so on.

```javascript
PM2_HOME=/tmp/.pm2 pm2 start echo.js
PM2_HOME=/tmp/.pm3 pm2 start echo.js
```
