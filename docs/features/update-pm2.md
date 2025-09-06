---
layout: docs
title: Update PM2
description: Upgrade PM2 to the latest version
permalink: /docs/usage/update-pm2/
---

## Updating PM2

Updating PM2 is extremely fast (less than few seconds) and seamless.

You may wish to backup the `$HOME/.pm2/dump.pm2` file before performing an update, which will in turn back up your current processes.

### Process to update PM2

Install the latest PM2 version:

```bash
npm install pm2 -g
```

You can now update the in-memory PM2 daemon via command:

```bash
pm2 update
```

### Node.js version upgrade

When you upgrade your Node.js installation, make sure to also update Node.js version starting PM2.

To update the PM2 startup script run:

```bash
$ pm2 unstartup
$ pm2 startup
```


