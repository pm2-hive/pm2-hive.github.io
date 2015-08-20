---
layout: docs
title: PM2 in Heroku / Azure / Google App Engine
description: Use PM2 in a cloud environment (without CLI)
permalink: /docs/usage/use-pm2-with-cloud-providers/
---

# Using PM2 in Cloud Providers

Some time you do no have access to a raw CLI to start your Node.js applications.
By using the PM2 programmatic interface, you can manage your Node.js app very easily.

## Heroku / Google App Engine / Azure

First add PM2 as a dependency in you package.json, then just create a main.js file with this content (please modify according to your needs):

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
    max_memory_restart : maxMemory + 'M',   // Auto restart if process taking more than XXmo
    env: {                            // If needed declare some environment variables
      "NODE_ENV": "production",
      "AWESOME_SERVICE_API_TOKEN": "xxx"
    },
  }, function(err) {
    if (err) return console.error('Error while launching applications', err.stack || err);
    console.log('PM2 and application has been succesfully started');
  });
});
```

### With Keymetrics

The procedure is the same, but this time we will link PM2 to Keymetrics:

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
    max_memory_restart : maxMemory + 'M',   // Auto restart if process taking more than XXmo
    env: {                            // If needed declare some environment variables
      "NODE_ENV": "production",
      "AWESOME_SERVICE_API_TOKEN": "xxx"
    },
    post_update: ["npm install"]       // Commands to execute once we do a pull from Keymetrics
  }, function() {
    pm2.interact(PRIVATE_KEY, PUBLIC_KEY, MACHINE_NAME, function() {});
  });
});
```
