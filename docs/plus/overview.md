---
layout: docs
title: Overview | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/overview/"
description: "Once you go serious about production, you need to make sure that your application is running properly, without bugs, without performance issues and…"
---
# Welcome to the **PM2 Plus** documentation

Once you go serious about production, you need to make sure that your application is running properly, without bugs, without performance issues and without downtimes.

That's why we created PM2 Plus. It's a set of features for both hardening your current PM2 Runtime Process manager and monitoring applications in production.

With PM2 Plus you get:

- A Real-time Monitoring Web Interface
- Issues & Exception Tracking
- Deployment reporting
- Realtime logs
- Email & Slack notifications
- Custom Metrics Monitoring
- Custom Actions Center

To start testing, you can either go to [app.pm2.io](https://app.pm2.io) or use the pm2 cli (pm2 above 3.2.7):

```bash
pm2 plus
```

## Features available in PM2 Plus

### Server overview

![server overview](/img/server-overview.png)

PM2 Plus allows you to have an extended view of all your apps and databases in one single place, at real-time or through history. **Stop ssh in all your servers one by one**, instead, save time by having a condensed infrastructure plus view.

[Checkout the specific views]({{ site.baseurl }}{% link docs/plus/guide/server-apps-overview.md %})
{: .btn-stylized}

### Application Overview

![server overview](/img/app-overview.png)

Get an aggregated view over all your applications.

[Checkout the specific views]({{ site.baseurl }}{% link docs/plus/guide/server-apps-overview.md %})
{: .btn-stylized}

### Metrics Histogram

![custom metrics](/img/monitoring.png)

Expose the important variables from your Node.js applications source code and display them as performance metrics on the PM2 Plus dashboard. **Monitor values that matter.**

[See custom metrics]({{ site.baseurl }}{% link docs/plus/guide/custom-metrics.md %})
{: .btn-stylized}

### Notifications

![notifications]({{ site.baseurl }}{% link img/notification.png %})

Know when an error occurred in your application or when your production application is down.

Even though PM2 makes sure that your application have no downtime, be notified in these critical situation in order to react. **Be notified and reactive in any critical situations.**

[Checkout notifications]({{ site.baseurl }}{% link docs/plus/guide/notifications.md %})
{: .btn-stylized}

### Issues Dashboard

![issue dashboard](/img/exceptions.png)

PM2 Plus reports the list of all errors in the "Issue Dashboard" occurred in your Node.js and gets you notified.

Stop spending time finding bugs or trying to replay them, we provide you an "Issue Dashboard" with everything in one place, to make debugging easier. **Drill down in your code and get the answer.**

[Checkout the Issue Dashboard]({{ site.baseurl }}{% link docs/plus/guide/issue-dashboard.md %})
{: .btn-stylized}

### Custom Actions

![remote action](/img/custom-actions.png)

PM2 Plus makes possible to enhance custom functions in the source code of your application.

For example, you can assign values to your application variables or just switch it to maintenance mode. In other words you can **expose triggerable functions in your code**.

You will to use the the [@pm2/io module](https://github.com/keymetrics/pm2-io-apm) comes along with PM2. It is the PM2 part responsible for gathering the metrics, reporting exceptions, exposing remote actions and every outside interaction with your application.

[See how to use custom actions]({{ site.baseurl }}{% link docs/plus/guide/custom-actions.md %})
{: .btn-stylized}

### Realtime logs

![remote action](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/plus/logs/logs.png)

PM2 Plus allows you to see the logs of all of your applications managed by pm2 in one place in the cloud.
No need to ssh into your servers and use `pm2 logs` anymore, everything is on the web interface.

[Checkout the realtime logs]({{ site.baseurl }}{% link docs/plus/guide/realtime-logs.md %})
{: .btn-stylized}

### Third-party modules

![modules]({{ site.baseurl }}{% link img/plus/modules.png %})

Extend the capabilities of the PM2 Plus dashboard by using external modules listed in our module docs.
Monitor your databases metrics to know what going on in your infrastructure

[Modules]({{ site.baseurl }}{% link docs/plus/guide/modules.md %})
{: .btn-stylized}

### Next Steps

[Quick Start]({{ site.baseurl }}{% link docs/plus/quick-start.md %})
{: .btn-stylized}
