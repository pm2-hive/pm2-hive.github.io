---
layout: docs
title: PM2 API
description: Interact or Embed PM2 in your application
permalink: /docs/usage/pm2-api/
---

PM2 can be used programmatically, meaning that you can embed a process manager directly in your code, spawn processes, keep them alive even if the main script is exited.

It's also usefull when you deploy a Node.js application [in any kind of Cloud Provider / PaaS](/docs/usage/use-pm2-with-cloud-providers/)

Check out [this article](http://keymetrics.io/2014/07/02/manage-processes-programmatically-with-pm2/) for more informations.

## Simple example

This example shows you how to start app.js with some configuration attributes. What is passed to start is the same than what you can declare in a [JS/JSON configuration](/docs/usage/application-declaration/) file:

**NB**: Do not forget to call `pm2.disconnect()` everytime you exit your script!

```bash
$ npm install pm2 --save
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
    exec_mode : 'cluster',        // Allow your app to be clustered
    instances : 4,                // Optional: Scale your app by 4
    max_memory_restart : '100M'   // Optional: Restart your app if it reaches 100Mo
  }, function(err, apps) {
    pm2.disconnect();
  });
});
```

## No daemon

Make sure you killed pm2 before via `pm2 kill`, then to start pm2 programmatically in no deamon mode, you need to pass the `true` as the first argument of `pm2.connect`:

```javascript
var pm2 = require('pm2');

pm2.connect(true, function(err) {
  // Do stuff
});
```

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
    id   : proc1.pm2_env.pm_id
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

## Programmatic API

<table class="table table-striped table-bordered">
    <tr>
        <th>Method name</th>
        <th>API</th>
    </tr>
     <tr>
      <td><b>Connect/Launch</b></td>
      <td>pm2.connect(fn(err){})</td>
    </tr>
     <tr>
      <td><b>Disconnect</b></td>
      <td>pm2.disconnect(fn(err, proc){})</td>
    </tr>
</table>

**Consideration with .connect**: the .connect method connect to the local PM2, but if PM2 is not up, it will launch it and will put in in background as you launched it via CLI.

<table class="table table-striped table-bordered">
    <tr>
        <th>Method name</th>
        <th>API</th>
    </tr>
    <tr>
      <td><b>Start</b></td>
      <td>pm2.start(script_path|json_object|json_path, options, fn(err, proc){})</td>
    </tr>
    <tr>
      <td>Options </td>
      <td>
      nodeArgs(arr), scriptArgs(arr), name(str), instances(int), error(str), output(str), pid(str), cron(str), mergeLogs(bool), watch(bool), runAsUser(int), runAsGroup(int), executeCommand(bool), interpreter(str), write(bool)</td>
    </tr>
    <tr>
      <td><b>Restart</b></td>
      <td>pm2.restart(proc_name|proc_id|all, fn(err, proc){})</td>
       </tr>
     <tr>
      <td><b>Stop</b></td>
      <td>pm2.stop(proc_name|proc_id|all, fn(err, proc){})</td>
    </tr>
    <tr>
      <td><b>Delete</b></td>
      <td>pm2.delete(proc_name|proc_id|all, fn(err, proc){})</td>
    </tr>


    <tr>
      <td><b>Reload</b></td>
      <td>pm2.reload(proc_name|all, fn(err, proc){})</td>
    </tr>
      <tr>
      <td><b>Graceful Reload</b></td>
      <td>pm2.gracefulReload(proc_name|all, fn(err, proc){})</td>
    </tr>
</table>

<table class="table table-striped table-bordered">
    <tr>
        <th>Method name</th>
        <th>API</th>
    </tr>
    <tr>
      <td><b>List</b></td>
      <td>pm2.list(fn(err, list){})</td>
    </tr>
    <tr>
      <td><b>Describe process</b></td>
      <td>pm2.describe(proc_name|proc_id, fn(err, list){})</td>
    </tr>
    <tr>
      <td><b>Dump (save)</b></td>
      <td>pm2.dump(fn(err, ret){})</td>
    </tr>
    <tr>
      <td><b>Flush logs</b></td>
      <td>pm2.flush(fn(err, ret){})</td>
    </tr>
     <tr>
      <td><b>Reload logs</b></td>
      <td>pm2.reloadLogs(fn(err, ret){})</td>
    </tr>
         <tr>
      <td><b>Send signal</b></td>
      <td>pm2.sendSignalToProcessName(signal,proc,fn(err, ret){})</td>
    </tr>
     <tr>
      <td><b>Generate start script</b></td>
      <td>pm2.startup(platform, fn(err, ret){})</td>
    </tr>
     <tr>
      <td><b>Kill PM2</b></td>
      <td>pm2.killDaemon(fn(err, ret){})</td>
    </tr>
</table>
