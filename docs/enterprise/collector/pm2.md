---
layout: docs
title: PM2 Agent | Guides | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
permalink: "/docs/enterprise/collector/pm2/"
description: "When you already use PM2 and you want to use PM2 Enterprise, it's really easy to launch our agent since it is directly embed as a dependency."
---

## Overview

When you already use PM2 and you want to use PM2 Enterprise, it's really easy to launch our agent since it is directly embed as a dependency.

If you want to monitor your app within a docker container, we advise to use the [standalone agent]({{ site.baseurl }}{% link docs/enterprise/collector/standalone.md %})

# Requirements

**This agent require at least Node 4** to run and we advise to use at least PM2 v3.2 to have better performances.

## Installation

You only need to tell PM2 to launch the agent:

```bash
pm2 link <private> <public> <server>
```

Where:
  - `<private>` is the private key that you can find on your dashboard
  - `<public>` is the public key that you can find on your dashboard
  - `<server>` (**optional**) is the name that will show as server name in the dashboard

And that's it, PM2 will automatically launch its agent and manage it, every applications will start pushing data in PM2 Enterprise.

## Best Practices

We advise running the embed agent in pm2 when it's best suit your use case, that's why you advise it to use it when:

- You already use PM2 to manage the applications in your servers.
- If your application is inside a VM or on a bare metal server and you are not sure if you need to setup systemd service or similar, just use pm2.

## Configuration

Most of the features (tracing, profiling etc)rely on PM2 adding `@pm2/io` library inside your application, so we advise to [checkout its configuration](https://github.com/keymetrics/pm2-io-apm#global-configuration-object) to manage it independently for each application.

Few things that you can do without relying on a configuration in your code:

```bash
pm2 reload <name> --trace --update-env # will enable the transaction tracing
```

```bash
pm2 reload <name> --disable-trace --update-env # will disable the transaction tracing
```

```bash
pm2 unmonitor <name> # the agent will stop sending monitoring data to PM2 Enterprise about this process
```

```bash
pm2 monitor <name> # when you disable monitoring, you can re-enable it with this command
```

## Questions / Answers

* What are the performance cost of using the agent embed in pm2?

  It depend of which features/metrics you are enabling, most of them have a really low overhead (< 5%)
  The biggest impact in performance is the `transaction tracing` which modify some libraries (express, mongodb etc) to be able to "trace" them, which depending on your application is between 5 to 20%.

* Do you support routing the traffic from the agent thought a network gateway (or proxy)?

  Currently it's not the case but we plan to implement it. Ask our sales team if you really need it.

## Common Issues

* I doesn't work, i can't see any data on the dashboard !

  You might have some networking problem, first we of course advise to retry from a different environment to pinpoint where the problem come from.
  Next you should verify that you allow traffic to our servers, we only use the port 443 in OUTBOUND.
  Note that this rule is only available for PM2 > 3.2, if you are using an older version you should upgrade.
