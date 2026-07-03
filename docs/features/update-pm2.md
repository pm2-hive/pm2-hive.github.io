---
layout: docs
title: Update PM2
description: Update PM2 to the latest version with npm and migrate the in-memory daemon seamlessly with the pm2 update command.
permalink: /docs/usage/update-pm2/
last_modified_at: 2026-07-02
---

## Updating PM2

Updating PM2 is extremely fast (less than few seconds) and seamless.

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


