---
layout: docs
title: Cloud Providers | Integration | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/integration/cloud-providers/"
description: "In seconds, this tutorial will show you how to monitor a Node.js application with PM2 Plus in a cloud provider."
---

# Monitor your Node.js app in a cloud provider

In seconds, this tutorial will show you how to monitor a Node.js application with PM2 Plus in a cloud provider.

We assume that your app has already been wrapped with PM2. If not, follow the [PM2 Cloud Provider Tutorial]({{ site.baseurl }}{% link docs/runtime/integration/cloud-providers.md %}).

## Create an account

Register [here](https://id.keymetrics.io/api/oauth/register).

## Link your app with PM2 Plus

In order to connect PM2 to the dashboard, you need to add your public and private keys in the environment.

```bash
export PM2_PUBLIC_KEY="YYYYY"
export PM2_SECRET_KEY="XXXXXXXXX"
pm2 update
```

## Set the server name in PM2 Plus

Set the `PM2_MACHINE_NAME` environment variable to specify a server name:

```bash
export PM2_MACHINE_NAME="my-cloud-provider-server"
```

 The default server name is the hostname (`HOST` environment variable) with a random string.
{: .tip}

 Be careful, in case of duplicate hostnames the dashboard will receive data from both instances and flicker.
{: .tip}

## Next Steps

Complete your [dashboard configuration]({{ site.baseurl }}{% link docs/plus/guide/configuration.md %}).



