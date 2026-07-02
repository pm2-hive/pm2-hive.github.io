---
layout: docs
title: pm2-dev for development
description: Use pm2-dev to run Node.js applications in development mode with automatic restart on file change and inline log streaming.
permalink: /docs/usage/pm2-development/
---

PM2 comes with a handy development tool that allow you to start an application and restart it on file change:

```bash
# Start your application in development mode
# it print the logs and restart on file change too

# Two way of running your application :
pm2-dev start my-app.js

# or

pm2-dev my-app.js
```
