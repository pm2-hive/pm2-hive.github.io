---
layout: docs
title: Serve
description: Expose static file over http
permalink: /docs/usage/expose/
---

# Serve static file over http

### CLI
Starting pm2 `2.4.0`, you can use pm2 to serve your static files (like a frontend app) over http with a simple command :

```bash
pm2 serve <path> <port>
```

The current folder will be used if you don't precise `<path>`, for the port the default one is `8080`.
You can use the same options as a normal application like `--name` or `--watch`.

### Process file

You can declare in a process file that you want a special dir to be served, to do so :

```json
{
  "script": "serve",
  "env": {
    "PM2_SERVE_PATH": '.',
    "PM2_SERVE_PORT": 8080
  }
}
```

You just need to add `PM2_SERVE_PATH` and `PM2_SERVE_PORT` to env variables to specify the path and the port, the default are the same as the CLI.
