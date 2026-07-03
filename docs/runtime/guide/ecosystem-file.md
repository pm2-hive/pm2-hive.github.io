---
layout: docs-io
title: Ecosystem File | Guide | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/guide/ecosystem-file/"
sitemap: false
redirect_to: "/docs/usage/application-declaration/"
description: "When deploying on multiple servers or when using multiple CLI arguments, an alternative to the command line becomes more convenient for starting your apps."
---

# Ecosystem File

When deploying on multiple servers or when using multiple CLI arguments, an alternative to the command line becomes more convenient for starting your apps.

The purpose of the ecosystem file is to gather all options and environment variables for all your applications.

## Generate a template

Generate an `ecosystem.config.js` template with:

```bash
pm2 ecosystem
```

This will generate:

```javascript
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```

For more information about available properties, check the [ecosystem file reference]({{ site.baseurl }}{% link docs/runtime/reference/ecosystem-file.md %}).

## Use your ecosystem file

### Routine

Inside your source code working directory, you can add all of the applications to your process list with:

```bash
pm2 start
```

This will run all of the `apps` defined within the `ecosystem.config.js` generated with `pm2 init`.

You can also load an ecosystem from an other folder with:

```bash
pm2 start /path/to/ecosystem.config.js
```

### Only use a specific app

Use your ecosystem file only on a specific application with the option `--only <app_name>`:

```bash
pm2 start --only app
```

## Environment variables

You can declare variables for multiple environments. Each enviroment key must have this format: `env_<environment-name>`.

For example, the following `app` process can be started in two environments: `development` and `production`.

```javascript
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```

To start this `app` in a particular environment, use the `--env` flag:

```bash
pm2 start ecosystem.config.js # uses variables from `env`
pm2 start ecosystem.config.js --env production # uses variables from `env_production`
```

### Options Reference

To know more about all the options available checkout [the complete option reference](/docs/runtime/reference/ecosystem-file/)

## Next Steps

[Process Management]({{ site.baseurl }}{% link docs/runtime/guide/process-management.md %})
{: .btn-stylized}
