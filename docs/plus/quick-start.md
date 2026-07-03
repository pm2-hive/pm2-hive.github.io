---
layout: docs
title: Installation | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/quick-start/"
description: "In seconds, this Installation tutorial will show you how to start monitoring your Node.js application with PM2 Plus."
---

# Installation

In seconds, this Installation tutorial will show you how to start monitoring your Node.js application with PM2 Plus.

## Terminology

Let's first explain some terminology we will use across this guide:

A **bucket** is an entity related to PM2 Plus which is associated to a billing plan. Buckets are generally used to group and monitor multiple servers of a single project.

A **server** is a container or a machine with a PM2 daemon managing one or more processes.

A **process** is an entity of the process list (`pm2 ls`). This is one instance of an app which has been started by PM2.

## Create an account & bucket

You can create a PM2 plus account by registering [here](https://id.keymetrics.io/api/oauth/register) or just by typing ```pm2 plus``` in your terminal. Then just simply follow the in-app tutorial.

## Connect your server to the dashboard

Connect your server to your dashboard and start collecting metrics with:

```bash
pm2 link <secret> <public> [MACHINE_NAME]
```

*secret* is the secret key
*public* is the public key
*MACHINE_NAME*  can optionally be set to display your machine name on the dashboard

### Connect without CLI

If you don't have access to the CLI, add `PM2_PUBLIC_KEY` and `PM2_SECRET_KEY` environment variables with the right value and PM2 will automatically connect to PM2 Plus.

Use the `connect` button on the top right of your dashboard to find your `PM2_PUBLIC_KEY` and `PM2_SECRET_KEY`

## You are all set!

Go back to the dashboard, you will have access to realtime metrics of your app.

![dashboard view](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/plus/overview/server_overview.png)

## Next Steps

[Discover the Dashboard]({{ site.baseurl }}{% link docs/plus/guide/server-apps-overview.md %})
{: .btn-stylized}
