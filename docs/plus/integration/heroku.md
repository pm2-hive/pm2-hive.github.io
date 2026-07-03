---
layout: docs
title: Heroku | Integration | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/integration/heroku/"
description: "In seconds, this tutorial will show you how to monitor a Node.js application with PM2 Plus in Heroku."
---

# Monitor your Node.js app in Heroku

In seconds, this tutorial will show you how to monitor a Node.js application with PM2 Plus in Heroku.

We assume that your app has already been wrapped with PM2. If not, follow the [PM2 Heroku Tutorial]({{ site.baseurl }}{% link docs/runtime/integration/heroku.md %}).

## Create an account

Register [here](https://id.keymetrics.io/api/oauth/register).

## Link with PM2 Plus

In order to connect PM2 to the dashboard, you need to add your public and private keys in the environment.

To add your keys, run:

```bash
heroku config:set PM2_PUBLIC_KEY=XXXXXXXXXX PM2_SECRET_KEY=YYYYY
```

 You can access your keys at the top right of your dashboard
{: .tip}

## Set the server name in PM2 Plus

Set the `PM2_MACHINE_NAME` environment variable to specify a server name:

```bash
heroku config:set PM2_MACHINE_NAME=heroku-server
```

 The default server name is the hostname (`HOST` environment variable) with a few random characters.
{: .tip}

 Be careful, in case of duplicate hostnames the dashboard will receive data from both instances and flicker.
{: .tip}

## Next Steps

Complete your [dashboard configuration]({{ site.baseurl }}{% link docs/plus/guide/configuration.md %}).




