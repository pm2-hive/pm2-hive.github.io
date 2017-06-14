---
layout: docs
title: Environment management
description: manage environment variables of your applications
permalink: /docs/usage/environment/
---

## When starting a new process

PM2 will inject environment in this order when **starting** a new processs :

- First the PM2 CLI will use its environment so the current environment of your shell will be injected.
- PM2 will then inject the environment that you can configure with the ecosystem file :

```javascript
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        watch: true,
        env: {
          "NODE_ENV": "development",
        }
      }
  ]
}
```

Here you can see that PM2 will override the current environment to add `NODE_ENV=development`. But you can also define different environments like this : 

```javascript
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        watche: true,
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 80
            "NODE_ENV": "production",
        }
      }
  ]
}
```

Here the default environment is in the `env`, but you can deside to use `env_production` by using `pm2 start ecosystem.config.js --env production`.

You can define as many environment as you like, just remember that you must pass the name of the environment (after `env_`) you want to use with `--env`.


## While restarting/reloading a process

By default we want that PM2 doesn't change process environment while restarting or reloading so they are immutable. 
If you want to update them, you must use `--update-env` : 

- You want to restart your process and pick-up changes in your `ecosystem.json` ?
Use `pm2 reload ecosystem.json --update-env`

- You want to pick-up the `ecosystem.json` changes for only one application ?
Use `pm2 relaod ecosystem.json --update-env --only myapp`

- You want to inject a new environment variable to a process (for example `DEBUG`): 
Use `DEBUG=* pm2 reload myapp --update-env`

## Specific environment variables

#### NODE_APP_INSTANCE (PM2 2.5 minimum)
There is the `NODE_APP_INSTANCE` environment variable that is used to make a difference between process, for example you may want to run a cronjob only on one process, you can just check if `process.env.NODE_APP_INSTANCE === 0`. 
Two processes can never have the same number, its still true after `pm2 restart` and `pm2 scale` commands. 

You may have problems with [node-config](https://github.com/Unitech/pm2/issues/2045) with the `NODE_APP_INSTANCE` name, so you can rename it with `instance_var` options : 

```javascript
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        watch: true,
        instance_var: 'INSTANCE_ID',
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        }
      }
  ]
}
```

In this case the variable will have the same behavior but will be in `process.env.INSTANCE_ID`.

<!--
#### increment_var (PM2 2.5 minimum)

There is an option to ask PM2 to increment a environment variable for each instance launched, for example : 
```javascript=
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        instances: 2,
        exec_mode: "cluster",
        watch: true,
        increment_var : 'PORT',
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        }
      }
  ]
}
```

In this example, if i run `pm2 start ecosystem.config.js` : 
 - PM2 will see that i want to increment the `PORT` variable for each instance
 - It will see that i have defined the default to `3000`
 - The first instance will have `process.env.PORT = 3000` and the second `process.env.PORT = 3001`

**NOTE** : It will increment also when scaling using `pm2 scale myapp 4`, both new instances will have `3002` and `3003` as `PORT` variable.

-->
