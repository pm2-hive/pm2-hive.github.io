# Environment Variables
Source: https://pm2.keymetrics.io/docs/usage/environment/

## When starting a new process

PM2 will inject environment in this order when **starting** a new process :

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
        watch: true,
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 80,
            "NODE_ENV": "production",
        }
      }
  ]
}
```

Here the default environment is in the `env`, but you can decide to use `env_production` by using `pm2 start ecosystem.config.js --env production`.

You can define as many environments as you like, just remember that you must pass the name of the environment (after `env_`) you want to use with `--env`.

## Not passing the shell environment

Set `filter_env` to keep the environment of the shell running `pm2` (and, in cluster mode, of the PM2 daemon) away from the app:

- `filter_env: true` (CLI `--filter-env`): the app only gets PATH, HOME, USER, LOGNAME, SHELL, LANG, LANGUAGE, the LC\_\* locale categories, TZ, TMPDIR, PM2_HOME (and the Windows system variables) plus what `env` declares
- `filter_env: "AWS_SECRET"`: drops this variable
- `filter_env: ["AWS_", "TOKEN"]` (CLI `--filter-env AWS_ --filter-env TOKEN`): drops every variable whose name contains one of the strings

It also applies on `pm2 restart/reload --update-env`. Declare any other variable the app needs (NODE_ENV, NODE_OPTIONS, HTTP_PROXY...) in `env`.

`filter_env` keeps secrets out of the app environment, it does not isolate it: an app running as the same user as the PM2 daemon can still read the daemon environment (`/proc/<pid>/environ` on Linux). Start the daemon from a clean environment (e.g. `pm2 startup`) or run the app with `uid`.

Before PM2 7.1.2, `filter_env: true` was ignored. Variables an app already received stay in its saved configuration across restarts: run `pm2 delete <app>`, `pm2 start ecosystem.config.js`, `pm2 save --force`, and rotate any exposed secret.

## Specific environment variables

### NODE_APP_INSTANCE (PM2 2.5 minimum)

There is the `NODE_APP_INSTANCE` environment variable that is used to make a difference between process, for example you may want to run a cronjob only on one process, you can just check if `process.env.NODE_APP_INSTANCE === '0'`.
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

#### increment_var (PM2 2.5 minimum)

There is an option to ask PM2 to increment an environment variable for each instance launched, for example:

```javascript
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
