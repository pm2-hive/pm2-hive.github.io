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
|[no_daemon_mode]    | boolean   | false | if true, it will run an independant PM2 that will auto exit at end|
|fn    | function   | | Callback|

* noDaemonMode: If true is passed for the first argument, pm2 will not be run as a daemon and will die when the related script exits. By default, pm2 stays alive after your script exits. If pm2 is already running, your script will link to the existing daemon but will die once your process exits.

#### pm2.disconnect()

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
    // id of procces from "pm2 list" command or from pm2.list(errback) method
    id   : 1,

    // process:msg will be send as 'message' on target process
    type : 'process:msg',

    // Data to be sent
    data : {
      some : 'data'
    },

    topic: true
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
