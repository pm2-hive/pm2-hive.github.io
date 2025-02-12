---
layout: docs
title: Ecosystem File
description: Manage applications via a configuration file
permalink: /docs/usage/application-declaration/
---

## Configuration File

When managing multiple applications with PM2, use a JS configuration file to organize them.

### Generate configuration

To generate a sample configuration file you can type this command:

```bash
$ pm2 init simple
```

This will generate a sample `ecosystem.config.js`:

```javascript
module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js"
  }]
}
```

If you are creating your own configuration file, make sure it ends with `.config.js` so PM2 is able to recognize it as a configuration file.

### Acting on Configuration File

Seamlessly than acting on an app you can start/stop/restart/delete all apps contained in a configuration file:

```bash
# Start all applications
pm2 start ecosystem.config.js

# Stop all
pm2 stop ecosystem.config.js

# Restart all
pm2 restart ecosystem.config.js

# Reload all
pm2 reload ecosystem.config.js

# Delete all
pm2 delete ecosystem.config.js
```

#### Act on a specific process

You can also act on a particular application by using its name and the option `--only <app_name>`:

```bash
pm2 start   ecosystem.config.js --only api-app
```

*Note*: the `--only` option works for start/restart/stop/delete as well

You can even specify multiple apps to be acted on by specifying each app name separated by a comma:

```bash
pm2 start ecosystem.config.js --only "api-app,worker-app"
```

### Switching environments

You can specify different environment variable set via the `env_*` option.

Example:

```javascript
module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js",
    env_production: {
       NODE_ENV: "production"
    },
    env_development: {
       NODE_ENV: "development"
    }
  }]
}
```

Now to switch between variables in different environment, specify the `--env [env name]` option:

```bash
pm2 start ecosystem.config.js --env production
pm2 restart ecosystem.config.js --env development
```

## Attributes available

Application behavior and configuration can be fine-tuned with the following attributes:

### General

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|name   | (string)   | "my-api" | application name (default to script filename without extension)|
|script| (string)    | "./api/app.js" | script path relative to pm2 start|
|cwd| (string)       | "/var/www/" | the directory from which your app will be launched|
|args| (string)      | "-a 13 -b 12" | string containing all arguments passed via CLI to script|
|interpreter| (string) | "/usr/bin/python" |interpreter absolute path (default to node)|
|interpreter_args| (string) | "--harmony" | option to pass to the interpreter|
|node_args| (string) |   |alias to interpreter_args |


### Advanced features

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|instances | number | -1 | number of app instance to be launched |
|exec_mode | string | "cluster" | mode to start your app, can be "cluster" or "fork", default fork|
| watch   | boolean or [] |  true |  enable watch & restart feature, if a file change in the folder or subfolder, your app will get reloaded |
|    ignore_watch    |   list  |     ["[\\/\\\\]\\./", "node_modules"]     | list of regex to ignore some file or folder names by the watch feature|
| max_memory_restart |  string |  "150M" |  your app will be restarted if it exceeds the amount of memory specified. human-friendly format : it can be "10M", "100K", "2G" and so on... |
| env |  object |   {"NODE_ENV": "development", "ID": "42"}  | env variables which will appear in your app |
| env_<ENV_NAME> |  object |   {"NODE_ENV": "production", "ID": "89"}  | inject <ENV_NAME> when doing pm2 restart app.yml --env <ENV_NAME>|
| appendEnvToName | boolean | true | default to false. Use to deploy multiple environments on a single server. It will append each env to name. ex) my-api-production |
| source_map_support | boolean |  true | default to true, [enable/disable source map file]
| instance_var | string | "NODE_APP_INSTANCE" | [see documentation](http://pm2.keymetrics.io/docs/usage/environment/#specific-environment-variables)|
| filter_env | array of string | [ "REACT_" ] | Excludes global variables starting with "REACT_" and will not allow their penetration into the cluster. |

### Log files

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|log_date_format| (string) | "YYYY-MM-DD HH:mm Z" | log date format (see log section)|
|error_file| (string)| | error file path (default to $HOME/.pm2/logs/&lt;app name&gt;-error-&lt;pid&gt;.log)|
|out_file| (string) | | output file path (default to $HOME/.pm2/logs/&lt;app name&gt;-out-&lt;pid&gt;.log)|
|log_file| (string) | | file path for both output and error logs (disabled by default)|
|combine_logs| boolean | true | if set to true, avoid to suffix logs file with the process id |
|merge_logs| boolean | true | alias to combine_logs |
|time| boolean | false | false by default. If true auto prefixes logs with Date|
|pid_file| (string) | | pid file path (default to $HOME/.pm2/pids/&lt;app name&gt;-&lt;pid&gt;.pid)|

### Control flow

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|min_uptime| (number) | | min uptime of the app to be considered started |
| listen_timeout | number | 8000 | time in ms before forcing a reload if app not listening |
| kill_timeout | number | 1600 | time in milliseconds before sending [a final SIGKILL](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/#cleaning-states-and-jobs) |
| shutdown_with_message | boolean | false | shutdown an application with process.send('shutdown') instead of process.kill(pid, SIGINT) |
| wait_ready | boolean | false | Instead of reload waiting for listen event, wait for process.send('ready') |
| max_restarts| number | 10 | number of consecutive unstable restarts (less than 1sec interval or custom time via min_uptime) before your app is considered errored and stop being restarted|
| restart_delay    | number |                    4000                   |                             time to wait before restarting a crashed app (in milliseconds). defaults to 0.|
| autorestart | boolean |  false  |  true by default. if false, PM2 will not restart your app if it crashes or ends peacefully  |
| cron_restart    |  string |                "1 0 * * *"                |                                      a cron pattern to restart your app. Application must be running for cron feature to work  |
| vizion       | boolean |                   false                   |  true by default. if false, PM2 will start without vizion features (versioning control metadata) |
| post_update    |   list  | ["npm install", "echo launching the app"] |                                        a list of commands which will be executed after you perform a Pull/Upgrade operation from Keymetrics dashboard |
| force       | boolean |                    true                   |                                          defaults to false. if true, you can start the same script several times which is usually not allowed by PM2 |

### Deployment 

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

### Considerations

All command line options passed when using the JSON app declaration will be dropped i.e.

#### CWD

**cwd:** your JSON declaration does not need to reside with your script.  If you wish to maintain the JSON(s) in a location other than your script (say, `/etc/pm2/conf.d/node-app.json`) you will need to use the `cwd` feature (Note, this can be really helpful for capistrano style directory structures that uses symlinks). Files can be either relative to the `cwd` directory, or absolute (see example below).

### CLI/JSON options

All the keys can be used in a JSON configured file, but will remain almost the same on the command line e.g.:

```
exec_mode         -> --execute-command
max_restarts      -> --max-restarts
force             -> --force
```

Using quotes to make an ESC, e.g.:

```bash
$pm2 start test.js --node-args "port=3001 sitename='first pm2 app'"
```

The `nodeArgs` argument will be parsed as

```json
[
  "port=3001",
  "sitename=first pm2 app"
]
```

but not

```json
[
  "port=3001",
  "sitename='first",
  "pm2",
  "app'"
]
```

### Disabling logs

You can pass `/dev/null` to error_file or out_file to disable logs saving.
Note: starting PM2 `2.4.0`, `/dev/null` or `NULL` disable logs independently of the platform.

### Logs suffix

You can disable automatic ID suffixes on logs (e.g. `app-name-ID.log`) by passing enabling the option `merge_logs: true`

### Environment definition

You'll need to use `--env <envname>` to tell pm2 to use specific environment defined inside a process file :

```json
{
  "apps" : [{
    "name"        : "worker-app",
    "script"      : "./worker.js",
    "watch"       : true,
    "env": {
      "NODE_ENV": "development"
    },
    "env_production" : {
       "NODE_ENV": "production"
    }
  },{
    "name"       : "api-app",
    "script"     : "./api.js",
    "instances"  : 4,
    "exec_mode"  : "cluster"
  }]
}
```

In this example, you will run `pm2 start ecosystem.json` and it will start your application with the default environment (in development so).
Then you use `pm2 start ecosystem.json --env production` and it will use the attribute `env_<name>` where name is `production` here, so it will start your app with `NODE_ENV=production`.

### Special `ext_type`

- min_uptime
  Value of `min_uptime` can be:
    - **Number**
      e.g. `"min_uptime": 3000` means 3000 milliseconds.
    - **String**
      Therefore, we are making it short and easy to configure: `h`, `m` and `s`, e.g.: `"min_uptime": "1h"` means one hour, `"min_uptime": "5m"` means five minutes and `"min_uptime": "10s"` means ten seconds (those will be transformed into milliseconds).

- max_memory_restart
  Value of `max_memory_restart` can be:
    - **Number**
        e.g. `"max_memory_restart": 1024` means 1024 bytes (**NOT BITS**).
    - **String**
        Therefore, we are making it short and easy to configure: `G`, `M` and `K`, e.g.: `"max_memory_restart": "1G"` means one gigabyte, `"max_memory_restart": "5M"` means five megabytes and `"max_memory_restart": "10K"` means ten kilobytes (those will be transformed into byte(s)).

- Optional values
  For example `exec_mode` can take `cluster` (`cluster_mode`) or `fork` (`fork_mode`) as possible values.

- Things to know
  - `"instances": 0` means that PM2 will launch the maximum processes possible according to the numbers of CPUs (cluster mode)
  - array
  `args`, `node_args` and `ignore_watch` could be type of `Array` (e.g.: `"args": ["--toto=heya coco", "-d", "1"]`) or `string` (e.g.: `"args": "--to='heya coco' -d 1"`)
