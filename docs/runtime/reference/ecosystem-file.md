---
layout: none
title: Ecosystem File | Reference | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/reference/ecosystem-file/"
last_modified_at: 2026-07-03
description: "The purpose of the ecosystem file is to gather all options and environment variables for all your applications."
sitemap: false
redirect_to: "/docs/usage/application-declaration/"
---

# Ecosystem file reference

The purpose of the ecosystem file is to gather all options and environment variables for all your applications.

It is a javascript file which exports an object with all the configuration options.

The object has two properties:
- apps, an array that contains the configuration for each process
- deploy, an object that contains the configuration for the deployments

```javascript
module.exports = {
  apps: [{}, {}],
  deploy: {}
}
```

## Apps options

The apps property is an array of object where each object contains the configuration for each process.


Entry name|Description|Type|Default
---|---|---|---
script|Path of the script to launch, required field|string|
name|Process name in the process list|string|Script filename without the extension (app for app.js)
cwd|Current working directory to start the process with|string|CWD of the current environment (from your shell)
args|Arguments to pass to the script|array,string|
interpreter|Interpreter absolute path|string|node
node_args|Arguments to pass to the interpreter|array,string|
output|File path for stdout (each line is appended to this file)|string|~/.pm2/logs/<app_name>-out.log
error|File path for stderr (each line is appended to this file)|string|~/.pm2/logs/<app_name>-error.err
log|File path for combined stdout and stderr (each line is appended to this file)|boolean,string|/dev/null
disable_logs|Disable all logs storage|boolean|
log_type|Define a specific log output type, possible value: json|string|
log_date_format|Format for log timestamps in moment.js format (eg YYYY-MM-DD HH:mm Z)|string|
env|Specify environment variables to be injected|object,string|
^env_\S*$|Specify environment variables to be injected when using --env <env_name>|object,string|
max_memory_restart|Restart the app if an amount of memory is exceeded (format: /[0-9](K&#124;M&#124;G)?/ K for KB, 'M' for MB, 'G' for GB, default to B)|string,number|
pid_file|File path where the pid of the started process is written by pm2|string|~/.pm2/pids/app_name-id.pid
restart_delay|Time in ms to wait before restarting a crashing app|number|
source_map_support|Enable or disable the source map support|boolean|true
disable_source_map_support|Enable or disable the source map support|boolean|
wait_ready|Make the process wait for a process.send('ready')|boolean|
instances|Number of instances to be started in cluster mode|number|1
kill_timeout|Time in ms before sending the final SIGKILL signal after SIGINT|number|1600
listen_timeout|Time in ms before forcing a reload if app is still not listening/has still not sent ready|number|
cron_restart|A cron pattern to restart your app|string|
merge_logs|In cluster mode, merge each type of logs into a single file (instead of having one for each cluster)|boolean|
vizion|Enable or disable the versioning metadatas (vizion library)|boolean|true
autorestart|Enable or disable auto restart after process failure|boolean|true
watch|Enable or disable the watch mode|boolean,array,string|
ignore_watch|List of paths to ignore (regex)|array,string|
watch_options|Object that will be used as an options with chokidar (refer to chokidar documentation)|object|
min_uptime|Minimum uptime of the app to be considered started (format is /[0-9]+(h&#124;m&#124;s)?/, for hours, minutes, seconds, default to ms)|number,string|1000
max_restarts|Number of times a script is restarted when it exits in less than min_uptime|number|16
exec_mode|Set the execution mode, possible values: fork&#124;cluster|string|fork
force|Start a script even if it is already running (only the script path is considered)|boolean|
append_env_to_name|Append the environment name to the app name|boolean|
post_update|List of commands executed after a pull/upgrade operation performed from Keymetrics dashboard|array|
trace|Enable or disable the transaction tracing|boolean|
disable_trace|Enable or disable the transaction tracing|boolean|true
increment_var|Specify the name of an environnement variable to inject which increments for each cluster|string|
instance_var|Rename the NODE_APP_INSTANCE environment variable|string|NODE_APP_INSTANCE
pmx|Enable or disable apm wrapping|boolean|true
automation|Enable or disable apm wrapping|boolean|true
treekill|Only kill the main process, not detached children|boolean|true
port|Shortcut to inject a PORT environment variable|number|
uid|Set user id|string|Current user uid
gid|Set group id|string|Current user gid

## Deploy options

The deploy property is an object where each of its properties is an object which defines a deployment environment.

The structure is the following:

```javascript
module.exports = {
  apps: [{}, {}],
  deploy: {
    production: {},
    staging: {},
    development: {}
  }
}
```

The deployment environment object can have the following properties:

Entry name|Description|Type|Default
---|---|---|---
key|SSH key path|String|$HOME/.ssh
user|SSH user|String|
host|SSH host|[String]|
ssh_options|SSH options with no command-line flag, see 'man ssh'|String or [String]|
ref|GIT remote/branch|String|
repo|GIT remote|String|
path|path in the server|String|
pre-setup| Pre-setup command or path to a script on your local machine|String|
post-setup|Post-setup commands or path to a script on the host machine|String
pre-deploy-local|pre-deploy action|String|
post-deploy|post-deploy action|String|
