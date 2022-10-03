---
layout: docs
title: PM2 API
description: Interact or Embed PM2 in your application
permalink: /docs/usage/pm2-api/
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

* noDaemonMode: If true is passed for the first argument, pm2 will not be run as a daemon and will die when the related script exits. By default, pm2 stays alive after your script exits. If pm2 is already running, your script will link to the existing daemon but will die once your process exits.

* `script` - The path of the script to run.
* `jsonConfigFile` - The path to a JSON file that can contain the same options as the `options` parameter.
* `errback(err,proc)` - An errback called when the `script` has been started. The `proc` parameter will be a [pm2 process object](https://github.com/soyuka/pm2-notify#templating).
* `options` - An object with the following options (additional descriptions of these options are [here](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#graceful-reload)):
  * `name` - An arbitrary name that can be used to interact with (e.g. restart) the process later in other commands. Defaults to the script name without its extension (eg `"testScript"` for `"testScript.js"`).
  * `script` - The path of the script to run.
  * `args` - A string or array of strings composed of arguments to pass to the script.
  * `interpreterArgs` - A string or array of strings composed of arguments to call the interpreter process with. Eg "--harmony" or ["--harmony","--debug"]. Only applies if `interpreter` is something other than "none" (its "node" by default).
  * `cwd` - The working directory to start the process with.
  * `output` - (Default: `"~/.pm2/logs/app_name-out.log"`) The path to a file to append stdout output to. Can be the same file as `error`.
  * `error` - (Default: `"~/.pm2/logs/app_name-error.err"`) The path to a file to append stderr output to. Can be the same file as `output`.
  * `logDateFormat` - The display format for log timestamps (eg "YYYY-MM-DD HH:mm Z"). The format is a [moment display format](http://momentjs.com/docs/#/displaying/).
  * `pid` - (Default: `"~/.pm2/pids/app_name-id.pid"`) The path to a file to write the pid of the started process. The file will be overwritten. Note that the file is not used in any way by pm2 and so the user is free to manipulate or remove that file at any time. The file will be deleted when the process is stopped or the daemon killed.
  * `minUptime` - The minimum uptime of the script before it's considered successfully started. 
  * `maxRestarts` - The maximum number of times in a row a script will be restarted if it exits in less than `minUptime`.
  * `maxMemoryRestart` - If sets and `script`'s memory usage goes about the configured number, pm2 restarts the `script`. Uses human-friendly suffixes: 'K' for kilobytes, 'M' for megabytes, 'G' for gigabytes', etc. Eg "150M".
  * `killTimeout` - (Default: `1600`) The number of milliseconds to wait after a `stop` or `restart` command issues a `SIGINT` signal to kill the script forcibly with a `SIGKILL` signal. 
  * `restartDelay` - (Default: `0`) Number of milliseconds to wait before restarting a script that has exited.  
  * `interpreter` - (Default: `'node'`) The interpreter for your script (eg "python", "ruby", "bash", etc). The value "none" will execute the 'script' as a binary executable.
  * `execMode` - (Default: `'fork'`) If sets to 'cluster', will enable clustering (running multiple instances of the `script`). [See here for more details](http://pm2.keymetrics.io/docs/usage/cluster-mode/).
  * `instances` - (*Default: `1`*) How many instances of `script` to create. Only relevant in `exec_mode` 'cluster'.
  * `mergeLogs` - (Default: `false`) If true, merges the log files for all instances of `script` into one stderr log and one stdout log. Only applies in 'cluster' mode. For example, if you have 4 instances of 'test.js' started via pm2, normally you would have 4 stdout log files and 4 stderr log files, but with this option set to true you would only have one stdout file and one stderr file.
  * `watch` - If set to `true`, the application will be restarted on change of the `script` file.
  * `force` (Default: `false`) By default, pm2 will only start a script if that script isn't already running (a script is a path to an application, not the name of an application already running). If `force` is set to true, pm2 will start a new instance of that script.
  * `autorestart` (Default `true`).  If `false`, pm2 will *not* attempt to restart it following successful completion or process failure.
  * `cron`
  * `executeCommand`
  * `write`
  * `sourceMapSupport`
  * `disableSourceMapSupport`

Disconnect from local PM2

#### pm2.start(process, fn)

Start a process

|    Param |   Type  |    Description |
|----------|---------|----------------|
|process    | string/object   | script path (relative) or object via [options](/docs/usage/application-declaration/#attributes-available) |
|fn    | function   | Callback|


#### pm2.stop(process, fn)

Stop a process

|    Param |   Type  |    Description |
|----------|---------|----------------|
|process    | string/number   | target process ID or Name|
|fn    | function   | Callback|

#### pm2.restart(process, [options], fn)

Restart a process

|    Param |   Type  |    Description |
|----------|---------|----------------|
|process    | string/number   | target process ID or Name|
|[options]  | object | [options](/docs/usage/application-declaration/#attributes-available) (also add updateEnv: true to force update)|
|fn    | function   | Callback|

#### pm2.reload(process, fn)

Reload a process

|    Param |   Type  |    Description |
|----------|---------|----------------|
|process    | string/number   | target process ID or Name|
|fn    | function   | Callback|


#### pm2.delete(process, fn)

Delete a process

|    Param |   Type  |    Description |
|----------|---------|----------------|
|process    | string/number   | target process ID or Name|
|fn    | function   | Callback|

#### pm2.killDaemon(fn)

Kills the pm2 daemon (same as **pm2 kill**). Note that when the daemon is killed, all its processes are also killed. Also note that you still have to explicitly disconnect from the daemon even after you kill it.

#### pm2.describe(process, fn)

Get all metadata from a target process

|    Param |   Type  |    Description |
|----------|---------|----------------|
|process    | string/number   | target process ID or Name|
|fn    | function   | Callback|

#### pm2.list(fn)

Retrieve all processes managed with PM2

### Advanced Methods

#### pm2.sendDataToProcessId(packet)

Send data to target process.

|    Param |   Type  |    Description |
|----------|---------|----------------|
|packet.id    | number   | target process ID |
|packet.type    | string   | must be **process:msg** |
|packet.topic  | boolean | must be **true** |
|packet.data   | object | object data that will be sent to target process|

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
  * **pm_id** - The pid for the **pm2** God daemon process.
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
    * **status** - "online", "stopping", "stopped", "launching", "errored", or "one-launch-status"
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
    id   : 1,

    // process:msg will be send as 'message' on target process
    type : 'process:msg',

    // Data to be sent
    data : {
      some : 'data'
    },
    id   : 0, // id of process from "pm2 list" command or from pm2.list(errback) method
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
