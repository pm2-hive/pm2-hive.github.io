---
layout: docs
title: Module System
description: Standalone Node.JS applications runned by PM2
permalink: /docs/advanced/pm2-module-system/
---

# Quick Start

<br/>

![Module system](https://github.com/unitech/pm2/raw/master/pres/pm2-module.png)

## What is a module?

A PM2 module is a standalone software installed and managed by PM2. These softwares are pulled from the NPM repository and are published like a common Javascript library on NPM.

[Anyone can create a module doing anything](http://pm2.keymetrics.io/docs/advanced/pm2-module-system/#creating-a-module), your creativity is the limit. A module can be a log rotation module, a load balancer, a Node.js based wikipedia, a DNS server, a SMTP server, an antivirus... Your creativity is the limit!

## Module interface with Keymetrics

With [Keymetrics](https://keymetrics.io/) you can [create a customized interface](http://pm2.keymetrics.io/docs/advanced/pm2-module-system/#module-entry-point) with [metrics monitoring](http://docs.keymetrics.io/docs/pages/custom-metrics/) and [remote actions](http://docs.keymetrics.io/docs/pages/custom-actions/).

This will give you this kind of result:

<a href="/images/mongodb-rack.png" title="Keymetrics interface explanation"><img src="/images/mongodb-rack.png"/></a>
<center><a href="https://github.com/pm2-hive/pm2-mongodb" title="pm2-mongodb">pm2-mongodb module</a></center>

or

<a href="/images/server-monit.png" title="Keymetrics interface explanation"><img src="/images/server-monit.png"/></a>
<center><a href="https://github.com/pm2-hive/pm2-server-monit" title="pm2-server-monit">pm2-server-monit-module</a></center>

## Managing a module

To manage a module, commands are straightforward:

```bash
# Install / Update module
$ pm2 install <module-name>

# Install via Git (username/repository)
$ pm2 install pm2-hive/pm2-docker

# Generate a module boilerplate
$ pm2 module:generate <module-name>

# Uninstall module
$ pm2 uninstall <module-name>

# Publish new module (Inc Semver + Git push + NPM publish)
$ pm2 publish
```

## Creating a module

To generate a sample module:

```bash
$ pm2 module:generate <module-name>
```

Now let's run this module with PM2:

```bash
$ cd <module-name>
$ pm2 install .
```

You can now edit the source and when you change something, pm2 will automatically restart the module ([watch option activated](http://pm2.keymetrics.io/docs/usage/watch-and-restart/)).

To display the logs:

```bash
$ pm2 logs <module-name>
```

To remove the module:

```
$ pm2 uninstall <module-name>
```

# Advanced

## package.json for options

A **package.json must exists** in the module root folder. Then some attributes like `config` for [configuration variables](http://pm2.keymetrics.io/docs/advanced/pm2-module-system/#module-configuration) and `apps` for [module behavior options](http://pm2.keymetrics.io/docs/usage/application-declaration/) can be added.

```javascript
{
  "name": "pm2-logrotate",  // Used as the module name
  "version": "1.0.0",       // Used as the module version
  "description": "my desc", // Used as the module comment
  "dependencies": {
    "pmx": "latest"         // Add the dependency you need here
  },
  "config": {              // Default configuration value, overridable value via pm2 set <name>:<attr> <val>
     "days_interval" : 7,  // This value is returned once you call pmx.initModule()
     "max_size" : 5242880
  },
  "apps" : [{              // Module behavior opts, Application configuration
    "merge_logs"         : true,
    "max_memory_restart" : "200M",
    "script"             : "index.js"
  }],
  "author": "Sarkozy",
  "license": "MIT"
}
```

## Module entry point

In your main module entry point, call the `pmx.initModule(opts, fn(){});` to initialize your module:

```javascript
var pmx     = require('pmx');

var conf    = pmx.initModule({

    // Override PID to be monitored
    pid              : pmx.resolvePidPaths(['/var/run/redis.pid']),

    widget : {
      /**
       * Keymetrics interface customization
       */
      type : 'generic',

      // Logo to be displayed on the top left block (must be https)
      logo  : 'https://image.url',
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
}, function(err, conf) {
  /**
   * Main module entry
   */
  console.log(conf);
  // Do whatever you need
  require('./business_logic.js')(conf);
});
```

## Module configuration

In the package.json you can declare default options accessible in the Module under the attribute `config`. These values can be overridden by PM2 or Keymetrics.

### Default values

Add default configuration values in package.json under the "config" attribute:

```javascript
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
var conf = pmx.initModule({[...]}, function(err, conf) {
  // Now we can read these values
  console.log(conf.days_interval);
});
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

## Publishing a module

To update/publish a module, it's straightforward. The `pm2 publish` command will increment the minor version of the module, will `git add . ; git commit -m "VERSION"; git push origin master` then it will `npm publish`.

```bash
$ cd my-module
$ pm2 publish
```

## You Built a module?

If you built an interesting module, please send us an email, we will promote your module and add it to Keymetrics: [https://keymetrics.io/contact/](https://keymetrics.io/contact/)
