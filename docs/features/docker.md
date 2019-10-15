---
layout: docs
title: Docker Integration
description: Seamless PM2 integration within Docker
permalink: /docs/usage/docker-pm2-nodejs/
---

<center style="margin-top: 28px; margin-bottom: 23px">
<img src="/images/docker_logo.png" title="Docker PM2 Node.js"/>
</center>

## Docker Integration

Using Containers? We got your back. Start today using **pm2-runtime**, a perfect companion to get the most out of Node.js in production environment.

The goal of pm2-runtime is to wrap your applications into a proper Node.js production environment. It solves major issues when running Node.js applications inside a container like:

- Second Process Fallback for High Application Reliability
- Process Flow Control
- Automatic Application Monitoring to keep it always sane and high performing
- Automatic Source Map Discovery and Resolving Support 

Further than that, using PM2 as a layer between the container and the application brings PM2 powerful features like [application declaration file](/docs/usage/application-declaration/), [customizable log system](/docs/usage/log-management/) and other great features to manage your Node.js application in production environment.

## Use PM2 inside Containers

In your Dockerfile add this line to install PM2:

```
RUN npm install pm2 -g
```

Then replace the `node` binary with `pm2-runtime` 

```
CMD ["node", "app.js"]
```

to:

```
CMD ["pm2-runtime", "app.js"]
```

**You are now all set!** Your Node.js application is now wrapped into a proper Node.js production environment.

### Starting a configuration file

Instead of running your raw Node.js application with PM2, you can declare it into a configuration file (or process file) and set some configuration variables, like enabling the cluster mode.

Let's create a ecosystem.config.js file with this content:

```javascript
module.exports = [{
  script: 'app.js',
  name: 'app',
  exec_mode: 'cluster',
  instances: 2
}, {
  script: 'worker.js',
  name: 'worker'
}]
```

All options available are [listed here](/docs/usage/application-declaration/#attributes-available).

You can then replace the **CMD** directive by this:

```
CMD ["pm2-runtime", "process.yml"]
```

To split each processes in his own Docker, you can use the --only [app-name] option:

```
CMD ["pm2-runtime", "process.yml", "--only", "APP"]
```

### Logging Format option

If you want to change the log output format you can select one of this options:

- **--json**: will output logs in JSON format (logstash)
- **--format**: will output logs in = style format
- **--raw**: will output logs as is

To use one of this flag, you just need to pass them to pm2-runtime:

```
CMD ["pm2-runtime", "--json", "process.yml"]
```

### Enabling Graceful Shutdown

When the Container receives a shutdown signal, PM2 forwards this signal to your application allowing to close all the database connections, wait that all queries have been processed or that any other final processing has been completed before a successfull graceful shutdown.

Catching a shutdown signal is straightforward. You need to add a listener in your Node.js applications and execute anything needed before stopping the app:

```javascript
process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });
});
```

By default PM2 will wait 1600ms before sending a final SIGKILL signal. You can modify this delay by setting the `kill_timeout` option inside your application configuration file.

Read more about application state management [here](/docs/usage/signals-clean-restart/)

### Development environment

You may want to tell Developers to program inside a container to keep a consistant environment between develoment, test and production.

Replacing **pm2-runtime** with **pm2-dev** will enable the watch and restart features. This is quite interesting in a development container when the host files are exposed to the container as a VOLUME.

### Using PM2.io

[Keymetrics.io](https://keymetrics.io/) is a monitoring service built on top of PM2 that allows to monitor and manage applications easily (logs, restart, exceptions monitoring...). Once you created a Bucket on Keymetrics you will get a public and a secret key.

To enable Keymetrics monitoring with **pm2-runtime**, you can either use the CLI option **--public XXX** and **--secret YYY** or pass the environment variables **KEYMETRICS_PUBLIC** and **KEYMETRICS_SECRET**.

Example with the CLI options via a Dockerfile:

```
CMD ["pm2-runtime", "--public", "XXX", "--secret", "YYY", "process.yml"]
```

Or via environment variables:

```
ENV PM2_PUBLIC_KEY=XXX
ENV PM2_SECRET_KEY=YYY
```

Or via the Docker run command:

```
docker run --net host -e "PM2_PUBLIC_KEY=XXX" -e "PM2_SECRET_KEY=XXX" <...>
```

## pm2-runtime Helper

Here is the pm2-runtime helper:

```
>>> pm2-runtime -h

  Usage: pm2-runtime app.js

  pm2-runtime is a drop-in replacement node.js binary with some interesting production features

  Options:

    -V, --version              output the version number
    -i --instances <number>    launch [number] of processes automatically load-balanced. Increase overall performances and performance stability.
    --secret [key]             [MONITORING] keymetrics secret key
    --public [key]             [MONITORING] keymetrics public key
    --machine-name [name]      [MONITORING] keymetrics machine name
    --raw                      raw log output
    --json                     output logs in json format
    --format                   output logs formated like key=val
    --delay <seconds>          delay start of configuration file by <seconds>
    --web [port]               launch process web api on [port] (default to 9615)
    --only <application-name>  only act on one application of configuration
    --no-auto-exit             do not exit if all processes are errored/stopped or 0 apps launched
    --env [name]               inject env_[name] env variables in process config file
    --watch                    watch and restart application on file change
    --error <path>             error log file destination (default disabled)
    --output <path>            output log file destination (default disabled)
    -h, --help                 output usage information


  Commands:

    *
    start <app.js|json_file>  start an application or json ecosystem file
```
