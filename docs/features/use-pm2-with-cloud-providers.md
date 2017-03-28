---
layout: docs
title: PM2 in Heroku / Azure / Google App Engine
description: Use PM2 in a cloud environment (without CLI)
permalink: /docs/usage/use-pm2-with-cloud-providers/
---

# Using PM2 in Cloud Providers

You might find yourself in a situation in which you do not have access to a raw CLI to start your Node.js applications. You have 3 ways to circumvent this:
* Use the preinstall directive to install PM2 globally and start your application in the start script.
* Require PM2 as a dependency and call the module via the start script.
* The PM2 programmatic interface offers you a convenient way to manage your Node.js applications.

## Preinstall PM2 globally

The easiest way is to install pm2 globally via the preinstall scripts and start your application via pm2.

In package.json:
```json
  "scripts": {
    "preinstall": "npm install pm2 -g",
    "start": "pm2 start --attach app.js"
   },
```

* `--attach` Launches the logs of PM2 in the console after starting the app
* Use `ecosystem.json` instead of `app.js` for a cleaner configuration

## Require PM2 as a module

Depending on your cloud provider, the `preinstall` script might not be supported or pm2 might not be installed globally.
To solve this we can require pm2 from the `node_module` folder:

Install pm2 in your projet using `npm install --save pm2`

In package.json:
```json
  "scripts": {
    "start": "node ./node_modules/.bin/pm2 start --attach app.js"
  }
```

* `--attach` Launches the logs of PM2 in the console after starting the app
* Use `ecosystem.json` instead of `app.js` for a cleaner configuration


### Link to Keymetrics via environment variables

You can set KEYMETRICS_PUBLIC and KEYMETRICS_SECRET in the environment variables so that once PM2 starts, it will automatically connect to Keymetrics. Or in bash mode:

```
$ export KEYMETRICS_PUBLIC="XXXX"
$ export KEYMETRICS_SECRET="YYYY"
$ pm2 update
```

## Programmatic start

First, add PM2 as a dependency in your package.json, then you have to create a main.js file with the following content (please modify according to your needs):

### Without Keymetrics

```javascript
var pm2 = require('pm2');

var instances = process.env.WEB_CONCURRENCY || -1; // Set by Heroku or -1 to scale to max cpu core -1
var maxMemory = process.env.WEB_MEMORY || 512;    // " " "

pm2.connect(function() {
  pm2.start({
    script    : 'app.js',
    name      : 'production-app',     // ----> THESE ATTRIBUTES ARE OPTIONAL:
    exec_mode : 'cluster',            // ----> https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#schema
    instances : instances,
    max_memory_restart : maxMemory + 'M',   // Auto-restart if process takes more than XXmo
    env: {                            // If needed declare some environment variables
      "NODE_ENV": "production",
      "AWESOME_SERVICE_API_TOKEN": "xxx"
    },
  }, function(err) {
    if (err) return console.error('Error while launching applications', err.stack || err);
    console.log('PM2 and application has been succesfully started');
    
    // Display logs in standard output 
    pm2.launchBus(function(err, bus) {
      console.log('[PM2] Log streaming started');

      bus.on('log:out', function(packet) {
       console.log('[App:%s] %s', packet.process.name, packet.data);
      });
        
      bus.on('log:err', function(packet) {
        console.error('[App:%s][Err] %s', packet.process.name, packet.data);
      });
    });
      
  });
});
```

### With Keymetrics

The procedure remains the same.  However this time we will link PM2 to Keymetrics:

```javascript
var pm2 = require('pm2');

var MACHINE_NAME = 'hk1';
var PRIVATE_KEY  = 'XXXXX';   // Keymetrics Private key
var PUBLIC_KEY   = 'XXXXX';   // Keymetrics Public  key

var instances = process.env.WEB_CONCURRENCY || -1; // Set by Heroku or -1 to scale to max cpu core -1
var maxMemory = process.env.WEB_MEMORY      || 512;// " " "

pm2.connect(function() {
  pm2.start({
    script    : 'app.js',
    name      : 'production-app',     // ----> THESE ATTRIBUTES ARE OPTIONAL:
    exec_mode : 'cluster',            // ----> https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#schema
    instances : instances,
    max_memory_restart : maxMemory + 'M',   // Auto-restart if process takes more than XXmo
    env: {                            // If needed declare some environment variables
      "NODE_ENV": "production",
      "AWESOME_SERVICE_API_TOKEN": "xxx"
    },
    post_update: ["npm install"]       // Commands to execute once we do a pull from Keymetrics
  }, function() {
    pm2.interact(PRIVATE_KEY, PUBLIC_KEY, MACHINE_NAME, function() {
    
     // Display logs in standard output 
     pm2.launchBus(function(err, bus) {
       console.log('[PM2] Log streaming started');
 
       bus.on('log:out', function(packet) {
        console.log('[App:%s] %s', packet.process.name, packet.data);
       });
        
       bus.on('log:err', function(packet) {
         console.error('[App:%s][Err] %s', packet.process.name, packet.data);
       });
      });
    
    
    });
  });
});
```
