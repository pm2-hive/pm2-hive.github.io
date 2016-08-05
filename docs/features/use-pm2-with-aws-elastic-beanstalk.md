---
layout: docs
title: PM2 in Heroku / Azure / Google App Engine
description: Use PM2 in a cloud environment (without CLI)
permalink: /docs/usage/use-pm2-with-aws-elastic-beanstalk/
---

# Using PM2/Keymetrics in AWS Elastic Beanstalk

This page will guide you step by step through the pm2/Keymetrics integration in a Beanstalk environment.

The first way to integrate pm2/Keymetrics with Beanstalk is programatically.
We will need to require pm2 as a dependency and add a new main.js file to start it up.

## AWS environment setup

The config files for extensions goes in the `.ebextensions` folder, for example  `.ebextensions/yourapp.config`.

For Node Js applications, the file will look like this:
```yml
  - namespace: aws:elasticbeanstalk:container:nodejs
    option_name: ProxyServer
    value: nginx
  - namespace: aws:elasticbeanstalk:container:nodejs:staticfiles
    option_name: /public
    value: /public
  - option_name: KM_PUBLIC
    value: XXXXX
  - option_name: KM_SECRET
    value: YYYYY
```

Edit to insert your Keymetrics Public/Private Keys. Those values can also be changed in the Beanstalk dashboard.

Beanstalk guide for more details [here](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.container.html)

All node options [here](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-specific.html#command-options-nodejs)



## Application setup

First add PM2 as a dependency in your package.json, then just create a main.js file with this content (change according to your needs):

```javascript
var pm2 = require('pm2');

var MACHINE_NAME = process.env.HOSTNAME;
var PRIVATE_KEY  = process.env.KM_SECRET;   // Keymetrics Private key
var PUBLIC_KEY   = process.env.KM_PUBLIC;   // Keymetrics Public  key

var instances = -1; // scale to max cpu core -1
var maxMemory = 512;

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

You are all set!
