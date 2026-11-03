---
layout: docs
title: PM2 API
description: "Embed PM2 in your own Node.js code with the programmatic API: start, stop, restart, list processes and receive events via the message bus."
permalink: /docs/usage/pm2-api/
last_modified_at: 2026-11-03
---

## PM2 API

PM2 can be used programmatically, allowing to manage processes straight from the code.

## Quickstart

**Note**: To release connection to PM2 and make your application auto exit, make sure to disconnect from pm2 with `pm2.disconnect()`

First add PM2 as a dependency:

```bash
npm install pm2 --save
```

Then create a script called app.js and pm2-control.js containing this:

```javascript
const pm2 = require('pm2')

pm2.connect(function(err) {
  if (err) {
    console.error(err)
    process.exit(2)
  }

  pm2.start({
    script    : 'api.js',
    name      : 'api'
  }, function(err, apps) {
    if (err) {
      console.error(err)
      return pm2.disconnect()
    }

    pm2.list((err, list) => {
      console.log(err, list)

      pm2.restart('api', (err, proc) => {
        // Disconnects from PM2
        pm2.disconnect()
      })
    })
  })
})
```

- This will spawn or connect to local PM2
- Then start app.js with name **api**
- Display all applications managed with PM2
- Then restart the app with name **api**
- And disconnect from PM2

### API Methods

#### pm2.connect([no_daemon_mode], fn)

Connect to local PM2 or spawn a new PM2 instance.

|    Param |   Type  | Default |   Description|
|:----------|:-------:|:---------:|:------------------|
|[no_daemon_mode]    | boolean   | false | if true, it will run an independent PM2 that will auto exit at end|
|fn    | function   | | Callback|

* no_daemon_mode: If true is passed for the first argument, pm2 will not be run as a daemon and will die when the related script exits. By default, pm2 stays alive after your script exits. If pm2 is already running, your script will link to the existing daemon but will die once your process exits.

#### pm2.disconnect([fn])

Disconnect from local PM2 (alias `pm2.close([fn])`). Required to let your script exit; the daemon and its apps keep running.

#### pm2.start(process, [options], fn)

Start a process

|    Param |   Type  |    Description |
|----------|---------|----------------|
|process    | string/object   | script path, [ecosystem file](/docs/usage/application-declaration/) path or object via [options](/docs/usage/application-declaration/#attributes-available) |
|[options]  | object | options, when `process` is a script path |
|fn    | function   | Callback(err, apps) |

Options use the [ecosystem file](/docs/usage/application-declaration/#attributes-available) names, in snake_case (camelCase aliases such as `maxMemoryRestart` are also accepted). Most common ones (more on [signals and graceful shutdown](/docs/usage/signals-clean-restart/)):

* `name` - An arbitrary name that can be used to interact with (e.g. restart) the process later in other commands. Defaults to the script name without its extension (eg `"testScript"` for `"testScript.js"`).
* `script` - The path of the script to run.
* `args` - A string or array of strings composed of arguments to pass to the script.
* `interpreter_args` - A string or array of strings composed of arguments to call the interpreter process with. Eg "--harmony" or ["--harmony","--debug"]. Only applies if `interpreter` is something other than "none" (its "node" by default).
* `cwd` - The working directory to start the process with.
* `out_file` (alias `output`) - (Default: `"~/.pm2/logs/app_name-out.log"`) The path to a file to append stdout output to. Can be the same file as `error_file`.
* `error_file` (alias `error`) - (Default: `"~/.pm2/logs/app_name-error.log"`) The path to a file to append stderr output to. Can be the same file as `out_file`.
* `log_date_format` - The display format for log timestamps (eg "YYYY-MM-DD HH:mm Z"). The format is a [moment display format](http://momentjs.com/docs/#/displaying/).
* `pid_file` (alias `pid`) - (Default: `"~/.pm2/pids/app_name-id.pid"`) The path to a file to write the pid of the started process. The file will be overwritten. Note that the file is not used in any way by pm2 and so the user is free to manipulate or remove that file at any time. The file will be deleted when the process is stopped or the daemon killed.
* `min_uptime` - The minimum uptime of the script before it's considered successfully started.
* `max_restarts` - The maximum number of times in a row a script will be restarted if it exits in less than `min_uptime`.
* `max_memory_restart` - If sets and `script`'s memory usage goes about the configured number, pm2 restarts the `script`. Uses human-friendly suffixes: 'K' for kilobytes, 'M' for megabytes, 'G' for gigabytes', etc. Eg "150M".
* `kill_timeout` - (Default: `1600`) The number of milliseconds to wait after a `stop` or `restart` command issues a `SIGINT` signal to kill the script forcibly with a `SIGKILL` signal.
* `restart_delay` - (Default: `0`) Number of milliseconds to wait before restarting a script that has exited.
* `interpreter` - (Default: `'node'`) The interpreter for your script (eg "python", "ruby", "bash", etc). The value "none" will execute the 'script' as a binary executable.
* `exec_mode` - (Default: `'fork'`) If sets to 'cluster', will enable clustering (running multiple instances of the `script`). [See here for more details](/docs/usage/cluster-mode/).
* `instances` - (*Default: `1`*) How many instances of `script` to create. Only relevant in `exec_mode` 'cluster'.
* `merge_logs` - (Default: `false`) If true, merges the log files for all instances of `script` into one stderr log and one stdout log. Only applies in 'cluster' mode. For example, if you have 4 instances of 'test.js' started via pm2, normally you would have 4 stdout log files and 4 stderr log files, but with this option set to true you would only have one stdout file and one stderr file.
* `watch` - If set to `true`, the application will be restarted on change of the `script` file.
* `force` (Default: `false`) By default, pm2 will only start a script if that script isn't already running (a script is a path to an application, not the name of an application already running). If `force` is set to true, pm2 will start a new instance of that script.
* `autorestart` (Default `true`).  If `false`, pm2 will *not* attempt to restart it following successful completion or process failure.
* `cron_restart` (alias `cron`) - Cron pattern to restart the app.
* `env` - Environment variables passed to the app.

The callback receives an array of [process objects](#process-structure).

#### pm2.stop(process, fn)

Stop a process

|    Param |   Type  |    Description |
|----------|---------|----------------|
|process    | string/number   | target process ID, Name, 'all' or ecosystem file|
|fn    | function   | Callback|

#### pm2.restart(process, [options], fn)

Restart a process

|    Param |   Type  |    Description |
|----------|---------|----------------|
|process    | string/number   | target process ID, Name, 'all' or ecosystem file|
|[options]  | object | [options](/docs/usage/application-declaration/#attributes-available) (also add updateEnv: true to force update)|
|fn    | function   | Callback|

#### pm2.reload(process, [options], fn)

Reload a process

|    Param |   Type  |    Description |
|----------|---------|----------------|
|process    | string/number   | target process ID, Name, 'all' or ecosystem file|
|[options]  | object | `updateEnv: true` to update the environment, `env: 'production'` to pick an `env_production` block (ecosystem file only)|
|fn    | function   | Callback|


#### pm2.delete(process, fn)

Delete a process

|    Param |   Type  |    Description |
|----------|---------|----------------|
|process    | string/number   | target process ID, Name, 'all' or ecosystem file|
|fn    | function   | Callback|

#### pm2.killDaemon(fn)

Kills the pm2 daemon (same as **pm2 kill**, alias `pm2.kill(fn)`). Note that when the daemon is killed, all its processes are also killed. Also note that you still have to explicitly disconnect from the daemon even after you kill it.

#### pm2.describe(process, fn)

Get all metadata from a target process

|    Param |   Type  |    Description |
|----------|---------|----------------|
|process    | string/number   | target process ID or Name|
|fn    | function   | Callback|

#### pm2.list(fn)

Retrieve all processes managed with PM2

### Other Methods

All callbacks are `fn(err, result)`.

* `pm2.scale(name, number, fn)` - scale a cluster app to `number` instances (`'+2'` / `'-1'` strings add or remove)
* `pm2.reset(process, fn)` - reset restart counters
* `pm2.flush([process], fn)` - empty the log files of `process`, or of all apps and `pm2.log` when omitted
* `pm2.reloadLogs(fn)` - reopen all log files (after a rotation)
* `pm2.dump([force], fn)` - save the process list to `~/.pm2/dump.pm2` (**pm2 save**)
* `pm2.resurrect(fn)` - restore the processes saved by `dump`
* `pm2.startup(platform, opts, fn)` / `pm2.uninstallStartup(platform, opts, fn)` - generate / remove the boot script (see [Startup Script](/docs/usage/startup/))
* `pm2.trigger(process, action_name, [params], fn)` - trigger a [custom action](/docs/usage/process-actions/)
* `pm2.sendLineToStdin(pm_id, line, [separator], fn)` - write a line to the app stdin
* `pm2.getPID([name], fn)` - pids of all apps or of apps named `name`
* `pm2.env(pm_id, fn)` - print the environment of an app
* `pm2.getVersion(fn)` - version of the running daemon
* `pm2.ping(fn)` - ping the daemon
* `pm2.profile('cpu'|'mem', [time], fn)` - profile the PM2 daemon for `time` ms (default 10000), written to the current directory
* `pm2.serve(path, port, opts, {}, fn)` - serve a static directory (see [Expose static files](/docs/usage/expose/))
* `pm2.install(module, [opts], fn)` / `pm2.uninstall(module, fn)` - install / remove a [PM2 module](/docs/advanced/pm2-module-system/)
* `pm2.get([key], fn)`, `pm2.set(key, value, fn)`, `pm2.multiset('key1 val1 key2 val2', fn)`, `pm2.unset(key, fn)` - PM2 / module configuration (**pm2 set**)

### Custom PM2 instance

`require('pm2')` is a ready instance using `~/.pm2`. `require('pm2').custom` is the class, to drive another PM2:

```javascript
const PM2 = require('pm2').custom

const pm2 = new PM2({
  pm2_home: '/opt/pm2-home',  // PM2 directory (logs, pids, sockets)
  cwd: __dirname              // cwd used to resolve script paths
})

pm2.connect(function(err) { /* ... */ })
```

| Option | Default | Description |
|:-------|:-------:|:------------|
| `cwd` | `process.cwd()` | cwd used to resolve script paths |
| `pm2_home` | `~/.pm2` | PM2 directory |
| `independent` | `false` | unique PM2 in a random `/tmp` folder (cannot be combined with `pm2_home`) |
| `daemon_mode` | `true` (`false` when `independent`) | run the daemon detached or inside the current process |
| `public_key` / `secret_key` / `machine_name` | | [PM2.io](https://pm2.io/) bucket keys and server name |

#### pm2.destroy(fn)

Kill the daemon and delete its `pm2_home` folder. Refused on a folder containing `.pm2`: meant for `independent` / temporary instances.

### Advanced Methods

#### pm2.sendDataToProcessId([id], packet, fn)

Send data to target process. Also callable as `pm2.sendDataToProcessId(id, packet, fn)` (sets `packet.id`). The callback is required.

|    Param |   Type  |    Description |
|----------|---------|----------------|
|packet.id    | number   | target process ID |
|packet.type    | string   | must be **process:msg** |
|packet.topic  | string | any non-empty value (required) |
|packet.data   | object | object data that will be sent to target process|
|fn   | function | Callback(err, res) |

Data will be received by target process via:

```javascript
process.on('message', function(packet) {})
```

#### pm2.launchBus(fn)

This allow to receive message from process managed with PM2.

```javascript
const pm2 = require('pm2')

pm2.launchBus(function(err, pm2_bus) {
  pm2_bus.on('process:msg', function(packet) {
    console.log(packet)
  })
})
```

Events emitted on the bus:

| Event | Payload |
|:------|:--------|
| `process:msg` | `process.send({ type: 'process:msg', data })` from an app (any other `type` is emitted under that name) |
| `process:event` | process state change: `event` (`start`, `online`, `exit`, `restart overlimit`...), `manually`, `process` |
| `log:out` / `log:err` | a line written by an app to stdout / stderr |
| `log:PM2` | a line logged by the daemon itself |
| `pm2:kill` | the daemon is being killed |

Then from a process managed with PM2:

```javascript
process.send({
  type : 'process:msg',
  data : {
    success : true
  }
})
```

#### pm2.sendSignalToProcessName(signal, process, fn)

Send custom system signal to target process name

|    Param |   Type  |    Description |
|----------|---------|----------------|
|signal    | string   | system signal name  |
|process    | string   | target process Name |
|fn   | function | Callback(err, process) |

#### pm2.sendSignalToProcessId(signal, process, fn)

Send custom system signal to target process id

|    Param |   Type  |    Description |
|----------|---------|----------------|
|signal    | string   | system signal name  |
|process    | number   | target process id |
|fn   | function | Callback(err, process) |

### Process structure

When calling any of the above methods, a mutated process array is returned. This object contains:

* **processDescription** - An array of objects with information about the process. Each object contains the properties:
  * **name** - The name given in the original **start** command.
  * **pid** - The pid of the process.
  * **pm_id** - PM2's id of the app (as shown by `pm2 list`).
  * **monit** - An object containing:
    * **memory** - The number of bytes the process is using.
    * **cpu** - The percent of CPU being used by the process at the moment.
  * **pm2_env** - The list of path variables in the process's environment. These variables include:
    * **pm_cwd** - The working directory of the process.
    * **pm_out_log_path** - The stdout log file path.
    * **pm_err_log_path** - The stderr log file path.
    * **exec_interpreter** - The interpreter used.
    * **pm_uptime** - The uptime of the process.
    * **unstable_restarts** - The number of unstable restarts the process has been through.
    * **restart_time**
    * **status** - "online", "stopping", "stopped", "launching", "waiting restart", "errored", or "one-launch-status"
    * **instances** - The number of running instances.
    * **pm_exec_path** - The path of the script being run in this process.


### Examples

#### Send message to process

pm2-call.js:

```javascript
const pm2 = require('pm2')

pm2.connect(function() {
  pm2.sendDataToProcessId({
    // id of process from "pm2 list" command or from pm2.list(errback) method
    id   : 0,

    // process:msg will be send as 'message' on target process
    type : 'process:msg',

    // Data to be sent
    data : {
      some : 'data'
    },
    topic: 'some topic'
  }, function(err, res) {
  })
})

// Listen to messages from application
pm2.launchBus(function(err, pm2_bus) {
  pm2_bus.on('process:msg', function(packet) {
    console.log(packet)
  })
})
```

pm2-app.js:

```javascript
process.on('message', function(packet) {
  process.send({
    type : 'process:msg',
    data : {
     success : true
    }
 });
});
```
