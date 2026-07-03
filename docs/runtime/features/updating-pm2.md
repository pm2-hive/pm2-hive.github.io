---
layout: none
title: Updating PM2 | Features | PM2 Documentation
description: Updating is a matter of 3 commands
lang: en
section: runtime
permalink: "/docs/runtime/features/updating-pm2/"
last_modified_at: 2026-07-03
sitemap: false
redirect_to: "/docs/usage/update-pm2/"
---

## Updating PM2

Updating PM2 is straightforward. Upgrading between minor and patch versions will **never** break anything on your environment

You will have to first run the installation command:

```bash
$ npm install pm2@latest -g
```

Then to save your current process list, kill the previous PM2 daemon and restore process list with the new PM2 version is as easy as doing:

```bash
$ pm2 update
```
