---
layout: none
title: Environment Variables | Best Practices | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/best-practices/environment-variables/"
last_modified_at: 2026-07-03
description: "Environment variables are special variables that can be set out of your Node.js applications, particularly useful to make your application configurable…"
sitemap: false
redirect_to: "/docs/usage/environment/"
---

# Environment Variables Management

Environment variables are special variables that can be set out of your Node.js applications, particularly useful to make your application configurable externally. Let's say a cloud provider wants to change the listening port of your app or if you want to enable verbose logging without getting into the code.

## CLI

Via CLI, the environment is *conservative*  meaning that, when you will run different process management actions (restart, reload, stop/start), new environment variables will not be updated into your application.

### Set environment

To set an environment variable via CLI:

```bash
$ ENV_VAR=value pm2 start app.js
```

### Update environment

To update environment variables, you have to append the `--update-env` to the restart/reload command:

```bash
$ ENV_VAR=somethingnew pm2 restart app --update-env
```

## Ecosystem process file

Any time you change the ecosystem process file, the environment variables will be updated.

### Set Environment

To set default environment variables via ecosystem file, you just need to declare them under the "env:" attribute:

```javascript
module.exports = {
  apps: [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development"
    },
    env_test: {
      NODE_ENV: "test",
    },
    env_staging: {
      NODE_ENV: "staging",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```

Then start it:

```bash
$ pm2 start ecosystem.config.js
```

As you might have noticed, there is also a part about the `env_test`, `env_staging` and `env_production` in the ecosystem file.

For example to use the `env_production` variables instead of the default ones you just need to pass the `--env <env_name>` option:

```bash
$ pm2 start ecosystem.config.js --env production
```

Note: The `env_production` in the ecosystem file is a regex like `env_*` that can have any value and be called when using the CLI via `-- env *`.

### Update

If you are using Ecosystem file to manage your application environment variables under the `env:` attribute, the updated ones will always be updated on `pm2 <restart/reload> app`.

```bash
$ pm2 restart/reload ecosystem.config.js [--env production]
```

## Good practice: The NODE_ENV variable

A common convention in Node.js is that the NODE_ENV environment variable specifies the environment in which an application is running (usually, development or production).

For example, with express, setting NODE_ENV to “production” can improve performance by a factor of 3 according to the [documentation](https://expressjs.com/docs/advanced/best-practice-performance.html#set-node_env-to-production). This enables:
- Cache for view templates.
- Cache for CSS files generated from CSS extensions.
- Generate less verbose error messages.
