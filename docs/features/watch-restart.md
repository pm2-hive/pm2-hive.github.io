---
layout: docs
title: Watch & Restart
description: Restart process on file change
permalink: /docs/usage/watch-and-restart/
---

## Auto restart apps on file change

PM2 can automatically restart your application when a file is modified in the current directory or its subdirectories:

```bash
pm2 start app.js --watch
```

Or via configuration file set the option `watch: true`.

If an application is started with the `--watch` option, stopping the app will not prevent it to be restarted on file change.
To totally disable the watch feature, do: `pm2 stop app --watch` or toggle the watch option on application restart via `pm2 restart app --watch`.

To watch specific paths, please use a [Ecosystem File](/docs/usage/application-declaration/), `watch` can take a string or an array of paths. Default is `true`:

```javascript
module.exports = {
  apps: [{
    script: "app.js",
    watch: ["server", "client"],
    // Delay between restart
    watch_delay: 1000,
    ignore_watch : ["node_modules", "client/img", "\\.git", "*.log"],
  }]
}
```
