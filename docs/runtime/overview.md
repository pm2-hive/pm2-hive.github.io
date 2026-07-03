---
layout: docs-io
title: Overview | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/overview/"
description: "Welcome to the Overview of PM2 Runtime! PM2 Runtime is a Production Process Manager for Node.js applications with a built-in Load Balancer. It allows you…"
---

<p align="center">
    <img class="pm2-logo" src="{{ site.baseurl }}/img/runtime/runtime-black.png" alt="pm2 logo">
</p>
<p align="center">
    <b>P</b>(rocess) <b>M</b>(anager) <b>2</b><br/>
    <i>Runtime Edition</i>
    <br/>
    <a href="https://badge.fury.io/js/pm2" title="NPM Version Badge">
   <img src="https://badge.fury.io/js/pm2.svg" alt="npm version" height="18">
</a>

<a href="https://img.shields.io/badge/node-%3E%3D4-brightgreen.svg" title="Node Limitation">
   <img src="https://img.shields.io/badge/node-%3E%3D4-brightgreen.svg" alt="npm version" height="18">
</a>

<a href="https://travis-ci.org/Unitech/pm2" title="PM2 Tests">
  <img src="https://travis-ci.org/Unitech/pm2.svg?branch=master" alt="Build Status"/>
</a>

</p>

<br/>
<center>
    Welcome to the Overview of PM2 Runtime!
</center>
<br/>
PM2 Runtime is a Production Process Manager for Node.js applications with a built-in Load Balancer. It allows you to keep applications alive forever, to reload them without downtime and facilitate common Devops tasks.

Starting an application in production mode is as easy as:

```bash
$ pm2 start app.js
```

PM2 is constantly assailed by more than [1800 tests](https://travis-ci.org/Unitech/pm2/).

Works on Linux (stable) & macOS (stable) & Windows (stable). All Node.js versions are supported starting Node.js 4.X.

## One command to production

PM2 will keep your application forever alive, auto-restarting across crashes and machine restarts.

Starting your application in production mode is as easy as:

```bash
pm2 start app.js
```

And to restarts accross [machine restarts]({{ site.baseurl }}{% link docs/runtime/guide/startup-hook.md %}) just type:

```bash
pm2 startup
```

[Quick Start]({{ site.baseurl }}{% link docs/runtime/quick-start.md %})
{: .btn-stylized}
{: .btn-stylized}

## Intuitive Process Management

All your applications are run in the background and can be easily managed.

PM2 creates a list of processes, that you can access with:

```bash
pm2 ls
```

You will then see the result in your terminal:

![pm2 listing](https://raw.githubusercontent.com/unitech/pm2/master/pres/pm2-list.png)


Add and delete processes to your process list with `pm2 start` and `pm2 delete`.

Manage your processes with `pm2 start`, `pm2 stop`, `pm2 restart`, `pm2 reload`.

[Process Management]({{ site.baseurl }}{% link docs/runtime/guide/process-management.md %})
{: .btn-stylized}

## Simple Log Management

PM2 will automatically hook to your application to manage logs easily. All logs will be stored into the folder `~/.pm2/logs` and can be accessed easily, in realtime with:

```bash
pm2 logs <app_name|all>
```

When logs files become too large, log rotation is a must have, that's why there is the module pm2-logrotate that takes cares of rotating all logs automatically:

```bash
pm2 install pm2-logrotate
```

[Log Management]({{ site.baseurl }}{% link docs/runtime/guide/log-management.md %})
{: .btn-stylized}


## Cluster Mode: Load Balancing & 0s Downtime

PM2 can scale up your application accross all CPUs available by creating several child processes that share the same server port. It works great for HTTP/TCP/UDP and can increase performance by a factor of x10 on 16 core machines. It also suppress downtimes on updates, with built-in zero-downtime reloads.

Starting a Node.js application in cluster mode that will leverage all CPUs available is as easy as:

```bash
pm2 start api.js -i max
```

![scale across all cpu's available]({{ site.baseurl }}{% link img/runtime/cluster-mode.png %})

Then to update application without downtimes:

```bash
pm2 reload all
```

Cluster mode is seamlessly supported by all major Node.js frameworks.

[Load-Balancing]({{ site.baseurl }}{% link docs/runtime/guide/load-balancing.md %})
{: .btn-stylized}

## The Ecosystem: Behavioral Application Configuration

When deploying on multiple servers or when using multiple CLI arguments, an alternative to the command line becomes more conveninent for starting your apps.

The purpose of the ecosystem file is to gather all options and environment variables for all your applications.

```javascript
module.exports = {
  apps : [{
    name: "main-api",
    script: "./api.js",
    mode: "cluster",
    instances: 4,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }, {
    name: "worker",
    script: "./worker.js"
  }]
}
```

[Discover the Ecosystem File]({{ site.baseurl }}{% link docs/runtime/guide/ecosystem-file.md %})
{: .btn-stylized}

## In-terminal monitoring

You can even monitor your application directly in the terminal and check app health (CPU usage, memory used, request/min and more) with the command:

```bash
pm2 monit
```

![Local monitoring with PM2]({{ site.baseurl }}{% link img/runtime/monit.png %})

## Deployment System

PM2 includes a simple but powerful deployment system that can update your application accross several machines

```bash
pm2 deploy production
```

[Discover PM2 Deployment]({{ site.baseurl }}{% link docs/runtime/guide/easy-deploy-with-ssh.md %})
{: .btn-stylized}

## Next Steps

[Quick Start]({{ site.baseurl }}{% link docs/runtime/quick-start.md %})
{: .btn-stylized}
