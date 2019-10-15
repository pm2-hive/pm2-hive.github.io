---
layout: docs
title: PM2 API
description: Interact or Embed PM2 in your application
permalink: /docs/usage/pm2-api/
---

PM2 can be used programmatically, meaning that you can embed a process manager directly in your code, spawn processes, keep them alive even if the main script is exited.

It's also useful when you deploy a Node.js application [in any kind of Cloud Provider / PaaS](/docs/usage/use-pm2-with-cloud-providers/).

## Simple example

This example shows you how to start app.js with some configuration attributes. Elements passed to start are the same than those you can declare in a [JS/JSON configuration](/docs/usage/application-declaration/) file:

**NB**: If your script does not exit by itself, make sure you called `pm2.disconnect()` at the end.

```bash
npm install pm2 --save
```

```javascript
var pm2 = require('pm2');

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  
  pm2.start({
    script    : 'app.js',         // Script to be run
    exec_mode : 'cluster',        // Allows your app to be clustered
    instances : 4,                // Optional: Scales your app by 4
    max_memory_restart : '100M'   // Optional: Restarts your app if it reaches 100Mo
  }, function(err, apps) {
    pm2.disconnect();   // Disconnects from PM2
    if (err) throw err
  });
});
```

## Programmatic API

`npm install pm2 --save`

**`pm2.connect(errback)`** - Either connects to a running pm2 daemon ("God") or launches and daemonizes one. Once launched, the pm2 process will keep running after the script exits.  
**`pm2.connect(noDaemonMode, errback)`**

* `noDaemonMode` - (Default: false) If true is passed for the first argument, pm2 will not be run as a daemon and will die when the related script exits. By default, pm2 stays alive after your script exits. If pm2 is already running, your script will link to the existing daemon but will die once your process exits.
* `errback(error)` - Called when finished connecting to or launching the pm2 daemon process.

**`pm2.start(options, errback)`** - Starts a script that will be managed by pm2.  
**`pm2.start(jsonConfigFile, errback)`**  
**`pm2.start(script, errback)`**  
**`pm2.start(script, options, errback)`**  
**`pm2.start(script, jsonConfigFile, errback)`**  

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
  * `killTimeout` - (Default: `1600`) The number of milliseconds to wait after a `stop` or `restart` command issues a `SIGINT` signal to kill the script forceably with a `SIGKILL` signal. 
  * `restartDelay` - (Default: `0`) Number of millseconds to wait before restarting a script that has exited.  
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

**`pm2.disconnect()`** - Disconnects from the pm2 daemon.

**`pm2.stop(process, errback)`** - Stops a process but leaves the process meta-data in pm2's list. *[See here for how pm2 stops a process](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/)*  
**`pm2.restart(process, errback)`** - Stops and restarts the process.  
**`pm2.delete(process, errback)`** - Stops the process and removes it from pm2's list. The process will no longer be accessible by its `name`.  
**`pm2.reload(process, errback)`** - Zero-downtime rolling restart. At least one process will be kept running at all times as each instance is restarted individually. *Only works for scripts started in cluster mode. [See here for more details](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#reload-without-downtime).*  

* `process` - Can either be the `name` as given in the `pm2.start` `options`, a process id, or the string "all" to indicate that all scripts should be restarted.
* `options` - (Optional) An object with the following options:
  * `updateEnv` - (Default: false) If true is passed in, pm2 will reload it's environment from process.env before reloading your process.
* `errback(err, proc)`

**`pm2.killDaemon(errback)`** - Kills the pm2 daemon (same as `pm2 kill`). Note that when the daemon is killed, all its processes are also killed. Also note that you still have to explicitly disconnect from the daemon even after you kill it.

**`pm2.describe(process,errback)`** - Returns various information about a process: eg what stdout/stderr and pid files are used.

* `errback(err, processDescription)`
* `processDescription` - An object with information about the process. Contains the properties:
  * `name` - The name given in the original `start` command. 
  * `pid` - The pid of the process.
  * `pm_id` - The pid for the `pm2` God daemon process.
  * `monit` - An object containing:
    * `memory` - The number of bytes the process is using.
    * `cpu` - The percent of CPU being used by the process at the moment.
  * `pm2_env` - The list of path variables in the process's environment. These variables include:
    * `pm_cwd` - The working directory of the process.
    * `pm_out_log_path` - The stdout log file path.
    * `pm_err_log_path` - The stderr log file path.
    * `exec_interpreter` - The interpreter used.
    * `pm_uptime` - The uptime of the process.
    * `unstable_restarts` - The number of unstable restarts the process has been through.
    * `restart_time`
    * `status` - "online", "stopping", "stopped", "launching", "errored", or "one-launch-status"
    * `instances` - The number of running instances.
    * `pm_exec_path` - The path of the script being run in this process.

**`pm2.list(errback)`** - Gets the list of running processes being managed by pm2.

* `errback(err, processDescriptionList)` - The `processDescriptionList` parameter will contain a list of `processDescription` objects as defined under `pm2.describe`. 

**`pm2.dump(errback)`** - Writes the process list to a json file at the path in the DUMP_FILE_PATH environment variable ("~/.pm2/dump.pm2" by default).

* `errback(err, result)`

**`pm2.flush(process,errback)`** - Flushes the logs.

* `errback(err, result)`

**`pm2.dump(errback)`**

* `errback(err, result)`

**`pm2.reloadLogs(errback)`** - *Rotates* the log files. The new log file will have a higher number in it (the default format being `${process.name}-${out|err}-${number}.log`).

* `errback(err, result)`

**`pm2.launchBus(errback)`** - Opens a message bus.

* `errback(err, bus)` - The `bus` will be an [Axon Sub Emitter](https://github.com/tj/axon#pubemitter--subemitter) object used to listen to and send events.

**`pm2.sendSignalToProcessName(signal, process, errback)`**

* `errback(err, result)`

**`pm2.startup(platform, errback)`** - Registers the script as a process that will start on machine boot. Platform can currently be: "ubuntu", "centos", "redhat", "gentoo", "systemd", "darwin", or "amazon". The current process list will be dumped and saved for resurrection on reboot.

* `errback(err, result)`

## Send message to process

Available in PM2 0.15.11>

pm2-call.js:

```javascript
pm2.connect(function() {
  pm2.sendDataToProcessId({
    type : 'process:msg',
    data : {
      some : 'data',
      hello : true
    },
    id   : 0, // id of procces from "pm2 list" command or from pm2.list(errback) method
    topic: 'some topic'
  }, function(err, res) {
  });
});

pm2.launchBus(function(err, bus) {
  pm2_bus.on('process:msg', function(packet) {
    packet.data.success.should.eql(true);
    packet.process.pm_id.should.eql(proc1.pm2_env.pm_id);
    done();
  });
});
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
