---
layout: none
title: Programmatic | Reference | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/reference/pm2-programmatic/"
description: "pm2 can also be used programmatically, meaning that you can embed a process manager directly in your code, spawn processes, keep them alive even if the…"
sitemap: false
redirect_to: "/docs/usage/pm2-api/"
---

# PM2 API

pm2 can also be used programmatically, meaning that you can embed a process manager directly in your code, spawn processes, keep them alive even if the main script is exited.

## Simple example

This example shows you how to start app.js with some configuration attributes. Elements passed to start are the same than those you can declare in an ecosystem file:


```bash
npm install pm2 --save
```

```javascript
const pm2 = require('pm2')

pm2.connect(function(err) {
  if (err) {
    console.error(err)
    process.exit(2)
  }

  pm2.start({
    script: 'app.js',
  }, (err, apps) => {
    pm2.disconnect()
    if (err) { throw err }
  })
})
```

 If your script does not exit by itself, make sure you call `pm2.disconnect()`.
{: .tip}

## Programmatic API

`pm2.connect(errback)` or `pm2.connect(noDaemonMode, errback)`
* `noDaemonMode` - (Default: false) If true is passed for the first argument, pm2 will not be run as a daemon and will die when the related script exits. If pm2 is already running, your script will link to the existing daemon but will die once your process exits.
* `errback(error)` - Called when finished connecting to or launching the pm2 daemon process.

Either connects to a running pm2 daemon ("God") or launches and daemonizes one. Once launched, the pm2 process will keep running after the script exits.


`pm2.disconnect()`

Disconnects from the pm2 daemon.


`pm2.killDaemon(errback)`

Kills the pm2 daemon (same as `pm2 kill`). Note that when the daemon is killed, all its processes are also killed. Also note that you still have to explicitly disconnect from the daemon even after you kill it.


`pm2.start(options, errback)`
`pm2.start(jsonConfigFile, errback)`
`pm2.start(script, errback)`
`pm2.start(script, options, errback)`
`pm2.start(script, jsonConfigFile, errback)`

* `script` - The path of the script to run.
* `jsonConfigFile` - The path to a JSON file that can contain the same options as the `options` parameter.
* `errback(err,proc)` - An errback called when the `script` has been started. The `proc` parameter will be a [pm2 process object](https://github.com/soyuka/pm2-notify#templating).
* `options` - An object with the following options:


`pm2.stop(process, errback)`
`pm2.restart(process, errback)`
`pm2.delete(process, errback)`
`pm2.reload(process, errback)`

* `process` - Can either be the `name` as given in the `pm2.start` `options`, a process id, or the string "all" to indicate that all scripts should be restarted.
* `errback(err, proc)`


`pm2.list(errback)`

* `errback(err, processDescriptionList)` - The `processDescriptionList` parameter will contain a list of `processDescription` objects as defined under `pm2.describe`.


`pm2.describe(process,errback)`

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


`pm2.dump(errback)`

* `errback(err, result)`


`pm2.startup(platform, errback)`

* `errback(err, result)`


`pm2.flush(process, errback)`

* `errback(err, result)`


`pm2.reloadLogs(errback)` - *Rotates* the log files. The new log file will have a higher number in it (the default format being `${process.name}-${out|err}-${number}.log`).

* `errback(err, result)`


`pm2.launchBus(errback)` - Opens a message bus.

* `errback(err, bus)` - The `bus` will be an [Axon Sub Emitter](https://github.com/tj/axon#pubemitter--subemitter) object used to listen to and send events.


`pm2.sendSignalToProcessName(signal, process, errback)`

* `errback(err, result)`

## Send message to processes

```javascript
// pm2-call.js:
pm2.connect(() => {
  pm2.sendDataToProcessId({
    type: 'process:msg',
    data: {
      some: 'data',
      hello: true
    },
    id: 0,
    topic: 'some topic'
  }, (err, res) => {
  })
})

pm2.launchBus((err, bus) => {
  bus.on('process:msg', (packet) => {
    packet.data.success.should.eql(true)
    packet.process.pm_id.should.eql(proc1.pm2_env.pm_id)
    done()
  })
})
```

```javascript
// pm2-app.js:
process.on('message', (packet) => {
  process.send({
    type: 'process:msg',
    data: {
     success: true
    }
 })
})
```
