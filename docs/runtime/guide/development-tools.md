---
layout: none
title: Development Tools | Guide | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/guide/development-tools/"
last_modified_at: 2026-07-03
description: "PM2 comes with two development tools that will help you on the development stage: a watch and restart mode and a server for static files."
sitemap: false
redirect_to: "/docs/usage/pm2-development/"
---

# Development Tools

PM2 comes with two development tools that will help you on the development stage: a watch and restart mode and a server for static files.

## Watch and Restart

The watch and restart mode watches the current directory to detect file changes and auto-start.

This mode can be enable in your ecosystem.config.js:

```javascript
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    watch: true,
  }]
}
```

 Beware that the watch and restart mode makes hard restart, without sending SIGINT.
{: .tip}

### Watch options

You can use advanced options to specify path to watch or path to ignore.

```javascript
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    watch: ".",
  }]
}
```

- `watch` can also be a string or an array of paths to watch. Current directory is watched when set to `true`.
- `ignore_watch` can be an array of paths or a string. It is used by the [chokidar](https://github.com/paulmillr/chokidar#path-filtering) dependency as a glob or a regular expression.
- `watch_options` is an object that is given as options to [chokidar](https://github.com/paulmillr/chokidar#api) dependency (default options used by pm2 are persistent and ignoreInitial set to true)

When working with NFS devices you'll need to set `usePolling: true` as stated in [this chokidar issue](https://github.com/paulmillr/chokidar/issues/242).

### With CLI

Watch mode can also be enabled via CLI with

```bash
pm2 start app.js --watch
```

However, please note that when `--watch` is enabled, you must use `pm2 stop --watch <app_name>` to stop the process, as simple stop won't stop the watching.

## Serve static file over HTTP

pm2 can serve static files (like a frontend app) over HTTP with:

```bash
pm2 serve <path> <port>
```

As default values are `current folder` and `8080`, you can then just use:

```bash
pm2 serve
```

In the ecosystem file:

```javascript
module.exports = {
  apps: [{
    name: "static-file",
    script: "serve",
    env: {
      PM2_SERVE_PATH: ".",
      PM2_SERVE_PORT: 8080,
    },
  }]
}
```

and start with:

```bash
pm2 start ecosystem.config.js
```

 All other pm2 options are still available.
{: .tip}

## Next Steps

[Easy Deploy with SSH]({{ site.baseurl }}{% link docs/runtime/guide/easy-deploy-with-ssh.md %})
{: .btn-stylized}
