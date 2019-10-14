---
layout: docs
title: Expose static file over http
description: Expose static file over http
permalink: /docs/usage/expose/
---

## Serve static file over http

PM2 can serve static file very easily with the `pm2 serve` feature.
It support serving raw files from a specified folder or you can serve a SPA (Single Page Application) with it.

## CLI

Serve your static files (like a frontend app) over http with a simple command :

```bash
pm2 serve <path> <port>
```

The current folder will be used if you don't precise `<path>`, for the port the default one is `8080`.
You can use the same options as a normal application like `--name` or `--watch`.

## Process file

You can declare in a process file that you want a special dir to be served, to do so :

```javascript
module.exports = {
  script: "serve",
  env: {
    PM2_SERVE_PATH: '.',
    PM2_SERVE_PORT: 8080
  }
}
```

You just need to add `PM2_SERVE_PATH` and `PM2_SERVE_PORT` to env variables to specify the path and the port, the default are the same as the CLI.

## Serving SPA: redirect all to index.html

To automatically redirect all queries to the index.html use the `--spa` option:

```bash
pm2 serve --spa
```

Via a process file:

```javascript
module.exports = {
  script: "serve",
  env: {
    PM2_SERVE_PATH: '.',
    PM2_SERVE_PORT: 8080,
    PM2_SERVE_SPA: 'true',
    PM2_SERVE_HOMEPAGE: './index.html'
  }
}
```

### Protect access with password

To basic protect the access to the exposed files you can use the `--basic-auth-username` and `--basic-auth-password`:

```bash
pm2 serve --basic-auth-username <username> --basic-auth-password <password>
```

Via a process file:

```javascript
module.exports = {
  script: "serve",
  env: {
    PM2_SERVE_PATH: '.',
    PM2_SERVE_PORT: 8080,
    PM2_SERVE_BASIC_AUTH: 'true',
    PM2_SERVE_BASIC_AUTH_USERNAME: 'example-login',
    PM2_SERVE_BASIC_AUTH_PASSWORD: 'example-password'
  }
}
```

