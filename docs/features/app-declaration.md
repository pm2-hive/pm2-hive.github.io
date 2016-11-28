---
layout: docs
title: Process File
description: Manage applications via a configuration file
permalink: /docs/usage/application-declaration/
---

## Process File

PM2 empowers your process management workflow, by allowing you to fine-tune the behavior, options, environment variables, logs files of each app via a process file. It's particularly useful for micro service based applications.

Configuration format supported are Javascript, JSON and YAML.

## Generate configuration

To generate a sample process file you can type this command:

```
$ pm2 ecosystem
```

This will generates a sample `ecosystem.config.js`.

### Javascript format

```javascript
module.exports = {
  apps : [{
    name        : "worker",
    script      : "./worker.js",
    watch       : true,
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name       : "api-app",
    script     : "./api.js",
    instances  : 4,
    exec_mode  : "cluster"
  }]
}
```

**Note that using a Javascript configuration file require to prefix the file with .config.js**

### JSON format

The configuration can be also in JSON format.

```javascript
{
  apps : [{
    name        : "worker",
    script      : "./worker.js",
    watch       : true,
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name       : "api-app",
    script     : "./api.js",
    instances  : 4,
    exec_mode  : "cluster"
  }]
}
```

### YAML format

Here is the same example in YAML format:

```yaml
apps:
  - script   : ./api.js
    name     : 'api-app'
    instances: 4
    exec_mode: cluster
  - script : ./worker.js
    name   : 'worker'
    watch  : true
    env    :
      NODE_ENV: development
    env_production:
      NODE_ENV: production
```

### CLI

Then you can run and manage your processes easily:

```bash
# Start all applications
$ pm2 start ecosystem.config.js

# Start only the app named worker-app
$ pm2 start ecosystem.config.js --only worker-app

# Stop all
$ pm2 stop ecosystem.config.js

# Restart all
$ pm2 start   ecosystem.config.js
## Or
$ pm2 restart ecosystem.config.js

# Reload all
$ pm2 reload ecosystem.config.js

# Delete all
$ pm2 delete ecosystem.config.js
```

### Act on a specific process

You can also act on a particular application name by using the option `--only <app_name>`:

```bash
$ pm2 start   ecosystem.config.js --only api-app
$ pm2 restart ecosystem.config.js --only api-app
$ pm2 reload  ecosystem.config.js --only api-app
$ pm2 delete  ecosystem.config.js --only api-app
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
| source_map_support | boolean |  true | default to true, [enable/disable source map file](http://pm2.keymetrics.io/docs/usage/source-map-support/) support when throwing exception|

### Log files

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|log_date_format| (string) | "YYYY-MM-DD HH:mm Z" | log date format (see log section)|
|error_file| (string)| | error file path (default to $HOME/.pm2/logs/XXXerr.log)|
|out_file| (string) | | output file path (default to $HOME/.pm2/logs/XXXout.log)|
|combine_logs| boolean | true | if set to true, avoid to suffix logs/pid file with the process id |
|merge_logs| boolean | true | alias to combine_logs |
|pid_file| (string) | | pid file path (default to $HOME/.pm2/pid/app-pm_id.pid)|

### Control flow

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|min_uptime| (string) | | min uptime of the app to be considered started |
| listen_timeout | number | 8000 | time in ms before forcing a reload if app not listening |
| kill_timeout | number | 1600 | time in milliseconds before sending [a final SIGKILL](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/#cleaning-states-and-jobs) |
| wait_ready | boolean | false | Instead of reload waiting for listen event, wait for process.send('ready') |
| max_restarts| number | 10 | number of consecutive unstable restarts (less than 1sec interval or custom time via min_uptime) before your app is considered errored and stop being restarted|
| restart_delay    | number |                    4000                   |                             time to wait before restarting a crashed app (in milliseconds). defaults to 0.|
| autorestart | boolean |  false  |  true by default. if false, PM2 will not restart your app if it crashes or ends peacefully  |
| cron_restart    |  string |                "1 0 * * *"                |                                      a cron pattern to restart your app. Application must be running for cron feature to work  |
| vizion       | boolean |                   false                   |  true by default. if false, PM2 will start without vizion features (versioning control metadatas) |
| post_update    |   list  | ["npm install", "echo launching the app"] |                                        a list of commands which will be executed after you perform a Pull/Upgrade operation from Keymetrics dashboard |
| force       | boolean |                    true                   |                                          defaults to false. if true, you can start the same script several times which is usually not allowed by PM2 |

## Switching environments

You may have noticed that you can declare environment-specific variables with the attribute `env_*` (e.g. env_production, env_staging...). These can be switched easily. You just need to specify the `--env <environment_name>` when acting on the application declaration.

Example:

```bash
# Inject what is declared in env_production
$ pm2 start process.json --env production

# Inject what is declared in env_staging
$ pm2 restart process.json --env staging
```

## JSON & Javascript

JSON file are interpreter, so you can inject Javascript into a JSON configuration file.
Example:

```javascript
{
  apps : [{
    name   : process.env.USER,
    script : [".", "/", "e", "cho.js"].join('')
  }, {
    name   : 'API-2',
    script : ["./", "api.js"].join('')
  }]
}
```

## Considerations

All command line options passed when using the JSON app declaration will be dropped i.e.

### Multiple JSON

You can start as many JSON app declarations as you want.

```bash
$ cat node-app-1.json

{
  "name" : "node-app-1",
  "script" : "app.js",
  "cwd" : "/srv/node-app-1/current"
}
```

```bash
$ pm2 start node-app-2.json
$ ps aux | grep node-app
root  14735  5.8  1.1  752476  83932 ? Sl 00:08 0:00 pm2: node-app-1
root  24271  0.0  0.3  696428  24208 ? Sl 17:36 0:00 pm2: node-app-2
```

*Note* that if you execute `pm2 start node-app-2` again, it will spawn an additional instance node-app-2.

### CWD

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

```JSON
[
  "port=3001",
  "sitename=first pm2 app"
]
```

but not

```JSON
[
  "port=3001",
  "sitename='first",
  "pm2",
  "app'"
]
```

### Disabling logs

You can pass `/dev/null` to error_file or out_file to disable logs saving.

### Logs suffix

You can disable automatic ID suffixs on logs (e.g. `app-name-ID.log`) by passing enabling the option `merge_logs: true`

### env_<NAME>

Matches the keys of configured JSON by RegExp (not by string comparison), e.g. `^env_\\S*$` will match all `env` keys like `env_production`, `env_test`, and valid them according to the schemas specifications.

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
        Therefore, we are making it short and easy to configure: `G`, `M` and `K`, e.g.: `"max_memory_restart": "1G"` means one gigabytes, `"max_memory_restart": "5M"` means five megabytes and `"max_memory_restart": "10K"` means ten kilobytes (those will be transformed into byte(s)).

- Optional values
  For example `exec_mode` can take `cluster` (`cluster_mode`) or `fork` (`fork_mode`) as possible values.

- Things to know
  - `"instances": 0` means that we will launch the maximum processes possible according to the numbers of CPUs (cluster mode)
  - array
  `args`, `node_args` and `ignore_watch` could be type of `Array` (e.g.: `"args": ["--toto=heya coco", "-d", "1"]`) or `string` (e.g.: `"args": "--to='heya coco' -d 1"`)
