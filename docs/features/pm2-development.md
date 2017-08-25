---
layout: docs
title: pm2-dev for development
description: Developing application with PM2
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
