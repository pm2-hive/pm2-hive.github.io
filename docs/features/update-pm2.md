---
layout: docs
title: Update PM2
description: Upgrade PM2 to the latest version
permalink: /docs/usage/update-pm2/
---

To get the most out of PM2 and [PM2.io](https://pm2.io), please make sure your PM2 version is up-to-date.

You can find the changelog here: [https://github.com/Unitech/pm2/releases](https://github.com/Unitech/pm2/releases).

## Updating PM2

Updating PM2 is extremely fast (less than few seconds) and seamless.

First make sure that you saved correctly all your processes:

```bash
pm2 save
```

Then install the latest PM2 version from NPM:

```bash
npm install pm2 -g
```

And finally update the in-memory PM2 process:

```bash
pm2 update
```

That's all, you now have a fresh and up-to-date PM2 system!

## Updating Startup Script

When you upgrade your Node.js version, the node binary path will change. To update the PM2 startup script run:

```bash
$ pm2 unstartup
$ pm2 startup
```


