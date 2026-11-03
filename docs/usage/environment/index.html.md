# Environment Variables
Source: https://pm2.keymetrics.io/docs/usage/environment/

## When starting a new process

PM2 will inject environment in this order when **starting** a new process :

- First the PM2 CLI will use its environment so the current environment of your shell will be injected. Since PM2 7.1.0, shell variables named like a PM2 option (`name`, `namespace`, `instances`, `port`, `watch`...) or prefixed with `pm_`/`axm_` are not passed, and [`filter_env`](#filtering-the-shell-environment) can drop more.
- PM2 will then inject the environment that you can configure with the ecosystem file (it always wins over the shell) :

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

## Filtering the shell environment

Use `filter_env` to restrict what the app inherits from the shell running pm2 (and, in cluster mode, from the daemon):

| Value | Effect |
|:---|:---|
| `true` | keep only PATH, HOME, USER, LOGNAME, SHELL, LANG, LANGUAGE, the LC\_\* locale categories, TZ, TMPDIR, PM2_HOME (and the Windows system variables) |
| `"KEY"` | drop this exact variable |
| `["AWS_", "REACT_"]` | drop every variable whose name contains one of the strings |
| `false` (default) | inherit everything |

Variables declared in `env` (or the selected `env_<name>`) are always passed:

```javascript
module.exports = {
  apps : [{
    name: "myapp",
    script: "./app.js",
    filter_env: true,
    env: {
      NODE_ENV: "production"
    }
  }]
}
```

Via CLI, `--filter-env` alone means `true`, `--filter-env AWS_` drops the variables containing `AWS_`. The filter also applies to `--update-env` restart/reload and to cluster workers.

**Breaking change in PM2 7.1.2**: `filter_env: true` was ignored since 4.4.1 and works again. Apps using it no longer inherit NODE_ENV, NODE_OPTIONS, HTTP_PROXY or any other shell variable: declare them in `env`. An app that already received the full shell env (started before 7.1.2 or without `filter_env`, `dump.pm2` included) keeps it: `pm2 delete` it and start it again.

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

## PM2 environment variables

These variables configure PM2 itself. Daemon-side ones are read when the daemon starts: run `pm2 kill` (or `pm2 update`) after changing them.

| Variable | Default | Description |
|:---|:---|:---|
| PM2_HOME | `$HOME/.pm2` | PM2 folder (logs, pids, sockets, dump.pm2). Each PM2_HOME is a separate daemon |
| PM2_KILL_TIMEOUT | 1600 | default `kill_timeout` (ms before the final SIGKILL) |
| PM2_KILL_SIGNAL | SIGINT | signal sent to stop an app |
| PM2_KILL_USE_MESSAGE | false | stop every app with `process.send('shutdown')`, like `shutdown_with_message` |
| PM2_KILL_RETRY_TIME | 100 | default `kill_retry_time` (ms between exit checks) |
| PM2_GRACEFUL_TIMEOUT | 8000 | cluster reload: ms to wait for the old worker to disconnect before deleting it |
| PM2_GRACEFUL_LISTEN_TIMEOUT | 3000 | default `listen_timeout` |
| PM2_WORKER_INTERVAL | 30000 | ms between daemon worker runs (`max_memory_restart` checks, backoff reset) |
| PM2_CONCURRENT_ACTIONS | 2 | apps started/restarted/reloaded in parallel |
| PM2_RELOAD_LOCK_TIMEOUT | 30000 | ms a reload refuses a concurrent one (`--force` bypasses it) |
| PM2_ENABLE_GIT_PARSING | false | `true` enables vizion (git metadata of apps) |
| PM2_PROCESS_INSTANCE_VAR | | overrides `instance_var` for every app |
| PM2_LOG_DATE_FORMAT | YYYY-MM-DDTHH:mm:ss | date prefix of the daemon log (`pm2.log`) |
| PM2_SILENT | | hide CLI output, like `-s` |
| PM2_DISCRETE_MODE | | hide some daemon start messages (set by pm2-runtime and `-s`) |
| PM2_NO_INTERACTION | | `true` does not start the PM2.io agent with the daemon |
| PM2_DISABLE_VERSION_CHECK | | disable the daily new version check |
| PM2_DAEMON_TITLE | `PM2 vX.Y.Z: God Daemon (<PM2_HOME>)` | process title of the daemon |
| PM2_SOCKET_USER / PM2_SOCKET_GROUP | | numeric uid / gid owning the rpc and pub sockets (both required) |
| PM2_API_IPADDR / PM2_API_PORT | 0.0.0.0 / 9615 | `pm2 web` listen address and port (PM2_WEB_PORT overrides the port) |
| PM2_WEB_STRIP_ENV_VARS | false | remove app env variables from the `pm2 web` output |
| PM2_OPTIMIZE_MEMORY | false | start the daemon with `--gc-global` and `--max-old-space-size` |
| PM2_PUBLIC_KEY / PM2_SECRET_KEY | | PM2.io bucket keys |
| PM2_MACHINE_NAME | `<hostname>-<random>` | server name on PM2.io |
