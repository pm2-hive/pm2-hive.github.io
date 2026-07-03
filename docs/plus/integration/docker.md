---
layout: docs
title: Docker | Integration | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/integration/docker/"
description: "In seconds, this tutorial will show you how to monitor a Node.js application with PM2 Plus inside a container."
---

# Monitor your Node.js app in a Docker container

In seconds, this tutorial will show you how to monitor a Node.js application with PM2 Plus inside a container.

We assume that your app has already been wrapped with PM2. If not, follow the [PM2 Docker Tutorial]({{ site.baseurl }}{% link docs/runtime/integration/docker.md %}).

## Create an account

Register [here](https://id.keymetrics.io/api/oauth/register).

## Install the profiler

Add this to your Dockerfile to install the profiler:

```Dockerfile
RUN pm2 install profiler
```

## Link your app with PM2 Plus

In order to connect PM2 to the dashboard, you need to add your public and private keys in the environment.

Create a .env file with:
```.env
PM2_SECRET_KEY=XXXXX
PM2_PUBLIC_KEY=YYYYY
```
and restart your container with `docker run`adding `--env-file .env` to load the environment variables.

## Set the server name in PM2 Plus

Set the `PM2_MACHINE_NAME` environment variable to specify a server nam. Add this to the .env file:

```.env
PM2_SECRET_KEY=XXXXX
PM2_PUBLIC_KEY=YYYYY
PM2_MACHINE_NAME=docker-server
```

 The default server name is the hostname (`HOST` environment variable) with a random string.
{: .tip}

 Be careful, in case of duplicate hostnames the dashboard will receive data from both instances and flicker.
{: .tip}

## Next Steps

Complete your dashboard [configuration]({{ site.baseurl }}{% link docs/plus/guide/configuration.md %}).



