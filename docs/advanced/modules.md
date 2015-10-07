---
layout: docs
title: Module System
description: Standalone Node.JS applications runned by PM2
permalink: /docs/advanced/pm2-module-system/
---

![Module system](https://github.com/unitech/pm2/raw/master/pres/pm2-module.png)

## What is a PM2 module?

A PM2 module is basically a NPM module. But this time it's not a library, but a standalone process managed by PM2.
Internally it embeds the NPM install procedure. So a PM2 module is published on NPM and installed from NPM.

## What can be developed as a module?

Your creativity is the limit. A PM2 module can do pretty anything. From a log rotation module, a load balancer, a private NPM repository, a Node.js based wikipedia, an antivirus for server... Your creativity is the limit! (*internal pub/sub mecanism in a ROS style = offer micro services that can be subscribed to (setup procedure = conf system!)*)

## Super charged modules, with Keymetrics

The real power of the module system comes once PM2 is linked to Keymetrics.
When using [the keymetrics library](https://github.com/keymetrics/pmx) you can build a dedicated interface displayed on Keymetrics as well as [expose metrics](https://github.com/keymetrics/pmx#expose-metrics-measure-anything), [remotely trigger actions](https://github.com/keymetrics/pmx#expose-functions-trigger-functions-remotely), [alert about issues](https://github.com/keymetrics/pmx#report-alerts-errors--uncaught-exceptions), [notify about events](https://github.com/keymetrics/pmx#emit-events) or allow to configure the module remotely!

## Managing a module

To manage a module, commands are straightforward:

```bash
# INSTALL/UPDATE
$ pm2 install <module-name>

# INSTALL VIA GIT (username/repository)
$ pm2 install pm2-hive/pm2-docker

# UNINSTALL
$ pm2 uninstall <module-name>

# PUBLISH NEW MODULE RELEASE ON NPM
$ pm2 publish
```

## Development mode

In order to develop a module easily, PM2 offers a simple development workflow.

To start a module in development mode with auto-restart on file change just do:

```bash
$ cd my-module/
$ pm2 install .
```

To check the module logs:

```bash
$ pm2 logs <module-name>
```

# Writing a module - the basics

## Package.json: Declare options, widget aspect and module behavior

A package.json must be present with some extra fields like `config` for configuration variables and `apps` to declare the [behavior of this module](https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#options-1):

```javascript
{
  "name": "pm2-logrotate",  // Used as the module name
  "version": "1.0.0",       // Used as the module version
  "description": "my desc", // Used as the module comment
  "dependencies": {
    "pmx": "latest"         // Common dependencies to communiate with Keymetrics
  },
  "config": {              // Default configuration value
                           // These values can be modified via Keymetrics or PM2 configuration system

     "days_interval" : 7,  // -> this value is returned once you call pmx.initModule()
     "max_size" : 5242880
  },
  "apps" : [{              // Application configuration
    "merge_logs"         : true,
    "max_memory_restart" : "200M",
    "script"             : "index.js"
  }],
  "author": "Keymetrics Inc.", // Optional
  "license": "AGPL-3.0"        // Optional
}
```

## Module entry point

This is the index.js file (declared in the package.json in the apps section):
The pmx.initModule takes a range of options to configure the module display in Keymetrics or to override the PID monitored by PM2:

```javascript
var pmx     = require('pmx');

// Initialize the module
var conf    = pmx.initModule({

    // Override PID to be monitored (for CPU and Memory blocks)
    pid              : pmx.resolvePidPaths(['/var/run/redis.pid', '/var/run/redis/redis-server.pid']),

    widget : {

      // Module display type. Currently only 'generic' is available
      type : 'generic',

      // Logo to be displayed on the top left block
      // Must be https
      logo : 'https://image.url',

      // 0 = main element
      // 1 = secondary
      // 2 = main border
      // 3 = secondary border
      // 4 = text color (not implemented yet)
      theme : ['#9F1414', '#591313', 'white', 'white'],

      // Toggle horizontal blocks above main widget
      el : {
        probes : false,
        actions: false
      },

      block : {
        // Display remote action block
        actions : true,

        // Display CPU / Memory
        cpu     : true,
        mem     : true,

        // Issues count display
        issues  : true,

        // Display meta block
        meta    : true,

        // Display metadata about the probe (restart nb, interpreter...)
        meta_block : true,

        // Name of custom metrics to be displayed as a "major metrics"
        main_probes : ['Processes']
      },
    },

    // Status (in the future, not implemented yet)
    status_check : ['latency', 'event loop', 'query/s']
    //= Status Green / Yellow / Red (maybe for probes?)

});

// Here we can see the default configuration values declared in the package.json
console.log(conf);
```

## Configuring a module

In the package.json you can declare default options accessible in the Module under the attribute `config`. These values can be overriden by PM2 or Keymetrics.

### Default values

Add default configuration values in package.json under the "config" attribute:

```json
{
 [...]
 "config": {             // Default configuration value
    "days_interval" : 7,  // -> returned from var ret = pmx.initModule()
    "max_size" : 5242880  // -> e.g. ret.max_size
 }
 [...]
}
```

These values are then accessible via the data returned by pmx.initModule().

Example:

```javascript
var conf = pmx.initModule({[...]});

// Now we can read these values
console.log(conf.days_interval);
```

## Override configuration values

### With PM2

With PM2 this is straightforward. Just call this command:

```bash
$ pm2 set module_name:option_name <new_value>
```

Example:

```bash
$ pm2 set server-monitoring:days_interval 2
```

- **NOTE1**: These variables are written in `~/.pm2/module_conf.json`, you can also edit this file to change the values
- **NOTE2**: You can display configuration variable via `pm2 conf [module-name]`
- **NOTE3**: When you set a new value, the target module is restarted
- **NOTE4**: You have to typecast yourself values, they are always strings!

### With Keymetrics

In the main Keymetrics Dashboard, the module will have a button called "Configure". Once you click on it you will be able to access / modify all configuration variables exposed on the package.json!

# PMX Helpers methods for Modules

## pmx.initModule(JSON)

This is the main method, it transforms the current application into a PM2 Module. It is preferred that this method is called before any other required modules.

## pmx.configureModule(JSON)

Add/Override a variable to module option (.axm_options)

```javascript
pmx.configureModule({
  new_axm_option : true
});
```

## pmx.getConf()

Get configuration variables for modules (same object than what is returned by pmx.initModule())

## pmx.resolvePidPaths([])

Pass an array of possible pid file path location, open it and return the value.
