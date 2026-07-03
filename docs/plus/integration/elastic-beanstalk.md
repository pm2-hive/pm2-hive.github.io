---
layout: docs
title: Elastic Beanstalk | Integration | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/integration/elastic-beanstalk/"
description: "In seconds, this tutorial will show you how to monitor a Node.js application with PM2 Plus in AWS Elastic Beanstalk."
---

# Monitor your Node.js app in AWS Elastic Beanstalk

In seconds, this tutorial will show you how to monitor a Node.js application with PM2 Plus in AWS Elastic Beanstalk.

We assume that your app has already been wrapped with PM2.

## Create an account on PM2 Plus

You can register [here](https://id.keymetrics.io/api/oauth/register).

## Link your app with PM2 Plus

In order to connect PM2 to the dashboard, you need to add your public and private keys in the environment.

Inject your keys into your eb environment:
```bash
eb setenv PM2_PUBLIC_KEY=YYYYY PM2_SECRET_KEY=XXXXXXXX
```

 You can access your keys at the top right of your dashboard
{: .tip}

 We unadvise to use the ecosystem file to set your keys into your environment, doing so your ecosystem file can stay public
{: .warn}

## Set the server name in PM2 Plus

Set the `PM2_MACHINE_NAME` environment variable to specify a server name:

```bash
eb setenv PM2_MACHINE_NAME=aws-eb-server
```

 The default server name is the hostname (`HOST` environment variable) with a random string.
{: .tip}

 Be careful, in case of duplicate hostnames the dashboard will receive data from both instances and flicker.
{: .tip}

## Next Steps

Complete your [dashboard configuration]({{ site.baseurl }}{% link docs/plus/guide/configuration.md %}).
