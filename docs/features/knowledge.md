---
layout: docs
title: Specifics
description: Specifics
permalink: /docs/usage/knowledge/
---

## Stateless apps

We recommend (and you must) write stateless NodeJS apps. Apps that don't retain any form of local variables or local instances or whatever local.
Every data, states, websocket session, session data, must be shared via any kind of database.

We recommend using Redis for sharing session data, websocket.

- [Configuring SocketIO](https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO)
- [Redis session store for Connect](https://github.com/visionmedia/connect-redis)

We recommend following the 12 factor convention : [http://12factor.net/](http://12factor.net/)

## Setup pm2 on a server

[How To Use pm2 to Setup a Node.js Production Environment On An Ubuntu VPS](https://www.digitalocean.com/community/articles/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps)

## Log and PID files

By default, logs (error and output), pid files, dumps, and PM2 logs are located in `~/.pm2/`:

```
.pm2/
├── dump.pm2
├── custom_options.sh
├── pm2.log
├── pm2.pid
├── logs
└── pids
```
