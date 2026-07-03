---
layout: post
title: PM2 Runtime - 3.2 Autumn Features
description: As Winter is coming, we wanted to keep your application warm (up) with these new PM2 Runtime features
tags: product
---

As Winter is coming, we wanted to keep your application warm (up) with these new PM2 Runtime features.

Just as a quick reminder, at PM2 we have 3 differents products:

- PM2 Runtime, the Open Source process manager (which this article is about)
- PM2 Plus, a self service monitoring system dedicated to PM2 Runtime
- PM2 Enterprise, a package containing support, feature requests and advanced monitoring system

If you want to know more check out [pm2.io] or contact us.

Anyway, here we will talk about PM2 Runtime, the open source process manager you can find on [Github](https://github.com/Unitech/pm2). So let's start this quick update.

# Exponential Backoff Restart Delay

A new restart mode has been implemented on PM2 Runtime, making your application restarts in a smarter way. Instead of restarting your application like crazy when exceptions happens (e.g. database is down), the *exponential backoff* restart will increase incrementaly the time between restarts, reducing the pressure on your DB or your external provider... Pretty easy to use:

CLI:

```bash
pm2 start app.js --exp-backoff-restart-delay=100
```

Or via ecosystem.config.js file:

```js
module.exports = [{
  script: 'app.js',
  exp_backoff_restart_delay: 100
}]
```

When an application crash unexpectedly and the option `--exp-backoff-restart-delay` is activated, you will be able to see a new application status **waiting restart**:

By running `pm2 logs` you will also see the restart delay being incremented:

```bash
PM2      | App [throw:0] will restart in 100ms
PM2      | App [throw:0] exited with code [1] via signal [SIGINT]
PM2      | App [throw:0] will restart in 150ms
PM2      | App [throw:0] exited with code [1] via signal [SIGINT]
PM2      | App [throw:0] will restart in 225ms
```

As you can see the restart delay between restarts will increase in an exponential moving average, till reaching the maximum of 15000ms between restarts.

When the application will then get back to a stable mode (uptime without restarts of more than 30 seconds), the restart delay will automatically reset to 0ms.

# Automatic Version Retrieval

Now when you start an application with PM2 Runtime, it will try to find a `package.json` around to retrieve the version of the running application. Pretty useful when you deploy your Node.js application and you bump your package.json before deploy via `npm version <major|minor|patch>`.

With PM2 Runtime 3.2 you will then be able to see this version via the various PM2 Runtime inspection commands like `pm2 show <app_id>` or `pm2 list`. Here is an example:

# pm2 env <app_id>

The `pm2 env` command allow you to display the current environment your application is running with:

Pretty usefull when you want to check NODE_ENV variable for example via:

```bash
pm2 env 1 | grep "NODE_ENV"
```

# Performance, Performance, Performance
Some *overclocking* has been done.

## From momentjs to date-fns
After reading some articles around the web like:

- [Removed moment.js to replace with date-fns - build output reduced by 40%](https://github.com/oysterprotocol/webnode/pull/116)
- [momentjs vs date-fns](https://medium.com/@k2u4yt/momentjs-vs-date-fns-6bddc7bfa21e)
- [you-dont-need/You-Dont-Need-Momentjs](https://github.com/you-dont-need/You-Dont-Need-Momentjs)

We've decided to replace the moment.js library by date-fns from the in-memory PM2 Runtime daemon. So you can expect a better logs throughput, less memory usage and less cpu usage.

## Deprecating Recurrent Git Versioning Parsing

In the old days of PM2, we have integrated the module [vizion](https://www.npmjs.com/package/vizion) that parses the .git folder of your application so you could get some versioning information like comment, tag, branch, all of this via the `pm2 show <pm_id>` command. The issue was that in the internal PM2 worker, we were calling this .git parsing every 30 seconds... Because we wanted to let you know when the remote git had pullable commits. We've removed the .git parsing in the PM2 worker, and we now call this parsing only when you've started your application. This small changes totally removed all PM2 Daemon CPU spikes and also reduced memory usage by around 30%. Breathe PM2 Runtime, Breathe!

# Tarball Packaging

This feature will be explained more in depth in a next blog post but basically this system allows to package a whole application (with `node_modules` and by parsing the package.json to retrieve the version and application that must run via pm2).

This will package the whole application_folder and generates a module_name-version.tar.gz:

```bash
pm2 package <application_folder>
```

You can then move this tarball on another servers and just type this command to install and start the application:

```bash
pm2 install mymodule-version.tar.gz
```

I will explain that feature a bit longer, we've also built a kind of small registry to deploy this packages and be able to install it from remote. There is also a module that auto-pull new version of modules.

# Extra Sugar

I will not explain all features I've developed or it might be a boring article but in resumé:

- when setting .time in ecosystem config file or via cli with --time, the application logs will be automatically prefixed by a standard date
- max-memory-restart (automatic restart when memory reached) is now using the graceful reload method, making these restarts without downtime in cluster mode
- a new internal PM2 Runtime configuration system has been added (pm2 set pm2:config value)
- better user management system via resolution of username to uid/gid. The field .user can now be used in ecosystem config file or via CLI
- deep refactor of the pm2 module system (supporting NPM and Tarball)
- watch delay now works via config files

# Update PM2 to latest

Easy:

```bash
npm install pm2@latest -g
pm2 update
```

Enjoy! And make sure you've tried [PM2 Plus](https://id.keymetrics.io/api/oauth/register)
