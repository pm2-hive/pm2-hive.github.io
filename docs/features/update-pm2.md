---
layout: docs
title: Update PM2
description: Upgrade PM2 to the latest version
permalink: /docs/usage/update-pm2/
---

To get the most from PM2 and Keymetrics, make sure your PM2 version is up-to-date.

Checkout the new releases: [https://github.com/Unitech/pm2/releases](https://github.com/Unitech/pm2/releases)

## Updating PM2

Updating PM2 is very fast (less than some seconds) and seamless.

First make sure that you save all your processes:

```bash
$ pm2 save
```

Then install the latest PM2 version from NPM:

```bash
$ npm install pm2 -g
```

And finally update the in-memory PM2 process:

```bash
$ pm2 update
```

That's all, you know have a fresh PM2 system!


