---
layout: docs
title: Prometheus Integration | Guides | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
permalink: "/docs/enterprise/collector/prometheus/"
description: "When setting up the monitoring for your production environment, you might have already ran a Prometheus server and maybe a graphana dashboard. Even if…"
---

## Overview

When setting up the monitoring for your production environment, you might have already ran a Prometheus server and maybe a graphana dashboard.
Even if it's possible to re-add everything on PM2 Enterprise, it would take a lot of time, that's why we developed a gateway between any prometheus and our backend.

It allows you to simply drop in your configuration a remote backend, and it will start saving your metrics in PM2 Enterprise.

Note that currently only the alerting system works with it, you will be able to trigger alert in PM2 Enterprise from the values of your Prometheus metrics. However we plan to support them in the Dashboards in the near future.

## Requirements

The Prometheus team built a feature called `adapter` that lets you push metrics from prometheus thought HTTP. We currently only support the version `0.1.0` of this feature is supported, if you need a specific version, ask to our sales team directly.
We also currently support the `snappy` compression and the `protobuf` serialization, again ask us if you need something special.

## Configuration

If all the versions are good, you simply need to add this snipet to your prometheus configuration:
```yaml
remote_write:
  - url: https://secret_endpoint/receive
    basic_auth:
      username: publicKey
      password: privateKey
```

Where both `publicKey` and `privateKey` are the one you can find on the dashboard.
As you can see we didn't yet document the actual endpoint to push data, it's because in a private beta so if you want to try it out, just contact our sales team !

## Best practices

Please check that you are correctly pushing with the `HTTPS` protocol, since by default the adapter push in HTTP with is not secure at all.
A part from that no specific action is required from you to ensure best practices.

## Questions / Answers

* Why do we need to still host a prometheus instance ourselves?

  Because prometheus is what is called `pull based` monitoring, that means it the server that request the metrics to the client. We however are `push based` which means that you receive data from our agents that collect the metrics for us. So basically it's by design really hard to do that in our case (it would be easier if we were `pull based`). Also from a security point, you would need to expose your metrics docs to the internet so our servers can reach them which is a nightmare in a security point of view.

## Common Issues

* I doesn't work, i can't see any data on the dashboard !

  Check the prometheus server logs for any errors, check the authentication details. Also please note that our system need few minutes for data to show up in the metrics list when you start pushing a new one.
