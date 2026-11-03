# Configuration File
Source: https://pm2.keymetrics.io/docs/usage/application-declaration/

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
|namespace| (string) | "api" | process namespace, usable as target in commands (default to "default")|
|cwd| (string)       | "/var/www/" | the directory from which your app will be launched|
|args| (string or array) | "-a 13 -b 12" | arguments passed to the script|
|interpreter| (string) | "/usr/bin/python" |interpreter absolute path (default to node)|
|interpreter_args| (string or array) | "--harmony" | option to pass to the interpreter|
|node_args| (string or array) |   |arguments passed to the node interpreter (interpreter_args is an alias of this option)|
|port| (number) | 3000 | shortcut to inject a `PORT` environment variable|
|uid| (number or string) | "www-data" | run the app as this user (alias `user`). PM2 must run as root, not available on Windows|
|gid| (number or string) | "www-data" | run the app with this group. PM2 must run as root, not available on Windows|


### Advanced features

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|instances | number or "max" | -1 | number of app instance to be launched. `0` or "max" for one per CPU, `-1` for CPUs minus one |
|exec_mode | string | "cluster" | mode to start your app, can be "cluster" or "fork". Default to cluster when `instances` is set and the interpreter is node or bun, fork otherwise. A non-JS script in cluster mode falls back to fork with a warning|
| watch   | boolean or [] |  true |  enable watch & restart feature, if a file change in the folder or subfolder, your app will get reloaded |
|    ignore_watch    |   list  |     ["[\\/\\\\]\\./", "node_modules"]     | list of regex to ignore some file or folder names by the watch feature. Replaces the default ignore (dotfiles and node_modules)|
| watch_delay | number | 1000 | time in ms to wait after a file change before restarting (default 0) |
| watch_options | object | {"usePolling": true} | options passed to [chokidar](https://github.com/paulmillr/chokidar#api), merged over PM2 defaults |
| increment_var | string | "PORT" | env variable incremented by one for each instance ([see documentation](/docs/usage/environment/#specific-environment-variables)) |
| max_memory_restart |  string |  "150M" |  your app will be restarted if it exceeds the amount of memory specified. human-friendly format : it can be "10M", "100K", "2G" and so on... |
| env |  object |   {"NODE_ENV": "development", "ID": "42"}  | env variables which will appear in your app |
| env_<ENV_NAME> |  object |   {"NODE_ENV": "production", "ID": "89"}  | inject <ENV_NAME> when doing pm2 restart app.yml --env <ENV_NAME>|
| append_env_to_name | boolean | true | default to false. Use to deploy multiple environments on a single server. It will append each env to name. ex) my-api-production |
| disable_source_map_support | boolean |  true | default to false. If true, PM2 does not enable Node.js source maps (`process.setSourceMapsEnabled`) |
| instance_var | string | "NODE_APP_INSTANCE" | [see documentation](https://pm2.keymetrics.io/docs/usage/environment/#specific-environment-variables)|
| filter_env | boolean, string or array of string | [ "REACT_" ] | Filter the environment of the shell running pm2 (and, in cluster mode, of the daemon) passed to the app. `true` keeps only PATH, HOME, USER, LOGNAME, SHELL, LANG, LANGUAGE, the LC\_\* locale categories, TZ, TMPDIR, PM2_HOME and the Windows system variables; a string drops this exact variable; an array drops the variables whose name contains one of the strings (e.g. "REACT_"). Variables declared in `env` are always passed. CLI: `--filter-env` alone means `true`, `--filter-env AWS_` gives `["AWS_"]`. |
| pmx | boolean | false | default to true. If false, the monitoring agent (pm2-io-bpm) is not injected in the app. `automation: false` does the same |
| trace | boolean | true | default to false. Enable transaction tracing (OpenTelemetry packages are installed on first use, see `pm2 install-otel`) |
| disable_trace | boolean | true | force tracing off |
| deep_monitoring | boolean | true | enable all monitoring tools (v8, event loop inspector, tracing) |
| windowsHide | boolean | false | default to true. Hide the console window of the app on Windows (fork mode) |

### Log files

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|log_date_format| (string) | "YYYY-MM-DD HH:mm Z" | log date format (see log section)|
|error_file| (string)| | error file path (default to $HOME/.pm2/logs/&lt;app name&gt;-error.log, suffixed with the pm_id unless merge_logs is set: &lt;app name&gt;-error-&lt;pm_id&gt;.log)|
|out_file| (string) | | output file path (default to $HOME/.pm2/logs/&lt;app name&gt;-out.log, suffixed with the pm_id unless merge_logs is set)|
|log_file| (string or boolean) | | file path for both output and error logs (disabled by default). `true` writes to $HOME/.pm2/logs/&lt;app name&gt;.log|
|combine_logs| boolean | true | if set to true, avoid to suffix logs file with the pm_id |
|merge_logs| boolean | true | if set to true, avoid to suffix logs file with the pm_id (combine_logs is an alias of this option). Default to true when `exec_mode` is not cluster and `instances` is unset or 0, false otherwise|
|time| boolean | false | false by default. If true auto prefixes logs with Date|
|log_type| (string) | "json" | log output style, possible value: 'json' (raw by default)|
|disable_logs| boolean | true | false by default. If true app output is dropped: nothing is written to disk nor shown by `pm2 logs`|
|pid_file| (string) | | pid file path (default to $HOME/.pm2/pids/&lt;app name&gt;-&lt;pm_id&gt;.pid, always suffixed with the pm_id)|

### Control flow

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|min_uptime| (number or string) | "10s" | min uptime of the app to be considered started (defaults to 1000 ms) |
| listen_timeout | number | 3000 | time in ms before forcing a reload if app not listening (defaults to 3000) |
| kill_timeout | number | 1600 | time in milliseconds before sending [a final SIGKILL](https://pm2.keymetrics.io/docs/usage/signals-clean-restart/#explanation-signals-flow) |
| kill_retry_time | number | 100 | interval in ms between checks that the app has exited after the kill signal (defaults to 100) |
| treekill | boolean | false | true by default. If false, only the main process is killed, not its children |
| shutdown_with_message | boolean | false | shutdown an application with process.send('shutdown') instead of process.kill(pid, SIGINT) |
| wait_ready | boolean | false | Instead of reload waiting for listen event, wait for process.send('ready') |
| max_restarts| number | 16 | number of consecutive unstable restarts (less than 1sec interval or custom time via min_uptime) before your app is considered errored and stop being restarted. defaults to 16|
| restart_delay    | number |                    4000                   |                             time to wait before restarting a crashed app (in milliseconds). defaults to 0.|
| exp_backoff_restart_delay | number | 100 | base delay in ms of the [exponential backoff restart](/docs/usage/restart-strategies/#exponential-backoff-restart-delay) |
| autorestart | boolean |  false  |  true by default. if false, PM2 will not restart your app if it crashes or ends peacefully  |
| stop_exit_codes | number or array | [0] | exit codes that skip auto restart |
| autostart | boolean | false | true by default. If false, the app is added to the process list without being started |
| cron_restart    |  string |                "1 0 * * *"                |                                      a cron pattern to restart your app. The cron also fires when the app is stopped (or `autostart: false`), and starts it  |
| vizion       | boolean |                   false                   |  true by default, but only active when the daemon runs with `PM2_ENABLE_GIT_PARSING=true`. If false, PM2 will start without vizion features (versioning control metadata) |
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
max_restarts      -> --max-restarts
kill_timeout      -> --kill-timeout
force             -> --force
```

`exec_mode` has no CLI flag: `-i <instances>` starts in cluster mode, `-x` (`--execute-command`) forces fork mode.

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
To drop all app output (files and `pm2 logs`), use `disable_logs: true`.

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
