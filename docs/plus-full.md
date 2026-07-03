---
layout: docs-io
title: PM2 Plus Documentation
description: "The complete PM2 Plus documentation on a single page: monitoring dashboard, custom metrics and actions, realtime logs, profiling and notifications."
permalink: /docs/pm2-plus/
---

<a id="overview"></a>
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

<a id="quick-start"></a>
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

<a id="guide-server-apps-overview"></a>
# Presentation

There are 2 types of overview in PM2 Plus, the first one is the `Application overview` where you don't see any reference to a server in the overview, this one is mainly useful to containers or environment with a lot of applications.
The other one is the `Server overview` which is the default with PM2 Plus, it's more detailed than the other one and show you every information by physical server.

## Server Overview

![server overview](https://cdn.jsdelivr.net/gh/keymetrics/branding/screenshots/plus/overview/server_overview.png)

This view is breakdown by server, in the following example we have one server with 7 applications: 

![detailed example]({{ site.baseurl }}{% link img/plus/server.png %})

In the top bar of this section you will find infos about the actual server
- The Server's Name
- Number of cores and memory
- Versions of Node.js & PM2
- The public and private IP

You are able to get realtime infos about any application such as
- cpu utilization
- memory comsumption
- HTTP Latency
- Issues
- Event Loop Lag (the amount of time between two run of the event loop, should be less than 10 ms)
- Number of restarts
- Versionning metadata (if your app is in a git repository)

At the left of each application you can toggle more information for the application, it will show you:
- All the metrics about the applications (both default and custom ones)
- All the custom actions you added, you can trigger them for these buttons too.

## Apps Overview

![app overview](https://cdn.jsdelivr.net/gh/keymetrics/branding/screenshots/plus/overview/app_overview.png)

It contains almost everything you need to see to understand the current health of your applications:

- CPU Usage Heatmap
    - Each cell represent a process in a server
    - the color represent the cpu usage (varying from green to red where red is 100% of cpu usage)
- Error history
    - Last hour, last day and last week, it give you an idea if the application is instable for a long time or not.
- Important metrics
    - average cpu utilization
    - average memory consumption
    - average latency (only if you are using an http server) 
    - average Request / minutes (only if you are using an http server)

If you click on the heatmap, you will directly go on the app dashboad which is discribed in the following dashboard.

## Next Steps

[Application dashboard]({{ site.baseurl }}{% link docs/plus/guide/app-dashboard.md %})
{: .btn-stylized}

<a id="guide-app-dashboard"></a>
# Application Dashboard

![Dashboard](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/plus/dashboard/dashboard.png)

This dashboard is used to give you insight on a particular application.

At the top you will see a map again, each of the rectangle represent one hour and its color depend on what was happening during this hour.
Each color have a different meaning:
  - Light blue means either a low cpu or memory usage (lower than normal)
  - Dark blue means either a high cpu or memory usage (higher than normal)
  - Blue means everything is normal
  - Red means we received error about the application during this hour.

Then you have few metrics about this applications, for each metric you will have the historial value in the background and the realtime value in the foreground. You can customize those ones by clicking on `Configure metrics` at the far right of the screen.

Finally at the bottom, we will list each servers where your application is. And for each server, we will show you the metrics about the application on this specific server.
It's pretty much the same view as the `Servers overview` expect there it's only about one application.

## Next Steps

[Notifications]({{ site.baseurl }}{% link docs/plus/guide/notifications.md %})
{: .btn-stylized}

<a id="guide-notifications"></a>
# Notifications

Notifications are one of the most powerful feature of PM2 Plus, always getting you aware about critical events.

By default, you receive notifications only by email and for critical events such as:
- downtime
- deployment
- issues
- restart

This section will help you to customize the notification systems to setup other channels and understand what you can receive as notifications.

## Issues notifications

By default, PM2 Plus sends three different kind of notification.
Issues are simply errors that your application have, there two type: 
- runtime errors: they made your application crash, pm2 automatically catch them and restart your application.
- custom errors: with `@pm2/io` you can send custom error that you need to track in your application

Here is an example on how you can report custom errors: 

```javascript
const io = require('@pm2/io')

io.notifyError(new Error('This is an error'), {
  // you can some http context that will be reported in the UI
  http: {
    url: req.url
  },
  // or anything that you can like an user id
  custom: {
    user: req.user.id
  }
})
```

The first time we receive an error, we send you notifications by email.
You can also configure to receive a slack message by going to `Settings > Alerts > 3rd Party Integration`

We will also send you notificatios in case of "bad behavior", which is when the same error happens more than 5 times in 60 seconds.
Note that we will avoid sending a notification for each "bad behavior" that we detect.

You can choose to not receive notifications for errors by going to `Settings > Alerts > Exceptions`

For both following integration, you need to use at least `@pm2/io` version 3.0.0

#### Report errors with Express

If you want you can configure your express middleware to automatically send you an error with the error middleware of express:

```js
const io = require('@pm2/io')
const express = require('express')
const app = express()

// add the routes that you want
app.use('/toto', () => {
  throw new Error('ajdoijerr')
})

// always add the middleware as the last one
app.use(io.expressErrorHandler())
```

#### Report errors with Koa

We also expose a custom koa middleware to report error with a specific koa middleware:

```js
const io = require('@pm2/io')
const Koa = require('koa')
const app = new Koa()

// the order isn't important with koa
app.use(pmx.koaErrorHandler())

// add the routes that you want
app.use(async ctx => {
  ctx.throw(new Error('toto'))
})
```


## Offline notifications

**NOTE: The offline notification only works with PM2 version above 3.2.2** 

When one of your servers isn't sending data to our servers for more than 2 minutes (can be configured), we tag him as "offline".
You can choose to receive a notifications when it happens by going to `Settings > Alerts > Server offline`
You can configure the threshold of how much time it need to be disconnected to send a notifications by going to `Settings > General > Your server is considered offline after`

If your applications are in auto scaling environment, we advise to turn of the offline notifications and turn on "Auto delete a server when going offline" in `Settings > General` so it disappear from the dashboard automatically.

## Restart notifications

Sometimes you may want to be alerted when PM2 restart your application, we added a way for you to be alerted in this case, enable it in `Settings > Alerts > Automatic / Manual Restart`
Automatic restart are the ones that are made by PM2 itself, because your app crashed for example.
Manual restart are the ones that are done via the CLI using `pm2 restart myapp`

## Deployment notifications

If you use git with your application, we also allow you to receive an alert when the application is updated.
You can turn it off or configure it by going to `Settings > Alerts > Deployment`

## Notification channels

By default, notifications are only sent by email but they can be enabled with slack or via a webhook.

### Slack notifications

The Slack integration allows you to receive exceptions and event notifications straight into a selected Slack channel.

First you need to get the Slack URL and to setup an incoming Webhook. More details on how to set this up can be found [here](https://my.slack.com/services/new/incoming-webhook/).

Then go to the notification docs `Settings > Alerts` and insert the webhook into the field. Enable and click on update.

Check if you successfully received a notification into your slack channel confirming that it has been configured.

### Webhooks

You can also set a webhook that will make POST HTTP request to a given URL when you receive a notifications.

The format of the data is a json like the following:

```json
 {
   "event":"event:new_exception",
   "data":{
      "process":{
         "pm_id":9,
         "name":"pm2-elasticsearch",
         "rev":"ac77098c5e1b10d74360b113da6e717fab8fe427",
         "server":"pm2-module-testing"
      },
      "data":{
         "message":"Bad argument",
         "stack":"TypeError: Bad argument\n    at TypeError (native)\n    at ChildProcess.spawn (internal/child_process.js:274:26)\n    at exports.spawn (child_process.js:362:9)\n    at Object.exports.execFile (child_process.js:151:15)\n    at exports.exec (child_process.js:111:18)\n    at /home/node/pm2-elasticsearch/lib/actions.js:25:5\n    at process.<anonymous> (/home/node/pm2-elasticsearch/node_modules/pmx/lib/actions.js:64:14)\n    at emitTwo (events.js:92:20)\n    at process.emit (events.js:172:7)\n    at handleMessage (internal/child_process.js:695:10)"
      },
      "at":1472651928925,
      "created_at":1472651928925,
      "updated_at":1472651928925,
      "count":1,
      "identifier":"ad6f8650dabfec83f183633b0bba7d97",
      "infected_servers":[
         "pm2-module-testing"
      ],
      "timestamps":[
         1472651928925
      ],
      "commits":[
         "ac77098c5e1b10d74360b113da6e717fab8fe427"
      ],
      "bucket_url":"https://app.pm2.io/.../"
   }
}
```
 
Use case example: You can now setup an express server that can receive webhooks, automatically send SMS or use any integration you want.

## Next Steps

[Issue Dashboard]({{ site.baseurl }}{% link docs/plus/guide/issue-dashboard.md %})
{: .btn-stylized}

<a id="guide-issue-dashboard"></a>
# Issue dashboard

![issue dashboard](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/plus/issues/issues.png)

By default when one of your applications crash, pm2 will of course automatically restart it but it will also send the error to PM2 Plus.
In the issue dashboard, you will be able to see for each error:
- How much time the error happened?
- The servers that were impacted by this errors
- The stack trace
- The exact line of code that thrown the error
- Few applications logs before the error happened

You can of course delete them if you think they are not relevant by click on `

## Manually emit an issue

It's possible that you need to report an error that isn't crashing your process.
In this case you can use `io.notifyError`:

```javascript
const io = require('@pm2/io')

try {
  // Critical action to be tested
  user.sendNotifications()
} catch (error) {
  io.notifyError(new Error('Notification failed'), {
    // or anything that you can like an user id
    custom: {
      user: user.id
    }
  })
}
```

## Next Steps

[Notifications]({{ site.baseurl }}{% link docs/plus/guide/custom-metrics.md %})
{: .btn-stylized}

<a id="guide-custom-metrics"></a>
![pm2io](https://raw.githubusercontent.com/keymetrics/branding/master/logos/pm2ioAPM/io-white.png)

# Expose Custom Metrics

By default PM2 Plus will add some metrics into your application, but it's not always enough.
<br/>
`@pm2/io` is the library that will help you add custom metrics to monitor the critical parts of your application.

## Create a custom metrics

You can create a custom metrics with the method `metric()` of `@pm2/io`.

```javascript
const io = require('@pm2/io')

const realtimeUser = io.metric({
  name: 'Realtime user',
})

realtimeUser.set(42)
```

This arguments are available:

- **name**: A easy to understand name to be shown in the UI
- **id**: A unique identifier for the metric
- **unit**: Unit of measure for the metric
- **historic**: keep the history in PM2 Plus (default: true)

The type corresponds to one of the 4 ways to gather metrics:

- **metric**: To expose a variable's value
- **counter**: A discrete counter to be triggered manually to increase or decrease a number
- **meter**: To measure a frequency, a number of occurrences of a repeating event per unit of time
- **histogram**: To measure a statistic, a statistic on a metric over the last hour

## Metric

In active mode, you need to save the return of the `metric` method. This will give you an object that has the method `set()`. Use this method to update the value of the metric.

```javascript
const realtimeUsers = io.metric({
  name: 'Realtime Users'
  id: 'app/realtime/users',
})

realtimeUsers.set(23)
```

## Counter

The second type of metric, called `counter`, is a discrete counter that helps you count the number of occurrence of a particular event. The counter starts at 0 and can be incremented or decremented.

```javascript
const io = require('@pm2/io');

const currentReqs = io.counter({
  name: 'Realtime request count',
  id: 'app/realtime/requests'
});

http.createServer((req, res) => {
  // Increment the counter, counter will eq 1
  currentReqs.inc();
  req.on('end', () => {
    // Decrement the counter, counter will eq 0
    currentReqs.dec();
  });
});
```

## Meter

The third type of metric, called `meter`, computes the frequency of an event. Each time the event happens, you need to call the `mark()` method. By default, the frequency is the number of events per second over the last minute.

```javascript
const io = require('@pm2/io')

const reqsec = io.meter({
  name: 'req/sec',
  id: 'app/requests/volume'
})

http.createServer((req, res) => {
  reqsec.mark()
  res.end({ success: true })
})
```

## Histogram

This last type of metric collects values and provides statistic tools to explore their distribution over the last hour.
By default it will use the `mean` (`percentile 50`) of the last hour but you can choose between: 
- min, max, sum, count, variance, mean, stddev, median, p75, p95, p99, p99.

```javascript
const io = require('@pm2/io')

const latency = io.metric({
  name: 'latency',
  type: 'histogram',
  measurement: 'mean'
});

const latencyValue = 0;

setInterval(() => {
  latencyValue = Math.round(Math.random() * 100);
  latency.set(latencyValue);
}, 100);
```

## Next Steps

[Custom Action Center]({{ site.baseurl }}{% link docs/plus/guide/custom-actions.md %})
{: .btn-stylized}

<a id="guide-custom-actions"></a>
![pm2io](https://raw.githubusercontent.com/keymetrics/branding/master/logos/pm2ioAPM/io-white.png)

# Custom Actions

Custom actions are function that you expose to PM2 Plus with `@pm2/io` so you are able to launch them from the dashboard.
A example use case that everyone should be familiar with is the following:

```javascript
const { createLogger, format, transports } = require('winston')

const logger = createLogger({
  level: 'info',
  format: format.simple(),
  transports: [new transports.Console()]
})

logger.info('Hello world')
logger.debug('Debugging info')
```

Here i got a logger somewhere in my application, when putting it into production i don't want to get every `debug` log of it so by default i put the log level to `info`.
However if i want to debug my application, i need to edit the source code, rebuild and redeploy to be able to see debug information.

Here comes the custom actions:

```javascript
const { createLogger, format, transports } = require('winston')
const io = require('@pm2/io')

const logger = createLogger({
  level: 'info',
  format: format.simple(),
  transports: [new transports.Console()]
});

logger.info('Hello world')
logger.debug('Debugging info')

io.action('set debug level', (cb) => {
  // when running this action, we will be able to see all debug statement
  logger.transports.Console.level = 'debug'
  return cb({ level: 'debug' })
})

io.action('set info level', (cb) => {
  // and when running this one, you get back to your normal log level
  logger.transports.Console.level = 'info'
  return cb({ level: 'info' })
})
```

Custom actions are really powerful and only limited by your imagination, their usefulness really depend on your pains.
But we believe that updating small configuration like the log level shouldn't take more than a few minutes.

## Expose Remote Actions

You can remotely trigger functions directly from your dashboard. After having been exposed from your code, action buttons can be found in the `Action Center` section.

The function takes a function as a parameter, which needs to be called once the action is finished.

```javascript
const io = require('@pm2/io')

io.action('db:clean', (cb) => {
  db.clean(() => {
     return cb({ success: true })
  })
})
```

## How to use them in the dashboard

![remote action](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/plus/actionCenter/actionCenter.png)

When you added all the actions in your code, you can go to the `Actions center` in the dashboard.

From there you will see every actions that you have added. As soon as you click on them we will launch into your application.
You will of course be able to see the output that your action sent in the callback.

## Next Steps

[Realtime Logs]({{ site.baseurl }}{% link docs/plus/guide/realtime-logs.md %})
{: .btn-stylized}

<a id="guide-realtime-logs"></a>
# Realtime Logs

![Logs](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/plus/logs/logs.png)

In PM2 Plus you are able to stream the logs that your application output directly to the dashboard.
It can be really helpful if you don't want to SSH into your servers and use `pm2 logs`

Note that if you are looking for a log storage solution, you can checkout the PM2 Enterprise product which contains log retention.


## Next Steps

[Modules]({{ site.baseurl }}{% link docs/plus/guide/modules.md %})
{: .btn-stylized}

<a id="reference-pm2io"></a>
# The @pm2/io Library

[@pm2/io](https://github.com/keymetrics/pm2-io-apm/tree/master/test) is the library that comes with PM2 which is in charge of gathering the metrics that are displayed in PM2 Plus By default, the module just wraps your app but can be required in the code to refine the configuration or add custom metrics/actions.

## Initialisation options

```javascript
export class IOConfig {
  /**
   * Automatically catch unhandled errors
   */
  catchExceptions?: boolean = true
  /**
   * Configure the metrics to add automatically to your process
   */
  metrics?: {
    eventLoop: boolean = true,
    network: boolean = false,
    http: boolean = true,
    gc: boolean = true,
    v8: boolean = true
  }
  /**
   * Configure the default actions that you can run
   */
  actions?: {
    eventLoopDump?: boolean = true
  }
  /**
   * Configure availables profilers that will be exposed
   */
  profiling?: {
    /**
     * Toggle the CPU profiling actions
     */
    cpuJS: boolean = true
    /**
     * Toggle the heap snapshot actions
     */
    heapSnapshot: boolean = true
    /**
     * Toggle the heap sampling actions
     */
    heapSampling: boolean = true
    /**
     * Force a specific implementation of profiler
     * 
     * available: 
     *  - 'addon' (using the v8-profiler-node8 addon)
     *  - 'inspector' (using the "inspector" api from node core)
     *  - 'none' (disable the profilers)
     *  - 'both' (will try to use inspector and fallback on addon if available)
     */
    implementation: string = 'both'
  }
  /**
   * Configure the transaction tracing options
   */
  tracing?: {
    /**
     * Choose to enable the HTTP tracing system
     * 
     * default is false
     */
    enabled: boolean = false
    /**
     * Specify specific urls to ignore
     */
    ignoreFilter?: {
      url?: string[]
      method?: string[]
    }
    // Log levels: 0-disabled,1-error,2-warn,3-info,4-debug
    logLevel?: number
    /**
     * To disable a plugin in this list, you may override its path with a falsy
     * value. Disabling any of the default plugins may cause unwanted behavior,
     * so use caution.
     */
    plugins?: {
      connect?: boolean
      express?: boolean
      'generic-pool'?: boolean
      hapi?: boolean
      http?: boolean
      knex?: boolean
      koa?: boolean
      'mongodb-core'?: boolean
      mysql?: boolean
      pg?: boolean
      redis?: boolean
      restify?: boolean
    }
    /**
     * An upper bound on the number of traces to gather each second. If set to 0,
     * sampling is disabled and all traces are recorded. Sampling rates greater
     * than 1000 are not supported and will result in at most 1000 samples per
     * second.
     */
    samplingRate?: number
  }
  /**
   * If you want to connect to PM2 Enterprise without using PM2, you should enable
   * the standalone mode
   * 
   * default is false
   */
  standalone?: boolean = false
  /**
   * Define custom options for the standalone mode
   */
  apmOptions?: {
    /**
     * public key of the bucket to which the agent need to connect
     */
    publicKey: string
    /**
     * Secret key of the bucket to which the agent need to connect
     */
    secretKey: string
    /**
     * The name of the application/service that will be reported to PM2 Enterprise
     */
    appName: string
    /**
     * The name of the server as reported in PM2 Enterprise
     *
     * default is os.hostname()
     */
    serverName?: string
    /**
     * Broadcast all the logs from your application to our backend
     */
    sendLogs?: Boolean
    /**
     * Since logs can be forwared to our backend you may want to ignore specific
     * logs (containing sensitive data for example)
     */
    logFilter?: string | RegExp
    /**
     * Proxy URI to use when reaching internet
     * Supporting socks5,http,https,pac,socks4
     * see https://github.com/TooTallNate/node-proxy-agent
     *
     * example: socks5://username:password@some-socks-proxy.com:9050
     */
    proxy?: string
  }
}
```

You can pass whatever options you want to `io.init`, it will automatically update its configuration.

<a id="guide-modules"></a>
# Modules

Modules are open-source addons built and maintained thanks to the community. A PM2 module is just a Node.js process run by PM2 and can be pulled directly with PM2.

Modules are great to monitor external databases for example. The module process collects metrics with database calls and reports them into the dashboard with the [@pm2/io library](https://github.com/keymetrics/pm2-io-apm).

Anyone can create and publish a module. Leave us an email at contact@pm2.io if you want us to add your module to this list.

## Use a module

Module are designed to be easy to use and to refine your configuration according to your needs.

### Available modules

Module Name|Description
---|---
[pm2-server-monit](https://github.com/keymetrics/pm2-server-monit)|Monitor your server machine (maintained by us)
[pm2-logrotate](https://github.com/keymetrics/pm2-logrotate)|Split your logs into multiple files (maintained by us)
[pm2-elasticsearch](https://github.com/pm2-hive/pm2-elasticsearch)|Monitor your Elastic Search
[pm2-redis](https://github.com/pm2-hive/pm2-redis)|Monitor your Redis
[pm2-mysql](https://github.com/pm2-hive/pm2-mysql)|Monitor your MYSQL
[pm2-rabbitmq](https://github.com/pm2-hive/pm2-rabbitmq)|Monitoring module for RabbitMQ
[pm2-mongodb](https://github.com/pm2-hive/pm2-mongodb)|Monitor your Mongo DB
[pm2-postgres](https://github.com/pm2-hive/pm2-postgres)|Monitor your PostgreSQL
[pm2-memcached](https://github.com/pm2-hive/pm2-memcached)|Monitor your Memcached
[pm2-couchdb](https://github.com/pm2-hive/pm2-couchdb)|Monitor your CouchDB
[pm2-php-fpm](https://github.com/pm2-hive/pm2-php-fpm)|Monitor your PHP server

### Installation

```bash
pm2 install <module-name>

# Install a module from GitHub (username/repository)
pm2 install pm2-hive/pm2-docker

# Install a module in dev mode from local folder
pm2 install .
```

### Configuration

Module sometimes offers the possibility to setup some option values. They are generally specified in the README or in the package.json in their github repository.

Set a value with:
```bash
pm2 set module_name:option_name <new_value>
```

The variables are saved in `~/.pm2/module_conf.json`. Configuration variables can be displayed with `pm2 conf [your-module-name]`. No restart is needed, the module is automatically restarted.

### Manage a module

```bash
# List all modules
pm2 ls

# Uninstall a module
pm2 uninstall <module-name>
```

## Create a module

If you don't find a module that suits your needs, don't wait and create one.

### Module Boilerplate

Generate a boilerplate:

```bash
pm2 module:generate <your-module-name>
```

Install and start the module:

```bash
cd <your-module-name>
pm2 install .
```

 If you edit the source, PM2 automatically restarts the module (watch option is activated)
{: .tip}

Display module logs with:

```bash
pm2 logs <your-module-name>
```

### Module Configuration

Module configuration can be added into the `package.json` file.

The `config` attribute gathers parameters that will be accessible in the module in the callback of `io.initModule()`.

The `apps` attribute contains the same configuration as the ecosystem file. Don't forget that a module is a process like any other ones.

```json
{
  "name": "your-module-name",         // Used as the module name
  "version": "1.0.0",                 // Used as the module version
  "description": "My awesome module", // Used as the module comment
  // Default configuration values
  // These values can be overriden with `pm2 set <module-name>:<attr> <val>`
  "config": {
    "days_interval" : 7,
    "max_size" : 5242880
  },
  // Module behavior options
  "apps": [{
    "script": "index.js",
    "merge_logs": true,
    "max_memory_restart": "200M"
  }]
}
```

### Module entry point

In your main module entry point, `io.initModule()` is called to initialize the module:

```javascript
const io = require('@pm2/io')

const conf = io.initModule({
  // Override PID to be monitored
  pid: io.resolvePidPaths(['/var/run/redis.pid']),
}, (err, conf) => {
  // Now the module is initialized
  require('./business_logic.js')(conf)
})
```

### Installation Display

Once the module is installed, you can change the behavior to display a table containing the content you want. Edit the package.json and add an env section with `pm2_EXTRA_DISPLAY: true`:


```json
{
  [...]
  "apps" : [{
    "script" : "index.js",
    "env"    : {
      "pm2_EXTRA_DISPLAY" : "true"
    }
  }],
  [...]
}
```

Then in your code:

```javascript
const io = require('@pm2/io')

io.configureModule({
  human_info: [
    ['Status', 'Module ready'],
    ['Comment', 'This is a superb comment the user should see'],
    ['IP', 'my machine ip!']
  ]
})
```

### Publish Your Module

Inside the module folder, deploy your module with:

```bash
pm2 publish
```

  This increments the minor version of the module, runs `git add . ; git commit -m "VERSION"; git push origin master` then runs `npm publish`.
{: .tip}

## Next Steps

Thanks for finishing this guide.

You can now take a look at the [@pm2/io reference]({{ site.baseurl }}{% link docs/plus/reference/pm2io.md %}) to master all the capabilities of PM2 Plus.

<a id="best-practices-metrics-glossary"></a>
# Metrics Glossary

This glossary is an exhaustive list of all metrics recorded by PM2 Plus. Understand what a metric stands for and how it is computed will avoid you to draw conclusions too quickly.   

Note that each metric always describes the state of a specific application on a specific server. You may find some cross server metrics on the dashboard, to suggest on which application you could use the profiling for example, but in most cases, metrics are application and server specific.

## CPU Usage

The CPU usage is the amount of time the CPU is busy. A CPU only can handle one operation at a time and so is either busy or idle.

Unit: %  
Range of values: 0 - 100

## Memory Usage

The memory usage is the total amount of memory used by the application.  

Unit: Megabytes (MB)  
Range of values: 0 - total memory of the server

## Issues

The number of new issues recorded in the app.

## Number of restart

The number of restart of your application since added to the PM2 process list. PM2 automatically restarts your application whenever needed, for example after an uncaught exception has happened.

## Number of processes

The number of cluster on which your app has been spread on the server. Only PM2 clusters appear. 

## HTTP Requests per Minutes

Unit: Number of requests / minutes

## Loop Delay

Unit: milliseconds (ms)
Range: 0 - less than 100ms

The time the Node.js event loop takes to complete a loop.

## Active Handles

Handles represent long-lived objects capable of performing certain operations while active. Some examples:

- A prepare handle gets its callback called once every loop iteration when active.
- A TCP server handle that gets its connection callback called every time there is a new connection.

## Active Requests

Requests represent short-lived operations. These operations can be performed over a handle: write requests are used to write data on a handle; or standalone: getaddrinfo requests don’t need a handle they run directly on the loop.

## Node.js Memory

## New space used size

## Old space used size

## Map space used size

## Code space used size

## Large object space used suze

## Heap size

## Heap size executable

## Used heap size

## Heap size limit

## Garbage Collector

## GC heap size

## GC executable heap size

## GC used heap size

## GC type

## Gc Pause

<a id="best-practices"></a>
# Monitoring Best Practices

This section gathers best practices to make your app scalable from the beginning.

- [Metrics Glossary]({{ site.baseurl }}{% link docs/plus/best-practices/metrics-glossary.md %})
- [CPU Profiling]({{ site.baseurl }}{% link docs/plus/best-practices/cpu-profiling.md %})

<a id="best-practices-cpu-profiling"></a>
# CPU Profiling

PM2 Plus comes with a ready to use CPU profiling tool. All your servers can be profiled directly from your web dashboard. The visualisation tools then help you to visualize and interpret the results in order to improve your app's performance. The profiling files can also be downloaded to be inspected later in the chrome development tool.

## Why CPU Profiling?

The CPU profiling helps you diagnose the way your server's CPU is used. The CPU is a central part in every computer, responsible for interpreting and executing almost every command and sometimes compared as the computer's "brain".

The more a web server needs to execute backend code, the more it needs a consequent CPU power. In a static content web server, there is not much to compute: only few things are done in the backend. In the case of a web API, on the other way, there is only backend code: the CPU is thus a key factor to expect high performance.

In term of CPU, beside getting the highest CPU power as possible, the only way to improve your API performance is by optimizing your code. The CPU profiling indeed offers the ability to investigate how CPU is used across functions in your code. Once the bottlenecks are identified, you are ready to take action.

## Data Collection

How does CPU profiling work?

The first thing to understand is that a CPU can only handle one operation at a time and is either busy or idle. The CPU usage (%) is the amount of time the CPU is busy for a period of time. The goal of the profiler is to record all invoked functions when the cpu is busy and how long CPU spends time for each.

A first approach is the so called "instrumentation". This method inserts a piece of code that counts number of calls and records execution time of functions. The downside of this method is its heaviness. It affects a lot the code execution and even if it is precise, it's problematic in a live web server context.

An other approach is the "sampling". In this method, the profiler interrupts the code execution at specific intervals and records the stack trace each time. Not every call are thus recorded, but after enough time, results are relevant. The greatest benefit is that it almost doesn’t affect the code execution and can be used in a production environment.

Some profilers uses an hybrid approach. They instrument code only to count number of calls (a cheap operation) and use sampling to measure function execution time.

The PM2 Plus profiler uses the sampling approach.

## Data Representation

Once collected, such a large amount of data needs to be organized in a way that allows analysis and which puts forward problems. Here are three common ways to handle CPU profiling results.

CPU time is also represented as a percentage of the thread’s total time during that recording.

### The Top Down View

The Top Down View displays a list of method calls where expanding a method node displays the method that have been called inside of it, this methods are the callees.

The following information are often given to describe CPU time spent on each method call (times are a percentage of the thread’s total time over the duration of the selected time frame):

- Self time: the amount of time the method call spent executing its own code and not that of its callees.
- Children time: the amount of time the method call spent executing its callees and not its own code.
- Total time: the sum of the method’s Self time and Children time. This represents the total amount of time the app spent executing a method call.

### The Bottom Up View

The Bottom Up View displays a list of method calls where expanding a method’s node displays who has called it, its callers.

The Bottom Up View is useful for sorting methods by those that consume the most (or least) CPU time. Each node can be inspected to determine which callers spend the most CPU time invoking those methods. Compared to the top down tree, timing info for each method in a bottom tree is in reference to the method at the top of each tree (top node).

### The Flame Graph

![flame graph]({{ site.baseurl }}{% link img/plus/flame-graph.png %})

Each box in the flame graph represents a function in the stack.

- The y-axis shows stack depth. The top box shows the function that was on-CPU. Everything beneath that is ancestry. The function beneath a function is its parent, just like the stack traces shown earlier.
- The x-axis spans the sample population. It does not show the passing of time from left to right, as most graphs do. The left to right ordering has no meaning (it is alphabetical order).
- The width of the box shows the total time it was on-CPU or part of an ancestry that was on-CPU (based on sample count). Functions with wide boxes may consume more CPU per execution than those with narrow boxes, or, they may simply be called more often. The call count is not shown (or known via sampling).
- The sample count can exceed elapsed time if multiple threads were running and sampled concurrently.
- The colors aren't significant, and are usually picked at random to be warm colors (other meaningful palettes are supported). This visualization was called a "flame graph" as it was first used to show what is hot on-CPU, and, it looked like flames. It is also interactive: mouse over the SVGs to reveal details, and click to zoom.

<!--

## How to interpret the results?

Let's dive into how to interpret the CPU profiling in order to speed up your code. The following cases are detectable by profiling paired with source code analyzis:

- an individual heavy function (e.g. a sorting function);
- excessive usage of a library function (e.g. of a memory copying function);
- repeatedly appearing sequence of function calls.

For finding an individual heavy function, a flat view is enough. Sort it by self weight in decreasing order, and such functions will bubble up to the top. Especially if their total weight is close to self weight (this means they do all the work by themselves), they are good candidates for optimization. This method works well both for recursive and non-recursive functions.

If a hot function can’t be optimized by itself (e.g. this is a library function), a bottom up view is helpful to look at its callers. Get the caller with the most weight (that is, the one that calls the function most frequently), and look up in the source code why it makes an excessive usage of the function. It often appears, that a result of function’s call can be cached, or maybe there is a more effective way of doing the same thing that doesn’t require calling the function at all.

Sorting a flat view by total weight in decreasing order and secondary by self weight can also reveal functions that inadequately cause heavy processing. Consider an example: let’s say we see a function `top5′ which has big total weight, but small self weight. Now we are looking at its callees in the top down view, and see that `top5’s time is mostly occupied by a call to `qsort’. Looking at `top5′ source we see that this call is redundant, because finding top 5 array items can be done using a single linear scan, without a need to sort an array.

A call graph view can actually be used in all of these cases, especially if it can be adjusted to highlight nodes and edges based on their weights. The only problem of a call graph, as I said, is that it can be big, so good scalable approach to viewing it is required.

But a call graph really shines when one wants to find a repeatedly appearing sequence of function calls. As every program’s function has exactly one corresponding node (unlike a tree view), and edges have weights, it is relatively easy to detect expensive sequences. After finding them and looking through functions’ code it is often seems that data calculated by a function is often used only partially or even thrown away by a caller (this happens when programs are built from big reusable `universal’ functions). Crafting a specialized version of a function that doesn’t perform unneeded calculations can speed up a program dramatically. -->

<a id="best-practices-memory-profiling"></a>
# Memory Profiling

Article available soon.

<!-- Profiling files can also be downloaded and inspected later in the chrome development tool.

## Why Memory Profiling?

The Memory profiling is a tool that help you understand how memory is managed in your application. .

High level language like Javascript use garbage collector to free the unused memory. Sometimes, it is not obvious for the garbage collector that some memry can be

## Data Collection

How does Memory profiling work?


## Data Representation -->

<a id="best-practices-transaction-tracing"></a>
# Transaction Tracing

Article available soon.

<a id="guide"></a>
# Guide

Follow this guide and get your Node.js app monitored by PM2 Plus in minutes!

## Terminology

Let's first explain some terminology we will use across this guide:

A **bucket** is an entity related to PM2 Plus which is associated to a billing plan. Buckets are generally used to group and monitor multiple servers of a single project.

A **server** is a container or a machine with a PM2 daemon managing one or more processes.

A **process** is an entity of the process list (`pm2 ls`). This is one instance of an app which has been started by PM2.

{: .btn-stylized}

<a id="guide-configuration"></a>
![pm2io](https://raw.githubusercontent.com/keymetrics/branding/master/logos/pm2ioAPM/io-white.png)

# Configuration

Your dashboard already comes with a lot of metrics without any configuration. But don't worry, you also can add predefined set of metrics or - even better - to create custom ones.

PM2 comes with the [@pm2/io](https://github.com/keymetrics/pm2-io-apm) module, which is a module that gathers the metrics displayed in `pm2 monit` or in the web dashboard. By default, it just wraps your app. If you however want to refine the configuration, add custom metrics or custom actions, you must require it in your code.

## Installation

With npm:

```bash
npm install @pm2/io --save
```

With yarn:

```bash
yarn add @pm2/io
```

## Intialisation

Load and initialize `@pm2/io` at the top level of your application, before any other `require`.

```javascript
const io = require('@pm2/io')

io.init({
  metrics: {
    network: {
      ports: true
    }
  }
})
```

This first basic initialisation will add to the dashboard the port number your app is listening to.

 See all intialisation options in the [@pm2/io reference]({{ site.baseurl }}{% link docs/plus/reference/pm2io.md %}).
{: .tip}

## Next Steps


[@pm2/io reference]({{ site.baseurl }}{% link docs/plus/reference/pm2io.md %})
{: .btn-stylized}

[Custom Metrics]({{ site.baseurl }}{% link docs/plus/guide/custom-metrics.md %})
{: .btn-stylized}

<a id="guide-cpu-profiling"></a>
# Overview

![cpu profiling]({{ site.baseurl }}{% link img/plus/cpu-profiling.png %})

The CPU profiling tool helps you better understand how CPU is used with your application.

PM2 Plus makes remote CPU profiling of your production servers possible through the interface.

## How to use

In order to use the CPU profiling, you must first [install the profiling tool]({{ site.baseurl }}{% link docs/plus/guide/installation.md %}#install-cpumemory-profiling).

For CPU profiling, you decide how long you want to record.

It gets you a visualisation of the stack and still offer the ability to download the CPU profiling file.

## Next Steps

[Modules]({{ site.baseurl }}{% link docs/plus/guide/modules.md %})
{: .btn-stylized}

<a id="guide-installation"></a>
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

<a id="guide-memory-profiling"></a>
# Memory profiling

![memory profiling]({{ site.baseurl }}{% link img/plus/memory-profiling.png %})

Profiling tools help you diagnose memory issues in your application.

PM2 Plus allows you to take remote heap memory snapshots of your production servers and provide you visualization tools.

## Memory profiling

In order to use the memory profiling, you must first [install the profiling tool]({{ site.baseurl }}{% link docs/plus/guide/installation.md %}#install-cpumemory-profiling).

Click to take a heapdump and download the file. It may take some time depending on the weight of the heap file.

Inspect with the Google Chrome developer tool into the Profiles tab (**Load** button).

### Tracking memory leaks

To track memory leak you will need to compare multiple heapdump files to see which element is increasing over time.

To know more about memory analysis check the [google tutorial](https://developer.chrome.com/devtools/docs/heap-profiling).

## Next Steps

[CPU Profiling]({{ site.baseurl }}{% link docs/plus/guide/cpu-profiling.md %})
{: .btn-stylized}

<a id="guide-memory-snapshot"></a>
# Overview

![memory snapshot]({{ site.baseurl }}{% link img/plus/memory-profiling.png %})

This feature help you diagnose memory issues in your application.

PM2 Plus allows you to take remote heap memory snapshots of your applications and provide you visualization tools.

**WARNING**: There are few bugs in V8 (the engine that runs the javascript in Node.js) that can impact your applications when you are doing a memory snapshot. Specially if you use it in applications with large memory (>800MB of RAM). You should avoid running it in those cases.

## How to use

In order to use the memory snapshot, you must first [install the snapshot tool]({{ site.baseurl }}{% link docs/plus/guide/installation.md %}#install-cpumemory-profiling).

Click to take a heapdump and download the file. It may take some time depending on the weight of the heap file.

Inspect with the Google Chrome developer tool into the Profiles tab (**Load** button).

### Tracking memory leaks

To track memory leak you will need to compare multiple heapdump files to see which element is increasing over time.

To know more about memory analysis check the [chrome devtools tutorial](https://developer.chrome.com/devtools/docs/heap-profiling).

## Next Steps

[CPU Profiling]({{ site.baseurl }}{% link docs/plus/guide/cpu-profiling.md %})
{: .btn-stylized}

<a id="guide-transaction-tracing"></a>
# Transaction tracing

![transaction tracing]({{ site.baseurl }}{% link img/plus/tracing.png %})

The transaction tracing is useful to troubleshoot performance issues and get detailed low-level insight of how your app is working.

Slow HTTP calls are identified and the database and external calls are aggregated to understand why.

## Enable the transaction tracing

The transaction tracing is disabled by default. On big infrastructure, you should only use the transaction tracing for a few days to collect informations and then disable it because there is no sampling and all requests are treated.

You'll have to wait 10min to let PM2 Plus collects enough data.

### @pm2/io

Enable the transaction tracing via the `@pm2/io` module.

```javascript
const io = require('@pm2/io')

io.init({
  transactions: true // will enable the transaction tracing
  http: true // will enable metrics about the http server (optional)
})
```

### PM2 CLI

When the transaction tracing is enabled, you'll see a clock on the side of the process in the process list (`pm2 ls`).

Enable with:

```bash
pm2 reload <app_name> --trace
```

Disable with:

```bash
pm2 reload <app_name> --disable-trace
```

## Transaction tracing dashboard

### Latency graph

Under the graph you can select which values you want drawn on the graph:
* The [median](https://en.wikipedia.org/wiki/Median) of the application tells you what an ordinary user can expect as a response time.
* P95 and P99 curves lets you explore the evolution of the slowest latencies of your application.
* The database latencies shows you how much time they consume in a standard request.

### Transaction list

You can sort the recorded path of your app according to:

* Most time consuming: Total time spent in this route for the whole application
* Slowest routes: Which routes take the most time
* Number of calls: how many calls are made to every route

### Transaction details and Variances

Some transactions have the same path but respond differently: a forbidden access on a route can return a 403 and be executed differently than usual. We call those **variances**: for each path we log up 5 most used variances that you can examine here.

Let's examine a specific variance:
* median, slowest and fastest call response time
* Metadata about the call
* List of registered subcalls. If no call to an external entity is made, nothing will appear here. The call display and information depends on the stack logged. For databases, you will for example see the database call made.

You can then click on another **variance** to examine why and how the behaviour was different.

## Under the hood

PMX will wrap below modules if they exist in your application:
 - `express` version 4
 - `hapi` versions 8 - 13
 - `restify` versions 3 - 4
 - `koa` version v1.x
 - Outbound HTTP requests using `http` core module
 - `mongodb-core` version 1 (used by mongoose)
 - `redis` versions 0.12 - 2
 - `mysql` version ^2.9
 - `pg` version ^6.x

Then record all requests made or received by them then sended to PM2 Plus to be aggregated.
The impact on performance should be low since there is no heavy logic done in your process except wrap modules and sending data.

## Things to know

- When received by PM2 Plus, transactions are aggregated depending on their path (so without the query), for example:
  - `/api/users/1` and `/api/users/2` will be aggregated together because PM2 Plus detected the `1` and `2` has identifier
  - `/api/users/search` and `/api/users/1` will not be aggregated together because `search` isnt a identifier

- PM2 Plus detect identifier with multiples regex:
  - UUID v1/v4 with or without dash (`/[0-9a-f]{8}-[0-9a-f]{4}-[14][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-f]{12}[14][0-9a-f]{19}/`)
  - any number (`/\d+/`)
  - suit of number and letter (`/[0-9]+[a-z]+|[a-z]+[0-9]+/`): this one is used by mongo for document id
  - most SEO optimized webdocss (articles, blog posts...): `/((?:[0-9a-zA-Z]+[@\-_.][0-9a-zA-Z]+|[0-9a-zA-Z]+[@\-_.]|[@\-_.][0-9a-zA-Z]+)+)/`

- This feature has some known problems with other modules:
  - `request-promise`: clears the node cache and requires a new clean version of the `http` module. To solve this, require `http` again after requiring `request-promise` to get the correctly wrapped `http` module.
  - `node-newrelic`: works as we do, so you might encounter problems with it.

## Next Steps

[Memory snapshot]({{ site.baseurl }}{% link docs/plus/guide/memory-snapshot.md %})
{: .btn-stylized}

<a id="integration"></a>
# Integration

This section will help you integrate PM2 Plus.

Pick the tutorial that best matches your needs:

- [AWS Elastic Beanstalk]({{ site.baseurl }}{% link docs/plus/integration/elastic-beanstalk.md %})
- [Docker]({{ site.baseurl }}{% link docs/plus/integration/docker.md %})
- [Heroku]({{ site.baseurl }}{% link docs/plus/integration/heroku.md %})
- [With a Cloud Provider]({{ site.baseurl }}{% link docs/plus/integration/cloud-providers.md %})

<a id="integration-cloud-providers"></a>
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

<a id="integration-docker"></a>
# Monitor your Node.js app in a Docker container

In seconds, this tutorial will show you how to monitor a Node.js application with PM2 Plus inside a container.

We assume that your app has already been wrapped with PM2. If not, follow the [PM2 Docker Tutorial]({{ site.baseurl }}{% link docs/runtime/integration/docker.md %}).

## Create an account

Register [here](https://id.keymetrics.io/api/oauth/register).

## Install the profiler

Add this to your Dockerfile to install the profiler:

```Dockerfile
RUN pm2 install profiler
```

## Link your app with PM2 Plus

In order to connect PM2 to the dashboard, you need to add your public and private keys in the environment.

Create a .env file with:
```.env
PM2_SECRET_KEY=XXXXX
PM2_PUBLIC_KEY=YYYYY
```
and restart your container with `docker run`adding `--env-file .env` to load the environment variables.

## Set the server name in PM2 Plus

Set the `PM2_MACHINE_NAME` environment variable to specify a server nam. Add this to the .env file:

```.env
PM2_SECRET_KEY=XXXXX
PM2_PUBLIC_KEY=YYYYY
PM2_MACHINE_NAME=docker-server
```

 The default server name is the hostname (`HOST` environment variable) with a random string.
{: .tip}

 Be careful, in case of duplicate hostnames the dashboard will receive data from both instances and flicker.
{: .tip}

## Next Steps

Complete your dashboard [configuration]({{ site.baseurl }}{% link docs/plus/guide/configuration.md %}).

<a id="integration-elastic-beanstalk"></a>
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

<a id="integration-heroku"></a>
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

<a id="faq"></a>
# FAQ & Troubleshooting

## Process-based pricing

<details>
<summary markdown="span">What is a process?</summary>
A process represent one Node.js application instance. For example let's say you have one API application that is scaled across 4 servers, if there is only one instance running on each server it will count as 4 servers * 1 process = 4 processes.
</details>

<details>
<summary markdown="span">What is a server?</summary>
A server represents one linked PM2 instance. You can have as much server as you want, only the total number of processes is taken into account for the pricing.
</details>

<details>
<summary markdown="span">How does the pricing works?</summary>
If you have a pro_8 plan, you can have 8 processes monitored.

You can have 8 servers with 1 process on each or 1 server with 8 processes. Only the sum of all processes monitored is taken into account.
</details>

<details>
<summary markdown="span">How does a clustered application get priced?</summary>
When you use the cluster mode (with `pm2 start -i max`) each instance is counted as a process and the same rule is applied. If you start 4 instances of the same application, 4 processes are counted.
</details>

<details>
<summary markdown="span">How to disable monitoring for a specific process?</summary>
You can then use the command `pm2 unmonitor [APP_NAME|ID]` to stop monitoring a process with PM2 Plus.
`pm2 ls` will display a red dot indicating the application will not be monitored by PM2 Plus.
If you want to monitor the process again use `pm2 monitor [APP_NAME|ID]`.
</details>

<details>
<summary markdown="span">Do pm2-logrotate and pm2-auto-pull count has paying processes?</summary>
No, these two modules are free and are not counted has paying processes.
</details>

## Connectivity Issues

<details>
<summary markdown="span">Re link your PM2</summary>
Re-Run `pm2 link` on your server and refresh your browser.
</details>

<details>
<summary markdown="span">How to pass through firewall? (IP whitelisting & Ports)</summary>
  
Starting from PM2 3.2, we changed the networking connection by using a direct Websocket connection to our server on the port 443, so you only need OUTBOUND on port 443 TCP open. If you are using an older version, we of course advise to update but the ports that you need to open are 3900 (TCP outbound), 443 (HTTPS outbound) and 43554 (TCP outbound), so verify everything is allowed on your firewall.

You also may need to whitelist IPs, please allow those listed here: [https://ips.cloud.pm2.io](https://ips.cloud.pm2.io)
</details>

<details>
<summary markdown="span">Have you upgraded to the lastest PM2 available?</summary>
[Updating PM2](/docs/runtime/guide/installation/#update)
</details>

## Dashboard Issues

<details>
<summary markdown="span">Servers are blinking/flickering?</summary>
Make sure that each PM2 runtime has a different name when linking to PM2 plus via:

```
$ pm2 plus xxxx yyyy [SERVER_NAME]
````

Also make sure you have only one PM2 instance launched `ps -ax | grep PM2`
</details>

## Security & Data Transfer

<details>
<summary markdown="span">What information is sent from PM2 runtime to PM2 plus?</summary>
- **Process**: pm_id, pid, app name, restart_time, created_at, watch mode, uptime, cpu, memory, NODE_ENV, versioning informations, custom actions, custom metrics
- **Server**: Hostname, internal ip, server_name, load average, free mem, used mem, cpu infos, username, platform, pm2_version, pm2_agent_version, node version
</details>

<details>
<summary markdown="span">How is the data transfered from PM2 runtime to PM2 plus?</summary>
Data is ciphered while transfered into network (HTTPS and AES256). Data stored in database is normalized but each bucket has his own database (with database name ciphered).
</details>

<details>
<summary markdown="span">What is the PM2 plus credit card processor?</summary>
We use Stripe as our payment system, we never store any informations about credit cards used on PM2 plus.
</details>

## Billing and settings Issues

<details>
<summary markdown="span">How to transfer ownership of a bucket?</summary>
To Transfer ownership, you must create a free account with the next owner email and add credit card details.

Then with the current owner email, you must connect to the concerned bucket and in the Settings menu, in General, you must click on the Action TRANSFER OWNERSHIP and enter the next owner email.

The new owner will be notified by email and the bucket will be from now on locked to his email and credit card details as the owner.
To fix this:

```
# Server 1
$ pm2 link <private_id> <public_id> server1

# Server 2
$ pm2 link <private_id> <public_id> server2
```
</details>
