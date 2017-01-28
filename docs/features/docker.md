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

Starting PM2 v2, a new binary gets installed automatically, called **pm2-docker**.

The goal of pm2-docker is to wrap your applications into a proper Node.js production environment. It solves major issues when running Node.js applications inside a container like:

- Correct PID 1 signals Handling & Forwarding
- Graceful application Start and Shutdown
- Seamless application clustering to increase performance and reliability

Further than that, using PM2 as a layer between the container and the application brings PM2 features like [application declaration file](/docs/usage/application-declaration/), [customizable log system](/docs/usage/log-management/), [source map support](/docs/usage/source-map-support/) and other great features to manage your Node.js application in production environment.

## Usage

### pm2-docker inside a Dockerfile

At the beginning of your Dockerfile add this line to install pm2:

```
RUN npm install pm2 -g
```

Then replace the CMD directive:

```
CMD ["node", "app.js"]
```

To this one:

```
CMD ["pm2-docker", "app.js"]
```

*NB: Please note that you have to replace app.js with your application.*

**You are now set!** Your Node.js application is now wrapped into a proper Node.js production environment.

### Starting a configuration file

Instead of running your raw Node.js application with PM2, you can declare it into a configuration file (or process file) and set some configuration variables, like enabling the cluster mode.

Let's create a process.yml file with this content:

```yaml
apps:
  - script   : 'app.js'
    name     : 'APP'
    exec_mode: 'cluster'
    instances: 4
  - script   : 'worker.js'
```

All options available are [listed here](/docs/usage/application-declaration/#attributes-available)

You can then replace the **CMD** directive by this:

```
CMD ["pm2-docker", "process.yml"]
```

To split each processes in his own Docker, you can use the --only [app-name] option:

```
CMD ["pm2-docker", "process.yml", "--only", "APP"]
```

### Logging Format option

If you want to change the log output format you can select one of this options:

- **--json**: will output logs in JSON format (logstash)
- **--format**: will output logs in = style format
- **--raw**: will output logs as is

To use one of this flag you just need to pass them to pm2-docker:

```
CMD ["pm2-docker", "--json", "process.yml"]
```

### Enabling Graceful Shutdown

When the Container receive a shutdown signal, PM2 forwards this signal to your application allowing to close all database connection, wait that all queries are processed or any other final processing before a successfull graceful shutdown.

To catch a shutdown signal it's straightforward. You just need to add a listener in your Node.js applications and execute anything needed before stopping the app:

```javascript
process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });
});
```

By default PM2 will wait 1600ms before sending a final SIGKILL signal. You can customize this delay by setting the `kill_timeout` option inside your application configuration file.

### Development environment

You may want to tell Developers to program inside a Container to keep a consistant environment between develoment, test and production.

By replacing **pm2-docker** with **pm2-dev** the watch and restart feature will be enabled. This is quite interesting in a development Container when the host files are exposed to the container as a VOLUME.

### Expose health endpoint

```bash
$ pm2-docker process.json --web
```

The `--web [port]` option allows to expose all vital signs (docker instance + application) via a JSON API.

### Using Keymetrics.io

[Keymetrics.io](https://keymetrics.io/) is a monitoring service built on top of PM2 that allows to monitor and manage applications easily (logs, restart, exceptions monitoring...). Once you created a Bucket on Keymetrics you will get a public and a secret key.

To enable Keymetrics monitoring with **pm2-docker**, you can whether use the CLI option **--public XXX** and **--secret YYY** or you can pass the environment variables **KEYMETRICS_PUBLIC** and **KEYMETRICS_SECRET**.

Example with the CLI options via a Dockerfile:

```
CMD ["pm2-docker", "--public", "XXX", "--secret", "YYY", "process.yml"]
```

Or via environment variables:

```
ENV KEYMETRICS_PUBLIC=XXX
ENV KEYMETRICS_SECRET=XXX
```

Or via the Docker run command:

```
$ docker run --net host -e "KEYMETRICS_SECRET=YYY" -e "KEYMETRICS_PUBLIC=XXX" <...>
```

## Official Docker image

We built an official image with **pm2-docker** that is well suited for development environment. Host files are exposed as VOLUME inside the container and it's built on top of Alpine Linux.

Image link on the Docker Hub Registry:

[>> pm2-docker-alpine <<](https://hub.docker.com/r/keymetrics/pm2-docker-alpine/)

Images availables are:

- keymetrics/pm2-docker-alpine:latest with the latest version of Node.js
- keymetrics/pm2-docker-alpine:7 with Node.js 7.4
- keymetrics/pm2-docker-alpine:6 with Node.js 6.9
- keymetrics/pm2-docker-alpine:4 with Node.js 4.7

## pm2-docker Helper

Here is the pm2-docker helper:

```
>>> pm2-docker -h

  Usage:  start <app>

  Commands:

    *
    start [options] <file|json_file>  start json_file or application

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    --raw                  raw log output
    --json                 output logs in json format
    --format               output logs formated like key=val
    --secret [key]         keymetrics secret key
    --public [key]         keymetrics public key
    --machine-name [name]  keymetrics machine name
    --auto-exit            exit if all processes are errored/stopped or 0 apps launched
    --watch                watch and Restart
    --env [name]           select env_[name] env variables in process config file
```
