---
layout: docs-io
title: Commands Cheatsheet | PM2 Documentation
description: PM2 Inception
lang: en
section: runtime
permalink: "/docs/runtime/features/commands-cheatsheet/"
sitemap: false
redirect_to: "/docs/usage/quick-start/"
---

## CheatSheet

Here is a quick, pragmatic overview of a range of PM2 commands:

### Install

```bash
$ npm install pm2 -g
```

### Start an app

```bash
$ pm2 start app.js
```

### Start and auto-restart on file change

```bash
$ pm2 start app.js --watch [--ignore-watch /*/]
```

### List apps

```bash
pm2 list
```

### Show extended infos

```bash
$ pm2 show <app_name>
```

### Restart

```bash
$ pm2 restart app
```

### Restart and update env

```bash
$ NODE_ENV=production pm2 restart app --update-env
```

### Stop

```bash
$ pm2 stop app
```

### Delete

```bash
$ pm2 delete app
```

### Show logs

```bash
$ pm2 logs
```

### Show env

```bash
$ pm2 env <pm_id>
```

### Start PM2 at boot

```bash
$ pm2 startup
```

### Set a name

```bash
$ pm2 start app.js --name="name"
# or update name
$ pm2 restart app --name="new-name"
```

### Reset Restart Counters

```bash
$ pm2 reset all
```

### Monitoring

```bash
$ pm2 monitor
```

### Dump all process data

```bash
$ pm2 prettylist
# or
$ pm2 show <pm_id|app_name>
```
