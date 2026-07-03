---
layout: docs
title: Installation | Guide | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/guide/installation/"
description: "We assume that your app have been started with PM2. If not, follow the Quick Start tutorial."
---

# Installation

We assume that your app have been started with PM2. If not, follow the [Quick Start]({{ site.baseurl }}{% link docs/runtime/quick-start.md %}) tutorial.

## Create an account

You can create a PM2 plus accoutn by registering [here](https://id.keymetrics.io/api/oauth/register) or juste by typing ```pm2 plus``` in your terminal.

Then just simply follow the in-app tutorial
![Wizard](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/plus/wizard/step1.png)

## Connect your server to the dashboard

Connect your server to your dashboard and start collecting metrics with:

```bash
pm2 link <secret> <public>
```

Or, if you don't have access to the CLI, add `PM2_PUBLIC_KEY` and `PM2_SECRET_KEY` environment variables set with your public and private keys.

Use the `conncet` button on the top right of your dashboard to find your `PM2_PUBLIC_KEY` and `PM2_SECRET_KEY`
{: .tip}

### If you are behind a company proxy/firewall

Starting from PM2 3.2, we changed the networking connection by using a direct Websocket connection to our server on the port 443, so you only need OUTBOUND on port 443 TCP open. If you are using an older version, we of course advise to update but the ports that you need to open are 80 (TCP outbound), 443 (HTTPS outbound) and 43554 (TCP outbound), so verify everything is allowed on your firewall.

You also may need to whitelist IPs, please allow these ones: 62.210.102.213, 163.172.76.240, 62.4.21.98, 163.172.253.187, 163.172.67.152, 195.154.79.25, 195.154.79.34

## Next Steps

[Server Apps Overview]({{ site.baseurl }}{% link docs/plus/guide/server-apps-overview.md %})
{: .btn-stylized}
