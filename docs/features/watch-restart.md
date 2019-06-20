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

If `--watch` is enabled, stopping it won't stop watching:

- `pm2 stop 0` will not stop watching
- `pm2 stop 0 --watch` will stop watching

Restart toggle the `watch` parameter when triggered.

**Note** : **Watching system does not provide any graceful action, pm2 kills and restarts your application without sending SIGINT**

To watch specific paths, please use a [JS/JSON app declaration](http://pm2.keymetrics.io/docs/usage/application-declaration/), `watch` can take a string or an array of paths. Default is `true`:

```json
{
  "watch": ["server", "client"],
  "ignore_watch" : ["node_modules", "client/img"],
  "watch_options": {
    "followSymlinks": false
  }
}
```

As specified in the [Schema](http://pm2.keymetrics.io/docs/usage/application-declaration/#declaration-via-js-json-or-json5-file):

- `watch` can be a boolean, an array of paths or a string representing a path. Default to `false`
- `ignore_watch` can be an array of paths or a string, it will be interpreted by [chokidar](https://github.com/paulmillr/chokidar#path-filtering) as a glob or a regular expression.
- `watch_options` is an object that will replace options given to chokidar. Please refer to [chokidar documentation](https://github.com/paulmillr/chokidar#api) for the definition.

PM2 is giving chokidar these Default options:

```
var watch_options = {
  persistent    : true,
  ignoreInitial : true
}
```

When working with NFS devices you'll need to set `usePolling: true` as stated in [this chokidar issue](https://github.com/paulmillr/chokidar/issues/242).
