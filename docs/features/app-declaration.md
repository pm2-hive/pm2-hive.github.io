---
layout: docs
title: Application Declaration
description: Manage applications via a configuration file
permalink: /docs/usage/application-declaration/
---

PM2 empowers your process management workflow, by allowing you to fine-tune the behavior, options, environment variables, logs files of each processes via a JSON configuration file.

It's particularly usefull for micro service based applications.

## Application declaration file

Here is an example of JSON configuration file, let's call it processes.json:

```js
{
  "apps" : [{
    // Application #1
    "name"        : "worker-app",
    "script"      : "worker.js",
    "args"        : ["--toto=heya coco", "-d", "1"],
    "watch"       : true,
    "node_args"   : "--harmony",
    "merge_logs"  : true,
    "cwd"         : "/this/is/a/path/to/start/script",
    "env": {
        "NODE_ENV": "production",
        "AWESOME_SERVICE_API_TOKEN": "xxx"
    }
  },{
    // Application #2
    "name"       : "api-app",
    "script"     : "api.js",
    "instances"  : 4,
    "exec_mode"  : "cluster_mode",
    "error_file" : "./examples/child-err.log", // Relative path seems to fail
    "out_file"   : "./examples/child-out.log", // Relative path seems to fail
    "pid_file"   : "./examples/child.pid"
  }]
}
```

Then you can run:

```bash
# Start all apps
$ pm2 start processes.json

# Stop
$ pm2 stop processes.json

# Restart
$ pm2 start processes.json
## Or
$ pm2 restart processes.json

# Reload
$ pm2 reload processes.json

# Graceful Reload
$ pm2 gracefulReload processes.json

# Delete from PM2
$ pm2 delete processes.json
```

## Options

The following are valid options for JSON app declarations:

```js
{
  "name"             : "node-app",
  "cwd"              : "/srv/node-app/current",
  "args"             : ["--toto=heya coco", "-d", "1"],
  "script"           : "bin/app.js",
  "node_args"        : ["--harmony", " --max-stack-size=102400000"],
  "log_date_format"  : "YYYY-MM-DD HH:mm Z",
  "error_file"       : "/var/log/node-app/node-app.stderr.log",
  "out_file"         : "log/node-app.stdout.log",
  "pid_file"         : "pids/node-geo-api.pid",
  "instances"        : 6, //or 0 => 'max'
  "min_uptime"       : "200s", // 200 seconds, defaults to 1000
  "max_restarts"     : 10, // defaults to 15
  "max_memory_restart": "1M", // 1 megabytes, e.g.: "2G", "10M", "100K", 1024 the default unit is byte.
  "cron_restart"     : "1 0 * * *",
  "watch"            : false,
  "ignore_watch"      : ["[\\/\\\\]\\./", "node_modules"],
  "merge_logs"       : true,
  "exec_interpreter" : "node",
  "exec_mode"        : "fork",
  "autorestart"      : false, // enable/disable automatic restart when an app crashes or exits
  "vizion"           : false, // enable/disable vizion features (versioning control)
  "env": {
    "NODE_ENV": "production",
    "AWESOME_SERVICE_API_TOKEN": "xxx"
  }
}
```

### List of all JSON-declaration fields avaibles

|        Field       |   Type  |                  Example                  |                                                                                          Description                                                                                         |
|:------------------:|:-------:|:-----------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|        name        |  string |                  "myAPI"                  |                                                                                name your app will have in PM2                                                                                |
|       script       |  string |                "bin/app.js"               |                                                                                       path of your app                                                                                       |
|        args        |   list  |       ["--enable-logs", "-n", "15"]       |                                                                        arguments given to your app when it is launched                                                                       |
|      node_args     |   list  |   ["--harmony", "--max-stack-size=1024"]  |                                                                          arguments given to node when it is launched                                                                         |
|         cwd        |  string |            "/var/www/app/prod"            |                                                                      the directory from which your app will be launched                                                                      |
|      exec_mode     |  string |                 "cluster"                 |                                                    "fork" mode is used by default, "cluster" mode can be configured with `instances` field                                                   |
|      instances     |  number |                     4                     | number of instances for your clustered app, `0` means as much instances as you have CPU cores. a negative value means CPU cores - value (e.g -1 on a 4 cores machine will spawn 3 instances) |
|  exec_interpreter  |  string |                   "node"                  |                       defaults to "node". can be "python", "ruby", "bash" or whatever interpreter you wish to use. "none" will execute your app as a binary executable                       |
|   log_date_format  |  string |            "YYYY-MM-DD HH:mm Z"           |                                                                   format in which timestamps will be displayed in the logs                                                                   |
|     error_file     |  string |  "/var/log/node-app/node-app.stderr.log"  |                             path to the specified error log file. PM2 generates one by default if not specified and you can find it by typing `pm2 desc <app id>`                            |
|      out_file      |  string |  "/var/log/node-app/node-app.stdout.log"  |                            path to the specified output log file. PM2 generates one by default if not specified and you can find it by typing `pm2 desc <app id>`                            |
|      pid_file      |  string |          "pids/node-geo-api.pid"          |                                path to the specified pid file. PM2 generates one by default if not specified and you can find it by typing `pm2 desc <app id>`                               |
|     merge_logs     | boolean |                   false                   |                                                      defaults to false. if true, it will merge logs from all instances of the same app into the same file                                                     |
|    cron_restart    |  string |                "1 0 * * *"                |                                      a cron pattern to restart your app. only works in "cluster" mode for now. soon to be avaible in "fork" mode as well                                     |
|        watch       | boolean |                    true                   |                 enables the watch feature, defaults to "false". if true, it will restart your app everytime a file change is detected on the folder or subfolder of your app.                |
|    ignore_watch    |   list  |     ["[\\/\\\\]\\./", "node_modules"]     |                                                            list of regex to ignore some file or folder names by the watch feature                                                            |
|    min_uptime      |  number |                     1000                    |                   min uptime of the app to be considered started (i.e. if the app crashes in this time frame, the app will only be restarted the number set in max_restarts (default 15), after that it's errored)                   |
|    max_restarts    |  number |                     10                    |                   number of consecutive unstable restarts (less than 1sec interval or custom time via min_uptime) before your app is considered errored and stop being
| max_memory_restart |  string |                   "150M"                  |                      your app will be restarted by PM2 if it exceeds the amount of memory specified. human-friendly format : it can be "10M", "100K", "2G" and so on...                      |
|         env        |  object |   {"NODE_ENV": "production", "ID": "42"}  |                                                                          env variables which will appear in your app                                                                         |
|     autorestart    | boolean |                   false                   |                                                   true by default. if false, PM2 will not restart your app if it crashes or ends peacefully                                                  |
|       vizion       | boolean |                   false                   |                                               true by default. if false, PM2 will start without vizion features (versioning control metadatas)                                               |
|     post_update    |   list  | ["npm install", "echo launching the app"] |                                        a list of commands which will be executed after you perform a Pull/Upgrade operation from Keymetrics dashboard                                        |
|        force       | boolean |                    true                   |                                          defaults to false. if true, you can start the same script several times which is usually not allowed by PM2                                          |
|     next_gen_js    | boolean |                    true                   |                             defaults to false. if true, PM2 will launch your app using embedded BabelJS features which means you can run ES6/ES7 javascript code                             |
|     restart_delay    | number |                    4000                   |                             time to wait before restarting a crashed app (in milliseconds). defaults to 0.                             |

## Schema

The completely definitions:

```JSON
{
  "script": {
    "type": "string",
    "require": true
  },
  "args": {
    "type": [
      "array",
      "string"
    ]
  },
  "node_args": {
    "type": [
      "array",
      "string"
    ]
  },
  "name": {
    "type": "string"
  },
  "max_memory_restart": {
    "type": [
      "string",
      "number"
    ],
    "regex": "^\\d+(G|M|K)?$",
    "ext_type": "sbyte",
    "desc": "it should be a NUMBER - byte, \"[NUMBER]G\"(Gigabyte), \"[NUMBER]M\"(Megabyte) or \"[NUMBER]K\"(Kilobyte)"
  },
  "instances": {
    "type": "number",
    "min": 0
  },
  "log_file": {
    "type": [
      "boolean",
      "string"
    ],
    "alias": "log"
  },
  "error_file": {
    "type": "string",
    "alias": "error"
  },
  "out_file": {
    "type": "string",
    "alias": "output"
  },
  "pid_file": {
    "type": "string",
    "alias": "pid"
  },
  "cron_restart": {
    "type": "string",
    "alias": "cron"
  },
  "cwd": {
    "type": "string"
  },
  "merge_logs": {
    "type": "boolean"
  },
  "watch": {
    "type": "boolean"
  },
  "ignore_watch": {
    "type": [
      "array",
      "string"
    ]
  },
  "watch_options": {
    "type": "object"
  },
  "env": {
    "type": ["object", "string"]
  },
  "^env_\\S*$": {
    "type": [
      "object",
      "string"
    ]
  },
  "log_date_format": {
    "type": "string"
  },
  "min_uptime": {
    "type": [
      "number",
      "string"
    ],
    "regex": "^\\d+(h|m|s)?$",
    "desc": "it should be a NUMBER - milliseconds, \"[NUMBER]h\"(hours), \"[NUMBER]m\"(minutes) or \"[NUMBER]s\"(seconds)",
    "min": 100,
    "ext_type": "stime"
  },
  "max_restarts": {
    "type": "number",
    "min": 0
  },
  "exec_mode": {
    "type": "string",
    "regex": "^(cluster|fork)(_mode)?$",
    "alias": "executeCommand",
    "desc": "it should be \"cluster\"(\"cluster_mode\") or \"fork\"(\"fork_mode\") only"
  },
  "exec_interpreter": {
    "type": "string",
    "alias": "interpreter"
  },
  "write": {
    "type": "boolean"
  },
  "force": {
    "type": "boolean"
  }
}
```

## Considerations

All command line options passed when using the JSON app declaration will be dropped i.e.

```bash
$ cat node-app-1.json

{
  "name" : "node-app-1",
  "script" : "app.js",
  "cwd" : "/srv/node-app-1/current"
}
```

You can start as many JSON app declarations as you want.  Continuing from above:

```bash
$ pm2 start node-app-2.json
$ ps aux | grep node-app
root  14735  5.8  1.1  752476  83932 ? Sl 00:08 0:00 pm2: node-app-1
root  24271  0.0  0.3  696428  24208 ? Sl 17:36 0:00 pm2: node-app-2
```

*Note* that if you execute `pm2 start node-app-2` again, it will spawn an additional instance node-app-2.

**cwd:** your JSON declaration does not need to reside with your script.  If you wish to maintain the JSON(s) in a location other than your script (say, `/etc/pm2/conf.d/node-app.json`) you will need to use the `cwd` feature (Note, this can be really helpful for capistrano style directory structures that uses symlinks). Files can be either relative to the `cwd` directory, or absolute (see example below).

All the keys can be used in a JSON configured file, but will remain almost the same on the command line e.g.:

```
exec_interpreter  -> --interpreter
exec_mode         -> --execute_command
max_restarts      -> --max_restarts
force             -> --force
```

If the `alias` exists, you can use it as a CLI option, but do not forget to turn the camelCasing to underscore split `executeCommand` to `--execute_command`.


**Notes**
- Using quotes to make an ESC, e.g.:

  ```
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

- RegExp key

  Matches the keys of configured JSON by RegExp (not by string comparison), e.g. `^env_\\S*$` will match all `env` keys like `env_production`, `env_test`, and valid them according to the schemas specifications.

- Special `ext_type`

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

  - maximum

    `"instances": 0` means that we will launch the maximum processes possible according to the numbers of CPUs (cluster mode)

  - array

    `args`, `node_args` and `ignore_watch` could be type of `Array` (e.g.: `"args": ["--toto=heya coco", "-d", "1"]`) or `string` (e.g.: `"args": "--to='heya coco' -d 1"`)


Once you declared this file, you will now just need to specify your Cloud Provider to start this file.
