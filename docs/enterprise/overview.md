---
layout: docs-io
title: Overview | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
hide_comments: true
permalink: "/docs/enterprise/overview/"
description: "PM2 Enterprise is an advanced Node.js toolset that is convenient for high scale or critical Node.js services. It answers to the need of companies willing…"
---

# Welcome to the **PM2 Enterprise** documentation

**PM2 Enterprise** is an advanced Node.js toolset that is convenient for high scale or critical Node.js services.
It answers to the need of companies willing to bet a lot on Node.js and be confident on their technology switch.

Here a quick description of each of the Enterprise feature currently available in the PM2 Enterprise product:

- Dashboards:
If you have a lot of metrics that you want to track, you might have the problem to display a lot of them the way you want. Each dashboard is customizable, each component on it is configurable (apps/servers/metrics etc) and moveable anywhere on the dashboard.

- Alerting:
This feature is the opposite of the Anomalies, sometimes you want to create manual alert for specific metrics, with this feature you are able to configure the threshold and the actions that result, you can ask to receive an email, a slack message or trigger pm2 action (like a pm2 restart) directly on application. We also added the possibility to trigger directly profiling into the application if you want to collect cpu or memory profiling on your production environment, it will launch and save it for you to inspect it later.

- Logs:
Currently PM2 Plus only offer the realtime logs where you can only know what's happening in realtime, with Enterprise we also store the logs of the application so you can checkout them later if you want to, no need to ssh into your servers anymore to see the logs.

- Memory Profiling:
In PM2 Plus you have the CPU profiling which help you know which function is using the most cpu usage, with Enterprise you have the same system but for the memory, you are able to exactly know which function is allocating memory in your application. It can help you pinpoint exactly which function is responsible for memory leak.
Note that the profiling can be launched in production because it's running in parallel of your application, no need to try to reproduce any cpu/memory issue in development anymore, just launch directly the profiling where the issue is happening.

- Profiling:
In the Enterprise product, we also added the possibility to store all the profiling that you run on your applications so you can compare them, review them and see how a change in your code is impacting the cpu/memory consumption.

## On-premise Installation

We offer different way of delivering PM2 Enterprise via easily installable on-premise system or dedicated/managed instances.

[Checkout the on-premise documentation](https://github.com/keymetrics/on-premise)
{: .btn-stylized}
