---
layout: post
title: Brave New PM2
description: It's been 5 years that my brain is branded PM2. Five years I'm thinking everyday about how I can help Node.js users worldwide with a set of tools that users would love
tags: product
---

I would like to start by a big **THANK YOU**, to all PM2 users, contributors, customers, to my team and to the whole Node.js family.

Without you, we wouldn't have built such a tool that helps thousands of businesses run their Node.js apps confidently.

I deeply love Node.js and I'm still strong on my belief that Node.js is the de facto modern back-end language which increases the productivity of so many businesses, startups, innovators and hackers.

It's been 5 years that my brain is branded PM2. Five years I'm thinking everyday about how I can help Node.js users worldwide with a set of tools that users would love.

A quick reminder about PM2; PM2 is a process manager that helps you deploy, manage and keep your Node.js application alive 24/7\. It's Open Source and now counts more than 57 million downloads, 100.000 installs every day and more than 26.000 stars on Github.

For a fancy overview of PM2 downloads checkout this dashboard we built that helped us tracking downloads since 4 years: [map.keymetrics.io](https://map.keymetrics.io/)

# So What's new?

Since early 2018 year we pushed internally to build the new face of PM2 that we hope will stay and will make you enjoy using our Node.js toolset.

# PM2 Runtime Version 3

PM2 Runtime, the Open Source part of our product got some fresh features. Just for your knowledge, PM2 Runtime will ALWAYS stay Open Source.

## From pmx to the new @pm2/io module

You might have heard of [pmx](https://github.com/keymetrics/pmx), it's a way to add interaction between your app and PM2 via runtime metrics and triggerable functions.

It has been totally refactored in TypeScript with some new nifty features  added. One I personnaly like (and designed) is the new **entrypoint.js**.

The **entrypoint.js** makes you precisely contol your application flow and organize the link between the Node.js runtime and PM2.
Better some code than speaking, so here we go:

**entrypoint.js**:

```js
const io = require('@pm2/io')
const app = require('express')()

new class MyApp extends io.Entrypoint {
  // This is the very first method called on startup
  onStart (cb) {
    const http = require('http').Server(app)

    app.get('/', (req, res) => {
      this.reqMeter.mark()
      res.send('Hello From Entrypoint.js')
    });

    this.server = app.listen(cb)
  }

  // This is the very last method called on exit || uncaught exception
  onStop (err, cb, code, signal) {
    console.log(`App has exited with code ${code}`)
  }

  // Here we declare some process metrics
  sensors () {
    this.reqMeter = this.io.meter('req/min')
  }

  // Here are some actions to interact with the app in live
  actuators () {
    this.io.action('getEnv', (reply) => {
      reply({ env: process.env })
    })
  }
}
```

Now with pm2, start this entrypoint:

    $ pm2 start entrypoint.js

To inspect exposed metrics at runtime:

    $ pm2 monit

To trigger the `getEnv` action:

    $ pm2 trigger entrypoint getEnv

Try it and let us know what's your thought on this module [here](https://github.com/Unitech/pm2/issues)

## Enable inspector at runtime

Now you can easily enable the v8 inspector at runtime by typing the command:

    $ pm2 inspect <app_name>
    Connect to ws://127.0.0.1:9229/dff49462-f6ce-48d5-a36b-234d5c0b7992"

## Faster CLI & Decreased memory footprint

Now the PM2 CLI is 30% faster by using some [V8 tricks](https://github.com/Unitech/pm2/blob/development/bin/pm2#L7). Great when you're using PM2 on low resources machines like the RPI.

We've also reduced the number of modules required by the daemon to reduce memory footprint and refactored the versioning system to reduce CPU usage.

## Bug fixes & Small Improvements

You can see the whole PM2 Runtime CHANGELOG.md [there](https://github.com/Unitech/pm2/blob/release_3.0.0/CHANGELOG.md#300--wed-jun-20-2018-110621-gmt0200-cest-)

## New Documentation

It's been 4 years that the [legacy documentation](http://pm2.keymetrics.io/) grew _organically_ and went more and more disorganized and not DRY at all.
That's why we deeply refactored the whole content to end to this:


Check out the new documentation here: [pm2.io/doc](/docs/runtime/overview/), hope you like it and make sure you give use feedbacks and PRs! :)

# PM2 Plus

Here we are, this is a big big piece of work that has been rebuilt from scratch.

Previously called _Keymetrics_, the new monitoring and action management interface dedicated to Node.js and PM2 has been deeply lifted with the latest technology sugar out there. Not only the latest ones but also the most efficient. Yes PERFORMANCE as we seen more and more users monitoring gigantic infrastructure and our previous Keymetrics interface was in some sort lagging a bit.

The previous interface was built on top of AngularJS 1.x and as, you reader, knows, AngularJS 1.x application can not be easily migrated to more recent version.

That's why we choose the bulletprof technology... Vue.js! (cc Evan You @youyuxi who was one of the early contributor of PM2 ;))

## Product Overview

Here are some of the features you can get with [PM2 Plus](/docs/plus/overview/):

### Application Overview

Get an instant overview of one application

And there are more features, [try the PM2 Plus Free Tier](https://app.pm2.io/#/) to get to know all the features we offer.

### CPU & Memory Profiling

Profile CPU usage straight in production environment and visuzalize it with few overhead

# PM2 Enterprise

We launched PM2 Enteprise 6 months ago. PM2 Enterprise is the answer to large companies needs with premium support, Node.js expert consulting or training.

If you are interested to know more contact us at [sales@keymetrics.io](mailto:sales@keymetrics.io).

This product contains all the features of pm2 plus, however we tried to add features that help your understand and fix issues in your applications, here are some examples :

## Smart Anomaly Detection

The more custom metrics you plug into your application, the more your application become predictable, thanks to our new automatic anomaly detection system.
This system use machine learning and multiple algorithms to learn the behavior of your application and is able to predict a potential failure before it really happens

## Advanced Alerting System

In extension of the smart anomaly detection, sometimes you need to set fixed thresholds on metrics values to trigger notifications (email, slack, webhooks) or even trigger pre emptive actions (cross custom actions) to automatically fix problems. This is exactly what the Advanced Alerting System stand for.

## Custom Dashboards

Sometime hundreds of metrics can be plugged and can be difficult to monitor, that's why we built a custom metrics dashboard that allows to configure the way metrics are displayed and aggregated.
This is perfect when you want to offer developers a screen that gives them a bird eye view on technical metrics.

## Logs Management

Every application has logs and it can tell a lot about what's happening at any moment and especially when there is an incident. Our plug and play Log Management system can help you get more insights and match bugs with logs on incidents.

## On-Premise Setup

Sometime you may need to comply with specific regulations that force you to host all your data in your own infrastructure. PM2 Enterprise now offers this possibility via a simple containerized system.

Again if you want to know more about our Enterprise solution, get in touch with us at [sales@keymetrics.io](mailto:sales@keymetrics.io).

## Outro

We hope to cover the needs of any Node.js users with our 3 offers, the free one, PM2 Runtime that makes anyone run their Node.js apps confidently in a fast manner. PM2 Plus to cover your back when you decide to launch your application widely and PM2 Enterprise to make your company thrive with Node.js!
