---
layout: docs-io
title: PM2 Enterprise Documentation
description: "The complete PM2 Enterprise documentation on a single page: on-premise installation, collectors, distributed tracing, frontend monitoring, alerting and dashboards."
section: enterprise
permalink: /docs/pm2-enterprise/
---

<a id="overview"></a>
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

<a id="guides-distributed-tracing"></a>
# Overview

![Dashboard](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/enterprise/distributed_tracing/distributed_tracing.png)

The Distributed Tracing allows to captures and propagates distributed traces through your system, allowing you to visualize how customer requests flow across services, rapidly perform deep root cause analysis, and better analyze latency across a highly distributed set of services.

## Modules Traced Automatically

These modules are automatically traced:

 - HTTP `http` outgoing requests
 - HTTPS `https` outgoing requests
 - HTTP2 `http2` outgoing requests
 - MongoDB with `mongodb-core` version 1 - 3
 - Redis with `ioredis` versions > 2.6 or `redis` versions > 2.6
 - Mysql with `mysql2` version 1 - 3 or `mysql` version 1 - 3
 - PostgreSQL with `pg` version > 6
 - Vue.js with `vue-server-renderer` version 2
 
# How to use it

## Using PM2

First make sure you are using an up-to-date version of pm2 (version > `3.4.0`).
Then you can just run the following command to enable the tracing:

```bash
$ pm2 reload myapp --trace
```

To disabled the tracing:

```bash
$ pm2 reload myapp --disable-trace
```

If you want to customize the configuration, you can install `@pm2/io` module in your package.json. See bellow.

## Using the @pm2/io module

You can use the `@pm2/io` module to customize the transaction tracing configuration:

```javascript
const io = require('@pm2/io').init({
  tracing: {
    enabled: true,
    
    // will add the actual queries made to database, false by default
    detailedDatabasesCalls: true,
    // if you want you can ignore some endpoint based on their path
    ignoreIncomingPaths: [
      // can be a regex
      /misc/,
      // or a exact string
      '/api/bucket'
      // or a function with the request
      (url, request) => {
        return true
      }
    ],
    // same as above but used to match entire URLs
    ignoreOutgoingUrls: []
  }
})
```

By default we ignore specific incoming requests (you can override this by setting `ignoreIncomingPaths: []`):
- Request with the OPTIONS or HEAD method
- Request fetching a static ressources (`*.js`, `*.css`, `*.ico`, `*.svg`, `.png` or `*webpack*`)

## Custom Tracing API

The custom tracing API can be used to create custom trace spans. A span is a particular unit of work within a trace, such as an RPC request. Spans may be nested; the outermost span is called a root span, even if there are no nested child spans. Root spans typically correspond to incoming requests, while child spans typically correspond to outgoing requests, or other work that is triggered in response to incoming requests.

### How does it work?
Here is a simple example to create a custom trace:

```js
const io = require('@pm2/io').init({ tracing: true })
const tracer = io.getTracer()

function main() {
  // 4. Create a scoped span, a scoped span will automatically end when closed.
  tracer.startRootSpan({name: 'main'}, rootSpan => {
    for (let i = 0; i < 10; i++) {
      doWork(i);
    }

    // 6b. End the spans
    rootSpan.end();
  });
}
```

### Using the Tracer
To start a trace, you first need to get a reference to the `Tracer` (3). It can be retrieved as a global singleton.
```js
const tracer = io.getTracer()
```

### Create a span
To create a span in a trace, we used the `Tracer` to start a new span (4). A span must be closed in order to mark the end of the span.
```js
// 4. Create a scoped span, a scoped span will automatically end when closed.
tracer.startRootSpan({name: 'main'}, rootSpan => {
  for (let i = 0; i < 10; i++) {
    doWork(i);
  }

  rootSpan.end();
});
```

### Create a child span
The `main` method calls `doWork` a number of times. Each invocation also generates a child span. Take a look at the `doWork` method.
```js
function doWork() {
  // 5. Start another span. In this example, the main method already started a span,
  // so that'll be the parent span, and this will be a child span.
  const span = tracer.startChildSpan('doWork');
  span.start();

  console.log('doing busy work');
  for (let i = 0; i <= 40000000; i++) {} // short delay

  // 6. Annotate our span to capture metadata about our operation
  span.addAnnotation('invoking doWork')
  for (let i = 0; i <= 20000000; i++) {} // short delay

  span.end();
}
```

### End the spans
We must end the spans so they becomes available for exporting.
```js
// 6a. End the spans
span.end();

// 6b. End the spans
rootSpan.end();
```

### Create an Annotation
An [annotation](https://opencensus.io/tracing/span/time_events/annotation/) tells a descriptive story in text of an event that occurred during a span’s lifetime.
```js
// 6. Annotate our span to capture metadata about our operation
span.addAnnotation('invoking doWork')
```

### Tracing Instance Options

```javascript
io.init({
  tracing: {
    /**
    * Enabled the distributed tracing feature.
    */
    enabled: boolean
    /**
    * If you want to report a specific service name
    * the default is the same as in apmOptions
    */
    serviceName?: string
    /**
    * Generate trace for outgoing request that aren't connected to a incoming one
    * default is false
    */
    outbound?: boolean
    /**
    * Determines the probability of a request to be traced. Ranges from 0.0 to 1.0
    * default is 0.5
    */
    samplingRate?: number,
    /**
    * Add details about databases calls (redis, mongodb, mysql etc)
    */
    detailedDatabasesCalls?: boolean,
    /**
    * Ignore specific incoming request depending on their path
    */
    ignoreIncomingPaths?: Array<IgnoreMatcher<httpModule.IncomingMessage>>
    /**
    * Ignore specific outgoing request depending on their url
    */
    ignoreOutgoingUrls?: Array<IgnoreMatcher<httpModule.ClientRequest>>
  }
})
```

## Vocabulary

A trace is a tree of spans. It is a collective of observable signals showing the path of requests through a system.
This is an example of what a trace looks like:

<img src="https://opencensus.io/img/trace-trace.png" alt="Trace" width="700">

Above, you can see a trace with various spans. In order to respond to /messages, several other internal requests are made. Firstly, we check if the user is authenticated. Next we check if their messages were cached. Since their message wasn’t cached, that’s a cache miss and we then fetch their content from MySQL, cache it and then provide the response containing their messages.

A span may or may not have a parent span:
 - A span without a parent is called a “root span” for example, span “/messages”
 - A span with a parent is called a “child span” for example, spans “auth”, “cache.Get”, “mysql.Query”, “cache.Put”

## Requirements

In the following documention, we assume that you already have connected your application to PM2 Enterprise (either on-premise or cloud).
Also there are different requirements depending on the runtime you are using:
  - NodeJS: 
    - You must at least use node `6.0.0`.
    - If you use PM2, be sure that its version is above `3.4.0`
    - If you use the standalone agent, the `@pm2/io` version should be above `4.1.1`
  - Golang: 
    - You must at least Golang `1.8`

Of course in any cases, we advise to use the latest version since they improved the suppot for tracing a lot recently.

If you are interested, there are more documentation in the NodeJS APM readme there:

[Go the NodeJS Agent](https://github.com/keymetrics/pm2-io-apm#distributed-tracing)
{: .btn-stylized}

### Golang

Please directly see the documentation of the Golang agent available in it's readme there:

[Go the Golang Agent](https://github.com/keymetrics/pm2-io-apm-go#distributed-tracing)
{: .btn-stylized}

## Common Questions/Issues

* The UI miss some graphic to have an historical view of latency

  We agree and we are open to any feedback for visualization or amelioration for the issue, please use the feedback buttom at the top-right of the application.

* It fail to capture request with my application

  Please launch your application with the debug log of the apm with the env var `DEBUG=axm:tracing`, and send us the logs with a support ticket (available at the bottom left of the application or at tech@keymetrics.io)

<a id="guides-profiling"></a>
# Overview

The profiling feature is a key feature that allow you to profile your applications at runtime. By profiling, we mean recording what's your application is doing, either in term of cpu or memory, for that we have three profilers availables:
 - CPU Profiler: Record how much time is spent in each function of your application
 - Heap Profiler: Track heap allocation made by each function of your application

The power of both of the profilers are that **you can profile your application remotely, without cost, straight in production. You don't need to reproduce the problem in development anymore to pinpoint a memory leak for exemple.**

All profiles are stored on our sides so you can easily access to them.

## CPU Profiling

Interface to select which process to monitor:
![Dashboard](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/enterprise/cpu_profiling/ready.png)

Debugging interface to detect slow functions:
![Dashboard](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/enterprise/cpu_profiling/view.png)

Your application is using a lot of CPU in production but you don't know why. You could try to modify your code in production but you don't want to do that because it's production. You could also try to replicate the issue in development but it's really difficult to get the same traffic as in production.

Here the CPU profile comes in and allows to know which function is using the CPU, you just link your application with PM2 Enteprise and select it when you want to profile it.

Note that if the CPU Profile report a large amount of usage is done in the `garbage collection`, you might want to use the heap profiling to know what's being allocated (and so what's need to be GC'd a lot)

## Heap Profiling

Interface to select which process to monitor:
![Dashboard](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/enterprise/heap_profiling/heap_profiling.png)

Debugging interface to inspect memory usage:
![Dashboard](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/enterprise/heap_profiling/view.png)

Almost the same case as the CPU profiler, you have a memory leak in production but it's hard to replicate in development.
You can rely on the heap profiler to tell you which function is allocating object.

## Requirements

In the following documention, we assume that you already have connected your application to PM2 Enterprise (either on-premise or cloud).

Note that we expect you to know a bit about how to read a allocation / cpu timeline.
You will be able to read the summary of a profile (because it just a list of functions with their cpu or memory usage) thought.

## Configuration

### Node.js

#### Starting from Node 10

When using Node 10, all profilers are available out of box without installing anything.

#### Node 8.X and 9.X

The profilers are available but you need to explicity enable them using the environement variable `FORCE_INSPECTOR` set to `1`.
You have different way to enable them:

```
FORCE_INSPECTOR=1 pm2 reload app --update-env
```

In a persistent way:
```
echo "FORCE_INSPECTOR=1" >> /etc/environment
source /etc/environment
pm2 reload app --update-env
```

Or you can add it either inside your `ecosystem.json` file or your docker file.

#### For older version (Node 4, 6, 7)

**NOTE:** We advise to use the latest version of Node.js to profile your applications since the profilers are native and a lot more stable.

You must have `g++` installed:

- For Linux, enter `sudo apt-get install build-essential`.
- For macOS, enter `g++` in terminal and then follow the instructions.

Then you must install the addon used to profile your application:
```bash
pm2 install profiler
```

Then reload your application to enable the profiler:

```bash
pm2 reload all
```

#### Configure

After installing everything needed, you can control if you want it available or not within your code using `@pm2/io`:

```js
const io = require('@pm2/io').init({
  // ...
  // your configuration, either standalone or with pm2
  // and then with this option you can control if the profiling
  profiling: true
})
```

### Golang

All profilers are availables by default for our golang agent.

## Best practices

### Heap Snapshot for Node.js

 Why is the Heap Snapshot not for production in Node.js?
  - Its blocking your whole application from running, since you don't want your heap to change while the snapshot is done.
  - It will double the amount of memory used by your application (since you are doing a copy of the memory), so care with OOM killer.
  - In specific condition, its known to be instable (mean it can crash your app):
    - If your application use more than 500M of RAM, the snapshot might crash the application (see https://bugs.chromium.org/p/chromium/issues/detail?id=768355 and https://bugs.chromium.org/p/chromium/issues/detail?id=768355)
    - In specific Node.js version, see this issue: https://github.com/Node.js/node/issues/23877

We are commited to fix the instability issue (note that the two first issue will always be there by design) but in the mean time we advise to only use the Heap Profiler in production.

### How to use?

In the UI, you need to select the process you want to profile in the heatmap selector (a process color depend of this cpu usage for the cpu profiler and memory usage for the memory profiler).

At this point you have two choices:
  - Automatically stop the profiling with the `timeout` box (it require a version `@pm2/io` above 2.3 for Node.js)
  - Start manually, wait yourself the amount of time and then stop manually the profiling.

In either way, we advise to profile your application for more than 20-30 seconds depending if it's heavy used or not. Since the profiler are running in parralel, it does't track everything (which is call profile sampling), so you need to wait for your application to actually do different things to see them appear on the profile.
Depending on the usage of the app, you might need to wait longer to see something interested in the profile (more than 5min).

## Questions / Answers

* Does it impact the performance of my application?

  Apart from the Heap Snapshot (both go & Node.js), all profilers run in parralel of your application, so your application isn't impacted.

* What is the Total and Self Time in the CPU Profile?

  The total time is the time spent in a specific function and all others functions that this function called. The self time is the opposite, only the time spent in a function without time spent by any functions that may have been called.

## Common Issues

* The Profiling returned an Timeout error !

  You need to check if the connection is working between the agent and PM2 Enterprise. Note that the profiling can sometimes fail for a number of reasons, please contact us if it's constantly failing for you.

<a id="guides-alerting"></a>
# Overview

![alerting](/img/alert.png)

The alerting engine of PM2 Enterprise allows you to set alerts on metrics and receive alerts, like it's possible with other monitoring solution.
However we do a somethings more, which intregrating with our APMs:

- You can trigger a profiling of any application (either the cpu or memory) that allows you to continuously profile your application, across release to increase performance or detect regression.
- You can run a function in your application (with the custom actions)
- You can ask PM2 to restart your application (with you use the pm2 agent)

You currently support 3 ways to be alerted:
- Slack
- Email
- Webhook

## Use cases

#### Be alerted when a metrics go above a threshold

The main use case of the feature is of course to alert you when metrics aren't normal.
A basic alert should looks like that:

- Create an alert
- Select the metric that you want to get alerted on
- Set the threshold
- Filter the app/server depending on which app you want to trakck
- Select an action to alert you that the threshold has been crossed (slack or email for ex.)
- Save it

#### Profile your application automatically

Given an example where you have a cpu spike in the night hours but doesn't know why, you can explose your code base to try to understand it.
You could also stay up late to run the profiling manually when the cpu spike.
 Or you could use the Alerting with the Profling to do that for you:

- Create an alert when the cpu usage goes above 70%
- Select as action the CPU Profile
- Set the duration at 30 secondes (should be enough)
- Select another action to alert you that the threshold has been crossed (slack or email for ex.)
- Save it

When you will receive a notification, just check in the CPU Profile panel, you should have your profile that have been stored for you. You can either download it or see it in the profiling inspector.

#### Restart your application if you know that somethings in wrong

Given an example where your app leaks memory but you don't have the time to inspect it right now. You can just ask PM2 to restart it with the Alerting:

- Create an alert when the memory usage goes above 500M
- Filter the app/server depending on which app you want to restart
- Select a PM2 action as action to perform
- Set the action name to `restart` or `reload`
- Select another action to alert you that the threshold has been crossed (slack or email for ex.)
- Save it

Your application will now be automatically restarted and you will receive an alert when it's done.

## Requirements

In the following documention, we assume that you already have connected your application to PM2 Enterprise (either on-premise and cloud).
We also assume that you know how custom metrics and customs actions works.

## Configuration

This feature allow to get alerted when a metric goes above a specific treshold that you configured.
You can configure different conditions to trigger the alert:
  - Metric: Choose the metric value that will be watched
  - Operator: Choose the operator that the value will be checked against (available: > < = <= =>)
  - Treshold: Choose the value to not go above or under
  - Window: Choose how much time we will use the compute the average from
  - Application Name: only trigger for application with a specific name
  - Server Name: only trigger for application that are in a specific server

When a alert is triggered, you can choose different `Actions` to run:

  - Send an email: Choose the people in your bucket to send the alert to
  - Send a slack message: Set the webhook URL used to post the message
  - Send a webhook: Set the URL used to post the message
  - Run a custom action: Trigger a custom action inside the application that triggered the alert
  - Run PM2 action: Trigger a PM2 action (restart, reload etc) on the process that triggered the alert
  - Profile CPU: You can ask the alerting to profile your application cpu usage, it will store the result for you to be able to inspect it later.
  - Profile Memory: You can ask the alerting to profile your application memory application, it will also be stored.

Note: You can add actions as much as you want, they will all be run. Note that they are all launched in parralel and don't respect any order.

## Common Questions

* If I choose a custom action, where will it be run?

  The alerting engine will send the custom action do all processes that have gone above the treshold automatically, you can't configure which process will receive it or not.

* I filter by the application name and i received multiples emails at the same time for the same name, how is that possible?

  If you have an application is on multiple server or even if the application is in cluster mode, you will receive an different alert for each process on every server that match the alert's condition.

* Can I do a specific query like in Graphana for example?

  No and currently we don't plan to make our engine more customizable.

## Common Issues

* It didn't trigger an alert when it should have done !

  The worker that check for metric that goes above a specific threshold use the `window` to compute the average, it may have been too big to get a average above the treshold, you should try lowering it. Note that the minimum window is `60` seconds.

<a id="guides-dashboard"></a>
# Overview

It's common in the devops culture to have a screen in your office that monitor the state your production apps.
This feature is actually that. It allows you to see what's going on in realtime so you detect faster any wrong behavior of your application.
We've recently added the possibility to add widget with historic data for any metrics.

## Use cases

#### Have an overview of what's happening

The main use case of this feature is of course to have an overview of all the important metrics of your app in one place, to avoid looking at multiple dashboards to have all the informations.

#### Detect error quickly

The dashboards can also help you detect faster issue if you have a screen constantly showing your dashboard, any developer can look at it and might see a wrong behavior at any time, even before the alerts comes if you have configured some.

## Requirements

In the following documention, we assume that you already have connected your application to PM2 Enterprise (either on-premise and cloud).
We also assume that you know how custom metrics works.

## Configuration

Since the feature is really just customization for your needs, there a no specific configuration to have. You need to evaluate what you want to see on your dashboard and configure each compoments to show you what you want.

## Common Questions

* Is there a way to show historic value of a metric?

  Yes, you need to use the "Metric line chart" widget which allows you to specify a timerange. Other widget are only in realtime.

* I need to show a metric in a specific way (one that isn't covered by one of your component)?

  We are totally open to implement other components, please contact us so we can discuss that !

## Common Issues

* It's slow on my PC

  The realtime dashboard can cost a lot depending on how much process you want to monitor in realtime, we are constantly looking to optimize our frontend, we advise to contact us so we can inspect the problem and find a solution.

<a id="guides-log"></a>
# Overview

This feature allow to store all of your application logs directly in PM2 Enterprise so you can retrieve them later to inspect them.
It take the standard output / standard error and forward them to our backend to be stored.

To use the feature, you need to configure that you want the logs of the application, **by default the logs aren't sended to our backend**

## Use cases

This feature is actually specific to your case, we don't currently offer a lot of value for your logs because most people prefer to handle logs in their end, with a ELK stack for exemple.

We advise mostly to use the log feature if you don't have a lot of requirements like parsing and extracting data from them. We only offer them to view them as string currently.

## Requirements

In the following documention, we assume that you already have connected your application to PM2 Enterprise (either on-premise and cloud).

## Configuration

#### Using an ecosystem

When using an ecosystem, you can tell to our Agent to forward all the logs using this configuration:

```js
{
  "apps": [
    {
      "name": "my-application",
      "script": "index.js",
      "broadcast_logs": true // set it to true
    }
  ]
}
```

#### Using an environment variable

When launching your app with the CLI, you can add an environment variable to tell our agent to forward the logs: 

```bash
BROADCAST_LOGS=1 pm2 reload app --update-env
```

You can also set it directly inside your dockerfile with the `ENV` instruction: 

```docker
FROM node:10-alpine

# add pm2
RUN npm install -g pm2 2> /dev/null

# broadcast all the logs
ENV BROADCAST_LOGS 1

# ....
# copy the files and install all the dependencies
# ....

CMD [ "pm2-runtime", "app.js" ]
```

#### Using the standalone agent

You only need to init `@pm2/io` with the `sendLogs` option set to `true` like this: 

```js
const io = require('@pm2/io').init({
  standalone: true,
  apmOptions: {
    publicKey: process.env.KM_PUBLIC_KEY,
    secretKey: process.env.KM_SECRET_KEY,
    appName: process.env.KM_APP_NAME,
    sendLogs: true
  }
})
```

#### Using the Golang agent

```go
pm2io.Notifier.Log("something about my application")
```

You may want to integrate with your logger framework, it's actually pretty easy, here is a exemple with Logrus: 

```go
package main

import (
  pm2io "github.com/keymetrics/pm2-io-apm-go"
  "github.com/sirupsdocs/logrus"
)

// HookLog will send logs to PM2 Plus
type HookLog struct {
  Pm2 *pm2io.Pm2Io
}

// HookErr will send all errors to PM2 Plus
type HookErr struct {
  Pm2 *pm2io.Pm2Io
}

// Fire event
func (hook *HookLog) Fire(e *logrus.Entry) error {
  str, err := e.String()
  if err == nil {
    hook.Pm2.Notifier.Log(str)
  }
  return err
}

// Levels for all possible logs
func (*HookLog) Levels() []logrus.Level {
  return logrus.AllLevels
}

// Fire an error and notify it as exception
func (hook *HookErr) Fire(e *logrus.Entry) error {
  if err, ok := e.Data["error"].(error); ok {
    hook.Pm2.Notifier.Error(err)
  }
  return nil
}

// Levels only for errors
func (*HookErr) Levels() []logrus.Level {
  return []logrus.Level{logrus.ErrorLevel}
}

func main() {
  pm2 := pm2io.Pm2Io{
    Config: &structures.Config{
      PublicKey: "myPublic",
      PrivateKey: "myPrivate",
      Name: "Golang app",
    },
  }

  logrus.AddHook(&HookLog{
    Pm2: pm2,
  })
  logrus.AddHook(&HookErr{
    Pm2: pm2,
  })
}
```

## Best practices

There not a lot of best practices for your logs since the feature is pretty basic, you cannot configure anything more than sending the logs or not.

## Questions / Answers

* Can i forward my logger to PM2 Enterprise? (in the case of winston in Node.js for example)
  
  No, we currently only support sending the `stdout` and `stderr` of the process, in the winston case just tell him to output to the console

* Do all agent support sending logs?
  
  We advise to check direclty in the documentation of each agent to verify if the logs are available or not.

* Can i search in those logs?
    
  You cannot search in all your logs for a specific string for now.
  The only search possible is when you already fetched the logs in the frontend, you can search **ONLY** in them (those in your browser).

## Common Issues

* I can't see any logs in PM2 Enterprise!

  You need to check if the connection is working between the agent and PM2 Enterprise, we advise to check the documentation of the agent you are using.

<a id="guides-webchecks"></a>
# Webchecks

![Webchecks](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/enterprise/webchecks/overview_multiple.png)

When monitoring your infrastructure, there are two paths: you can monitor from the inside or from the outside. The whole Enterprise product is mostly a monitoring tool that allows you to know what's happening inside. The Webcheck feature helps you monitor your applications from the outside.

It allows you to configure any endpoint to be checked by our workers. It can be a http, https or tcp application.
Of course like the alerting system, you are able to get alerted on few metrics like the latency of your application. You can also choose how and who will receive a notification.

You can get the details of a webcheck by clicking on the **zoom icon** at the top left of each webcheck, you will then be able to check all metrics value over time:

![Webchecks](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/enterprise/webchecks/overview_one.png)

## Use cases

### Verify Availability of your APIs

When providing API to your customers, you want to make sure they are available and not too slow. You can add a webcheck on specific routes and get alerted if they cross a specific threshold.

### Know how much time it takes for your web app to load

When creating a webcheck, you can enable the toggle the `Retrieve frontend metrics` which will load your endpoint in a chromium browser to verify the time it takes to be interactive and few other key metrics for your users.

## Requirements

In the following documentation, there are no specific requirements except that your endpoint need to be exposed to internet.

## Configuration

When creating a webcheck, there are 3 main parts about the configuration:

### General options

![Options](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/enterprise/webchecks/config_options.png)

Those options are required to be able to schedule a webcheck, here a quick list of what you can configure:
  - `Region` where we will be checking your endpoint from (we only offer 3 regions for now: EU, NA and India)
  - `Target`: The endpoint to check (hostname,port etc)
  - `Type`: it can be either `https`, `http` or `tcp`
  - `Retrieve Frontend Metrics`: If your endpoint is a web app (not an API), you can ask us to retrieve important metrics about it.
  - `Reponse Regex`: You can verify that the response contains the right content with a quick regex
  - `Check every`: By default we will check every minutes but you can slow it down if you want.
  - `Fail after`: Its the timeout, if we fail to connect to your endpoint after this duration, we will consider it as down.
  - `Retry` & `Interval`: In case of failure, you might want to retry to be sure thats its down and not a bug.

### Alerts options

![Alerts](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/enterprise/webchecks/config_alerts.png)

When checking your endpoint, our system will produce few metrics on which you can add alert on, here a list: 

**Note:** The `state` metric is the one thats representing the webcheck, if it's at 0, the webcheck failed, otherwise it's up.

Name| Unit | Available on type | Frontend metrics only | Description
---|---|---|---|---
state||http,https,tcp|false|The result of the webcheck is represented by the state metric, which can be either 0 or 1.
dns|ms|http,https|false|How much time it takes to fetch the dns record associated with the domain
httpCode||http,https|false|The actual HTTP code that the endpoint answer when the webcheck make a request.
latency|ms|http,https,tcp|false|Overall latency to receive the whole content of the answer (contains dns, tcp handshake etc)
ssl|ms|http,https|false|Time used to make the TLS handshake between the client and the server
tcp|ms|http,https,tcp|false|Time used to make the TCP handshake between the client and the server
ttfb|ms|http,https,tcp|false|How much time the client waited for the first byte of the request's content
firstMeaningfulPaint|ms|http,https|true|How much time the user waited to see website rendered in his browser
domInteractive|ms|http,https|true|How much time the user need to wait before interact in his browser
domProcessing|ms|http,https|true|Time used to process DOM by the browser
docsRendering|ms|http,https|true|Time used to render the docs from the ttfb

Like in the **Alerting** feature, you can setup a custom threshold depending on the metric.
By default we only send an alert when value cross the treshold (and not everytime it's above it), you can change it via the `Trigger` configuration of each alert.

### Actions options

![Actions](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/enterprise/webchecks/config_actions.png)

And finally, we allow you to configure exactly how you will receive an alerts for your webcheck.
Here the list of available way to be alerted:
  - Email
  - Slack
  - Webhook

If you insterested in more actions output (like Pagerduty), please contact us (sales@keymetrics.io)

## Common Questions

* Can i send different actions depending on the alert?

  No, we don't currently aim to implement this possiblity to keep the feature relatively simple.

* I want to have another metrics like 

  We are totally open to implement other components, please contact us so we can discuss that !

## Common Issues

* The overview is slow to load

  We are currently working on optimizing the fetching of metrics so it can be faster.

<a id="collector-go"></a>
# Overview

All PM2 tools are mostly written to suit Node.js applications, but sometimes you want to monitor other languages in your production environment.

That's why we build a agent for Golang, which is currently in **BETA**, that you can embed in your golang application, without installing anything else in your container.
Exactly the same as other monitoring providers, you just add a library, give it some secrets and everything is working !

**Disclamer**: This collector is in **BETA** which means there might still have some issues/bugs, so we strongly advise to test everything in a staging/development environment before pushing it into your production.

**Disclamer**: The golang runtime is of course different that Node.js so we didn't implement all the features availables for Node.js in the Golang agent, here are the list of the missing features:
  - Transaction tracing
  - Memory Profiling (you should use Memory snapshot for Golang)

## Requirements

We only tested our agent with Golang version above `1.10`, we might still be able to use with older versions but we will not support it.

## Installation

You need to import our library, called `pm2-io-apm-go`, that we use to add metrics into your code and enable other features.

```go
package main

import (
  "github.com/keymetrics/pm2-io-apm-go/services"
  "github.com/keymetrics/pm2-io-apm-go/structures"
)

func main() {
  // Create PM2 connector
  pm2 := pm2io.Pm2Io{
    Config: &structures.Config{
      PublicKey: "myPublic",    // define the public key given in the dashboard
      PrivateKey: "myPrivate",  // define the private key given in the dashboard
      Name: "Golang app",       // define an application name
    },
  }

  // Start the connection to PM2 Enterprise backend
  pm2.Start()
}
```

And that's it, your application will automatically connect to PM2 Enterprise when started.

## Best Practices

As said above, we are not heavy user of Golang ourselves so we don't have specific best practices to have in those cases, but we will happily add them if you have any.

## Configuration

You might want to tweaks the configuration of `pm2-io-apm-go` to add some metrics/actions or even broadcast the logs of your application.
Here are some examples of what you can do :

### Report an error
```go
pm2io.Notifier.Error(err)
```

If you want to panic, you can use `pm2io.Panic(err)` which will panic after sending the error to PM2 Enterprise.

### Send a log

```go
pm2io.Notifier.Log("something about my application")
```

You may want to integrate with your logger framework, it's actually pretty easy, here is a exemple with Logrus :

```go
package main

import (
  pm2io "github.com/keymetrics/pm2-io-apm-go"
  "github.com/sirupsdocs/logrus"
)

// HookLog will send logs to PM2 Plus
type HookLog struct {
  Pm2 *pm2io.Pm2Io
}

// HookErr will send all errors to PM2 Plus
type HookErr struct {
  Pm2 *pm2io.Pm2Io
}

// Fire event
func (hook *HookLog) Fire(e *logrus.Entry) error {
  str, err := e.String()
  if err == nil {
    hook.Pm2.Notifier.Log(str)
  }
  return err
}

// Levels for all possible logs
func (*HookLog) Levels() []logrus.Level {
  return logrus.AllLevels
}

// Fire an error and notify it as exception
func (hook *HookErr) Fire(e *logrus.Entry) error {
  if err, ok := e.Data["error"].(error); ok {
    hook.Pm2.Notifier.Error(err)
  }
  return nil
}

// Levels only for errors
func (*HookErr) Levels() []logrus.Level {
  return []logrus.Level{logrus.ErrorLevel}
}

func main() {
  pm2 := pm2io.Pm2Io{
    Config: &structures.Config{
      PublicKey: "myPublic",
      PrivateKey: "myPrivate",
      Name: "Golang app",
    },
  }

  logrus.AddHook(&HookLog{
    Pm2: pm2,
  })
  logrus.AddHook(&HookErr{
    Pm2: pm2,
  })
}
```

### Add a metrics

```go
// arguments are (in order): the name, the category and the unit
nbreq := structures.CreateMetric("Uptime", "process.uptime", "")
services.AddMetric(&nbreq)

// Goroutine who increment the value each second
go func() {
  ticker := time.NewTicker(1 * time.Second)
  for {
    <-ticker.C
    // change the value
    nbreq.Value++
  }
}()
```

### Add custom actions

An quick example would be to create an action, which when triggered, return the environment of the process:
```go
services.AddAction(&structures.Action{
  ActionName: "Get env",
  Callback: func() string {
    return strings.Join(os.Environ(), "\n")
  },
})
```

## Questions / Answers

* What are the performance cost of using this agent?

  Apart from the cpu/memory usage of the agent iself (sending data to our backend), there are no specific overhead (in javascript, you have overhead because of the way we implement the transaction tracing or some metrics)

* When will you support the transaction tracing in Golang?

  Yes. We started some research to implement that, the main goal would be to be able to trace both golang and Node.js together.

* Do you support routing the traffic from the agent thought a network gateway (or proxy)?

  Currently it's not the case but we plan to implement it. . Ask our sales team if you really need it.

## Common Issues

* I doesn't work when i launch my application !

  You might have some networking problem, first we of course advise to retry from a different environment to pinpoint where the problem come from.
  Next you should verify that you allow traffic to our servers, we only use the port 443 in OUTBOUND (which is simply a secure websocket connection).

<a id="collector-prometheus"></a>
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

<a id="collector"></a>
## Overview

When installing PM2 Enterprise, you need to choose how you want to fetch monitoring data. We have multiples way to "collect" the data:

- PM2 itself embed a agent, which is the default way used by most of our clients: [checkout there]({{ site.baseurl }}{% link docs/enterprise/collector/pm2.md %})
- If you want to monitor a Node.js app without PM2 (usually used in containers), you can use our standalone Node.js agent: [checkout there]({{ site.baseurl }}{% link docs/enterprise/collector/standalone.md %})
- Use Golang in production? you can use our beta agent: [checkout there]({{ site.baseurl }}{% link docs/enterprise/collector/go.md %})
- You already have a Prometheus instance running? You can broadcast metrics from Prometheus to PM2 Enterprise: [checkout there]({{ site.baseurl }}{% link docs/enterprise/collector/prometheus.md %})

<a id="collector-pm2"></a>
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

<a id="collector-standalone"></a>
## Overview

When monitoring your production environment, you might not see the point of using a process manager in your container when you already use orchestrator like Kubernetes or Cloud based Orchestration (App engine for Google, Beanstalk for AWS etc).
And you are right, depending on your use case you might not need it.

But you still need the monitoring of PM2 Enterprise.

That's why we built a standalone agent, that you can embed in your Node.js application, without installing anything else in your container.
Exactly the same as other monitoring providers, you just add a library, give it some secrets and everything is working !


## Requirements

**This agent require at least Node 6** to run (you will be able to install the library anyway but it will throw an error if you configure it with `standalone: true` )

## Installation

You need to install our library, called `@pm2/io`, that we use to add metrics into your code and enable other features like the tracing or profiling.
Then you only need to `init` it like this:


```js
const io = require('@pm2/io').init({
  standalone: true,                       // mandatory
  apmOptions: {
    publicKey: process.env.KM_PUBLIC_KEY,   // define the public key given in the dashboard
    secretKey: process.env.KM_SECRET_KEY,   // define the private key given in the dashboard
    appName: process.env.KM_APP_NAME       // define an application name
  }
})
```

And that's it, your application will automatically connect to PM2 Enterprise when started, and all the metrics will be pushed.

## Best Practices

Since you might want to monitor your application in production or staging environment, we advise make a simple file at the root of your project, called `apm.js`:

```js
'use strict'

const io = require('@pm2/io').init({
  standalone: true,
  apmOptions: {
    publicKey: process.env.KM_PUBLIC_KEY,
    secretKey: process.env.KM_SECRET_KEY,
    appName: process.env.KM_APP_NAME
  }
  // ...
  // all custom configurations
  // ...
})
```

And only used when your are building your container image like this:

```docker
FROM node:10-alpine

# copy the files and install all the dependencies etc

CMD [ "node", "-r", "apm.js", "app.js" ]
```

You can note the `-r apm.js` when launching `node`, which will require the `apm.js` file before your app (which is really advised to make all features works as expected).

## Configuration

You might want to tweaks the configuration of `@pm2/io` to enable specific features, here you can see *most* the configuration possible (if you want all the list, [you should go there](https://github.com/keymetrics/pm2-io-apm#global-configuration-object)):

```js
const io = require('@pm2/io').init({
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
  profiling?: boolean = true
  }
  /**
   * Configure the transaction tracing options
   */
  tracing?: {
    /**
    * Enabled the distributed tracing feature.
    */
    enabled: boolean
    /**
    * If you want to report a specific service name
    * the default is the same as in apmOptions
    */
    serviceName?: string
    /**
    * Generate trace for outgoing request that aren't connected to a incoming one
    * default is false
    */
    outbound?: boolean
    /**
    * Determines the probability of a request to be traced. Ranges from 0.0 to 1.0
    * default is 0.5
    */
    samplingRate?: number,
    /**
    * Add details about databases calls (redis, mongodb)
    */
    detailedDatabasesCalls?: boolean,
    /**
    * Ignore specific incoming request depending on their path
    */
    ignoreIncomingPaths?: Array<IgnoreMatcher<httpModule.IncomingMessage>>
    /**
    * Ignore specific outgoing request depending on their url
    */
    ignoreOutgoingUrls?: Array<IgnoreMatcher<httpModule.ClientRequest>>
  },
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
     * Broadcast all logs from your application to our backend
     */
    sendLogs?: Boolean
    /**
     * Avoid to broadcast any logs from your application to our backend
     * Even if the sendLogs option set to false, you can still see some logs
     * when going to the log interface (it automatically trigger broacasting log)
     */
    disableLogs?: Boolean
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
})
```

## Questions / Answers

* What are the performance cost of using the standalone agent?

  It's actually the same as with PM2, because the `@pm2/io` is embed via PM2 in your application anyway. At the end, it depend of which features/metrics you are enabling, most of them have a really low overhead (< 5%)
  The biggest impact in performance is the `transaction tracing` which modify some libraries (express, mongodb etc) to be able to "trace" them, which depending on your application is between 5 to 20%.

* Do you support routing the traffic from the agent thought a network gateway (or proxy)?

  Currently it's not the case but we plan to implement it. . Ask our sales team if you really need it.

## Common Issues

* I doesn't work when i launch my application !

  You might have some networking problem, first we of course advise to retry from a different environment to pinpoint where the problem come from.
  Next you should verify that you allow traffic to our servers, we only use the port 443 in OUTBOUND (which is simply a secure websocket connection).

<a id="frontend-monitoring-install"></a>
# Frontend Monitoring installation

First, connect to your PM2 Enterprise dashboard.  Go to your bucket, and click on **Frontend** at the top of the docs.

![Frontend monitoring menu]({{ site.baseurl }}{% link img/enterprise/frontend-1.png %})

Fill in the small form, by giving your application a name (you will be able to create multiple applications within your dashboard), and listing the domains your application will be accessible from.  Make sure to put your main domain first.  Enable Webchecks if you want deeper metrics gathered from your main domain.

![Frontend monitoring wizard - form]({{ site.baseurl }}{% link img/enterprise/frontend-2.png %})

After submiting the form, the app will generate an HTML snippet.  Just copy and paste it in your Website, just before the `</body>` tag.

![Frontend monitoring wizard - snippet]({{ site.baseurl }}{% link img/enterprise/frontend-3.png %})

That's it! your Website is starting to be monitored by PM2, and you will see data incoming in realtime.

<a id="frontend-monitoring-overview"></a>
# Frontend Monitoring overview

Start monitoring your website frontend inside your PM2 dashboard.  This will allow collecting and inspecting:

* uncaught JavaScript exceptions experienced by your users
* users unexpected behaviors (rage clicks, rage reloads...)
* bad user experiences (slow requests...)

<a id="frontend-monitoring-snippet-api"></a>
# Frontend Monitoring snippet API

Once [installed](../install/), you will be able to configure how your Website is monitored via the
`apm` object.  The `apm` object is only accessible through the `pm2Ready` function exposed by the
snippet.

## `pm2Ready(callback)`

The callback function will be called when the PM2 APM will be ready (or immediately if it is already
ready).  The callback will receive the `apm` object as first argument.  Usage example:
```js
pm2Ready(apm => {
  apm.setMeta('user', user.email)
})
```

## `apm.setBucket(bucketId)`

Set your bucket id.  This will be used to authenticate and store the data transmitted by the browser
APM.

### `apm.setApplication(applicationName)`

Set your application name.  This will be used to authenticate and store the data transmitted by the
browser APM.

### `apm.setMeta(name, value)`

Attach a custom meta value to all data sent by the browser APM.  For example, this can be used to
identify the current logged-in user, or your application release version.  Example:

```js
apm.setMeta('user', user.email)
```

### `apm.removeMeta(name)`

Remove a meta from future data packets.

### `apm.addIgnoreURLRule(rule)`

Add a rule to ignore some URLs.  The `rule` parameter should be a function taking the string URL as
argument, and returning a boolean reflcting whether this URL should be ignored or not.

This is used in multiple ways:

* If the current docs location is ignored, no data will be collected at all.
* If an issue is caused by a script loaded from an ignored location, the issue won't be reported.
* This rule also applies to slow HTTP queries warnings.

Example:
```js
apm.addIgnoreURLRule(url => {
  // Ignores anything coming from Google Analytics
  return url.startsWith("https://www.google-analytics.com/")
})
```

### `apm.reportTimings()`

Automatically report various metrics from the current docs.  It will track the time your docs takes
to load, among other performance metrics.

### `apm.reportIssues(options)`

Automatically report unexpected issues triggered during the users sessions.  It will capture
uncaught JS exceptions to help you improve your user experience.

#### `options.recordSessions`

By default, the user session will be recorded to add some context to issues.  You will be able to
replay the last actions done by the user in your PM2 Enterprise dashboard.  To desactivate this
feature, pass `recordeSessions: false`.

You can configure how the session is recorded by passing an object to this option.  To prevent some
information from being recorded, you have two options:

* By default, an element with the class name `.pm2-block` will not be recorded. Instead, it will
  be seen as a placeholder with the same dimension.  You can change this class name by passing
  another one or a `RegExp` to `recordSessions.blockClass`.

* By default, an element with the class name `.pm2-ignore` will not record its input events.
  Password inputs will be ignored as default. You can change this class name by passing another
  one to `recordSessions.ignoreClass`.

Example:

```js
apm.reportIssues({
  recordSessions: {
    blockClass: 'my-block-class',
    ignoreClass: 'my-ignore-class'
  }
})
```

### `new apm.ZipkinLogger()`

Create a [Zipkin](https://zipkin.io/) logger to send distributed traces started from your website
frontend.  See the [zipkin-js
documentation](https://github.com/openzipkin/zipkin-js/blob/master/README.md) for further
informations.  Usage example:

```js
const tracer = new Zipkin.Tracer({
  ctxImpl: new Zipkin.ExplicitContext(),
  recorder: new Zipkin.BatchRecorder({
    logger: new apm.ZipkinLogger()
  }),
  localServiceName: 'service-a'
})
```

<a id="guides-transaction-tracing"></a>
# Transaction tracing

**Note : We have finished our new tracing solution which is now called the Distributed Tracing, we are now deprecating the old Transaction Tracing.**

[See the new Distributed Tracing]({{ site.baseurl }}{% link docs/enterprise/guides/distributed-tracing.md %})
{: .btn-stylized}


## Enable the transaction tracing

The transaction tracing is disabled by default. On big infrastructure, you should only use the transaction tracing for a few days to collect informations and then disable it because there is no sampling and all requests are treated.

You'll have to wait 10min to let PM2 Enterprise collects enough data.

### @pm2/io

Enable the transaction tracing via the `@pm2/io` module.

```javascript
const io = require('@pm2/io')

io.init({
  tracing: true // will enable the transaction tracing
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

As you can see in the UI, whe remove queries sensitive data by default. If you want to see the whole query:
  - You need to use the standalone agent (without pm2)
  - Add `PM2_APM_CENSOR_SPAMS=0` in your environment when launching your application.

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

<a id="on-premise"></a>


<a id="aws"></a>
# Deployment on Amazon Web Service

Documentation about how to deploy the PM2 Enterprise on-premise version on AWS

## Before Starting

## Requirements

In the following examples, we assume that you already have a fully working Terraform project. You can follow the [`Getting Started`](https://www.terraform.io/intro/getting-started/install.html) guide.

## Reference Architecture

By [default](https://github.com/keymetrics/on-premise/blob/master/terraform/keymetrics_aio_aws/variables.tf) the Terraform script will provision the following instances type:

- c4.xlarge for the PM2 Plus Backend
- r3.xlarge for the Elasticsearch Database
- t2.micro for the Redis Database
- t2.micro for the MongoDB Database

These instances type can be changed via the [custom terraform variable file](https://github.com/keymetrics/on-premise/blob/master/docs/AWS.md#2-set-the-module-variables)

## Setup steps

### 1. Adding the module to your terraform project

There's two options available in order to use our terraform module in your project.
- Link the module's git repository address in your terraform module definition
- Clone the repository and set the source variable of your module definiton to the correct path on your drive.

#### Without cloning the repository

When defining your module definition, use the following `source` value:
- `git@github.com:keymetrics/on-premise.git/terraform/keymetrics_aio_aws`

Example:

```
module "keymetrics" {
  source  = "git@github.com:keymetrics/on-premise.git/terraform/keymetrics_aio_aws"
  ...
}
```

#### By cloning the repository

Start by cloning the repository in your project directory using the git command:
- `git clone git@github.com:keymetrics/on-premise.git keymetrics-on-premise`

Define the `kemetrics` module using the relative path.
Example:

```
module "keymetrics" {
  source  = "keymetrics-on-premise/terraform/keymetrics_aio_aws"
  ...
}
```

### 2. Set the module variables

The variables are set inside the module definition and allow you to chose how the module is going to setup your infrastructe and which external services are going to be used.

Example of module with variables:

```
module "example_keymetrics_setup" {
  source  = "keymetrics_aio_aws"

  key_name = "admin"
  vpc_id = "vpc-xxxxxxxx"
  keymetrics_key = "...

  environment = "example"

  smtp_host = "smtp.mailgun.org"
  smtp_username = "postmaster@example.com"
  smtp_password = "XXX"
  smtp_sender = "keymetrics@example.com"

  public_host_address = "our-keymetrics-public-subdomain.example.com"
}
```

The following variables are available:
- **key_name**: [*Required*] The name of the SSH Public key to use.
- **vpc_id**: [*Required*] The id of the VPC hosting the EC2 Instances.
- **keymetrics_key**: [*Required*] PM2 Plus License Key.
- **environment**: [*Required*] The name of your environment (ex: `qa`, `prod`, `prod-1`, etc.).
- **smtp_username**: [*Required*] Username used to connect to the SMTP server.
- **smtp_password**: [*Required*] Password used to connect to the SMTP server.
- **smtp_host**: [*Required*] Hostname of the SMTP server.
- **smtp_sender**: [*Required*] Email address used to send emails.
- **internal_tld**: TLD used for internal DNS zone (ex: `lan`, `local`, `km`, etc)
- **public_host_address**: Public domain pointing to PM2 Plus HTTP Server (if empty, the public IP will be used).
- **mongodb_instance_type**: EC2 Instance type to use for MongoDB Instance.
- **elasticsearch_instance_type**: EC2 Instance type to use for ElasticSearch Instance.
- **redis_instance_type**: EC2 Instance type to use for Redis Instance.
- **backend_instance_type**: EC2 Instance type to use for Backend Instance.
- **make_backend_web_public**: If set to false, prevent the creation of a security group rule opening the port 80/tcp of the backend instance.

For more informations, please check the [`variables.tf`](https://github.com/keymetrics/on-premise/blob/master/terraform/keymetrics_aio_aws/variables.tf) file in the module

### 3. `Plan` and `Apply` your changes using the `terraform` command

Run `terraform plan -target=module.example_keymetrics_setup -out tfout` and make sure no error shows up in the logs.

You can then run `terraform apply tfout` in order to make terraform created the infrastructure on your AWS Account.

## Extra configuration depending of your own existing infrastructure

### Add a sub-domain pointing to PM2 Plus instance

By default, PM2 Plus instance is using an ElasticIP to be publicly available to its users. If you want to use it with a domain, you __first__ need to set `public_host_address` variable to the domain to use and then create a `A` record pointing to its public ElasticIP.

*__Warning: Once deployed with either the public IP or a domain, it's not possible to change it without fully dropping the mongodb database.__*

### Allow your apps to connect to PM2 Plus APIs

By default, PM2 Plus instance only accept connection on port `80/tcp` from `0.0.0.0/32`. In order to let your applications talk with the PM2 Plus backend, you need to allow their security groups to connected to PM2 Plus instance on port `3900/tcp`, `3010/tcp`, `4010/tcp` and `43554/tcp`.

To do so, you can use the module output value named `backend_securitygroup_name` as `security_group_id` of a Terraform [aws_security_group_rule](https://www.terraform.io/docs/providers/aws/r/security_group_rule.html)

Example:
```
module "example_keymetrics_setup" {
  source  = "keymetrics_aio_aws"
  ...
}

# Allow connection from
resource "aws_security_group_rule" "allow_port_3900" {
  type                     = "ingress"
  from_port                = 3900
  to_port                  = 3900
  protocol                 = "tcp"

  # Your application security group
  source_security_group_id = "sg-123456"

  # PM2 Plus Backend Security Group
  security_group_id = "${module.example_keymetrics_setup.backend_securitygroup_name}"
}

...
```

<a id="on-premise-baremetal"></a>
# Deployment on Baremetal Servers

Note that this tutorial is only made if you decided to deploy PM2 Enterprise On-Premise. If you use the Cloud based one you can just use it straight from https://app.pm2.io

## Requirements

Install Docker & Docker compose (minimum required version is 1.19.0) in your host machine:

```bash
$ sudo wget -qO- https://get.docker.com/ | sh
$ sudo curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
```

Then make sure you have logged-in on the hub to be able to pull the private images:

```bash
$ docker login
```

## Steps to Install

1. Get the docker-compose.yml file corresponding to your version:

```bash
$ wget https://raw.githubusercontent.com/keymetrics/on-premise/master/docker/docker-compose.yml
```

Once you have configured the `docker-compose.yml` file start it:

```bash
$ docker-compose up -d
```

Now connect to:

```bash
$ google-chrome http://server-ip/wizard
```

Set your License Key and configuration and youre done

## Update Procedure

Just run docker-compose up again and it will pull the latest backend image:

```bash
$ docker-compose pull km-api km-front
$ docker-compose restart km-api km-front
```

A downtime of around 30 seconds maximum will happen.

## FAQ

- *Backend cannot connect to Elasticsearch*: make sure you have a clean docker installation and there are no conflicting networks (docker networks)

- *Everything is started as expected but I cannot access the interface / I cannot link PM2*: Make sure you have set the right `KM_SITE_URL` because without a proper value PM2 agent will not be able to connect to the Backend

- *Do I loose the ES/Mongo data on restart?* No, by default, there are local volumes bound to the

- *I want to use specific version of mongodb/redis/elasticsearch, is this possible?* No, we currently support mongodb up to 3.4, redis 2/3/4 and elasticsearch 5.5.

<a id="on-premise-faq"></a>
# FAQ

## The register hang or don't redirect me to the application

You need to verify that the `KM_SITE_URL` you configured is the endpoint you use to connect to the frontend. If you modify it, you need to delete the mongodb database afterwards because all the endpoints configurations are stored inside it.

## What are the services that are used?

- http API on port 3010 (access the data, configure bucket etc)
- auth service on port 3100 (register/login etc)
- websocket service on port 4010 (so the frontend can receive update in realtime)
- interaction on port 3900 (listen for PM2 data)
- reverse interaction on port 43554 (listen for a specific connection from PM2, used to send command to it like restart etc)

## What is exposed by default?

Depending on how you deployed the keymetrics enterprise product, there are different answers:

- **Docker**
  - nginx is used to load balance depending on the path, to either the frontend or backend services
  - km-front expose the frontend on the port 80
  - km-api expose all the backend services
- **AWS**
  - Everything is running inside the km-core AMI
- **GCP**
  - Same as AWS, everything is running inside the km-core API


## I get a error about `Unknown modifier: $pushAll`, what did i miss?

We only support mongodb up to version 3.4 for now, you need to downgrade.

## How do i configure my pm2 to connect to it?

When you first register, you should have a bucket created automatically, then you will have connection data in the middle in this format:

```bash
> KEYMETRICS_NODE=<your KM_SITE_URL> pm2 link <identifier_one> <identifier_two>
```

You have two way to link your pm2:

- Connect to the instance where pm2 is and run the command.
- If you have container, just add these environements variables:
  - `KEYMETRICS_PUBLIC`: replace with `identifier_two>`
  - `KEYMETRICS_SECRET`: replace with `<identifier_one>`
  - `KEYMETRICS_NODE`: replace with `<your KM_SITE_URL>`
  - `INSTANCE_NAME`: (optional) replace it if you want your server in keymetrics to have a fixed name

Then it should all the instances in the keymetrics frontend in realtime.

## How should i run pm2 inside my containers to connect to it?

We advise you to use `pm2-runtime`, it should be a dropin replacement for node inside your images:

```docker
FROM node:8-alpine

RUN npm install -g pm2 2> /dev/null
[ ... ]
CMD [ "pm2-runtime", "app.js" ] # note that you can use an ecosystem here too
```

You can find the flags that you can use [here](https://github.com/Unitech/pm2/blob/master/lib/binaries/Runtime4Docker.js#L17)

<a id="gcp"></a>
## Deployment on Google Cloud Plateform

Documentation about how to deploy the keymetrics on-premise version on GCP

### Requirements

In the following examples, we assume that you already have a fully working Terraform project. You can follow the [`Getting Started`](https://www.terraform.io/intro/getting-started/install.html) guide on the official website [here](https://www.terraform.io/intro/getting-started/install.html).

## Setup steps

### 1. Adding the module to your terraform project

There's two options available in order to use our terraform module in your project. 
- Link the module's git repository address in your terraform module definition
- Clone the repository and set the source variable of your module definiton to the correct path on your drive.

##### Without cloning the repository

When defining your module definition, use the following `source` value:
- `git@github.com:keymetrics/on-premise.git//terraform/keymetrics_aio_gcp`

Example: 

```
module "keymetrics" {
  source  = "git@github.com:keymetrics/on-premise.git//terraform/keymetrics_aio_gcp"
  ...
}
```

##### By cloning the repository

Start by cloning the repository in your project directory using the git command:
- `git clone git@github.com:keymetrics/on-premise.git keymetrics-on-premise`

Define the `kemetrics` module using the relative path.
Example:

```
module "keymetrics" {
  source  = "keymetrics-on-premise/terraform/keymetrics_aio_gcp"
  ...
}
```

### 2. Set the module variables

The variables are set inside the module definition and allow you to chose how the module is going to setup your infrastructe and which external services are going to be used.

Example of module with variables:

```
module "example_keymetrics_setup" {
  source  = "keymetrics_aio_gcp"

  keymetrics_key = "...

  environment = "example"

  smtp_host = "smtp.mailgun.org"
  smtp_username = "postmaster@example.com"
  smtp_password = "XXX"
  smtp_sender = "keymetrics@example.com"
  
  public_host_address = "our-keymetrics-public-subdomain.example.com"
  
  network_name = "default"
}
```

The following variables are available:
- **keymetrics_key**: [*Required*] PM2 Plus License Key.
- **environment**: [*Required*] The name of your environment (ex: `qa`, `prod`, `prod-1`, etc.).
- **smtp_username**: [*Required*] Username used to connect to the SMTP server.
- **smtp_password**: [*Required*] Password used to connect to the SMTP server.
- **smtp_host**: [*Required*] Hostname of the SMTP server.
- **smtp_sender**: [*Required*] Email address used to send emails.
- **network_name**: [*Required*] Name of the GCP Network to use.
- **public_host_address**: Public domain pointing to PM2 Plus HTTP Server (if empty, the public IP will be used), need to be formatted with http or https, not just the host.
- **mongodb_instance_type**: GCP Instance type to use for MongoDB Instance.
- **elasticsearch_instance_type**: GCP Instance type to use for ElasticSearch Instance.
- **redis_instance_type**: GCP Instance type to use for Redis Instance.
- **backend_instance_type**: GCP Instance type to use for Backend Instance.


For more informations, please check the [`variables.tf`](https://github.com/keymetrics/on-premise/blob/master/terraform/keymetrics_aio_gcp/variables.tf) file in the module

### 3. `Plan` and `Apply` your changes using the `terraform` command

Run `terraform plan -target=module.example_keymetrics_setup -out tfout` and make sure no error shows up in the logs.

You can then run `terraform apply tfout` in order to make terraform created the infrastructure on your GCP Project.

## Extra configuration depending of your own existing infrastructure

### Add a sub-domain pointing to PM2 Plus instance

By default, PM2 Plus instance is using an External IP addresses to be publicly available to its users. If you want to use it with a domain, you __first__ need to set `public_host_address` variable to the domain to use and then create a `A` record pointing to its public External IP addresses.

*__Warning: Once deployed with either the public IP or a domain, it's not possible to change it without fully dropping the mongodb database.__*

### Allow your apps to connect to PM2 Plus APIs

By default, PM2 Plus instance only accept connection on port `80/tcp` from `0.0.0.0/32`. In order to let your applications talk with the PM2 Plus backend, you need to allow their security groups to connected to PM2 Plus instance on port `3900/tcp`, `3010/tcp`, `4010/tcp` and `43554/tcp`.

To do so, you can use the module output values as target or source of new [Firewall rules](https://www.terraform.io/docs/providers/google/r/compute_firewall.html) :
- `redis_fw_tag_name`
- `mongodb_fw_tag_name`
- `elasticsearch_fw_tag_name`
- `backend_fw_tag_name`

Example: 
```
module "example_keymetrics_setup" {
  source  = "keymetrics_aio_gcp"
  ...
}

resource "google_compute_firewall" "allow_all_connections_to_km" {
  name    = "allow_all_connections_to_km"
  network = "default"

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["80", "3900", "3010", "4010", "43554"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags = ["${module.example_keymetrics_setup.backend_fw_tag_name}"]
}

...
```

<a id="backend"></a>
## PM2 Enterprise Core Documentation

To deploy keymetrics you first need to get access to one of the images that contains it, see the readme for this.

You might get access to a docker image, a AMI or something else depending on the installation method you choose.

In all the case, the procedure to setup it is always the same, you need to inject to it some environement variables, **they are all mandatory**: 

- `KM_DEDICATED_KEY`: the license key given on https://enterprise.keymetrics.io
- `KM_ELASTICSEARCH_URL`: the url to the elasticsearch server (always need to have the port in the URI), example: 
    - `{elasticsearch_ip}:9200` or `elasticsearch1:9200 elasticsearch2:9200` (it will split by space then give an array to the elasticsearch client) [exact format defined in **hosts** property](https://www.elastic.co/guide/docs/elasticsearch/client/javascript-api/current/configuration.html#config-options)
- `KM_MONGO_URL`: the URI used to connect to mongodb, example:
    - `mongodb://{mongodb_ip}/keymetrics` [docs](https://docs.mongodb.com/manual/reference/connection-string/)
- `KM_REDIS_URL`: the URI used to connect to redis, example: 
    - `redis://{redis_ip}:6379` [exact format defined in **url** property](https://github.com/NodeRedis/node_redis#options-object-properties)
- `KM_SITE_URL`: the hostname that will be used to connect to the PM2 Plus instance, it need to be known for the frontend and PM2 to work correctly. Example: 
    - `http://backend.production.keymetrics`, can be a IP however it **absolutly need** to `http://` at the begining
- `SMTP_USER`: the username used to send email notifications via 3rd party email provider
- `SMTP_PASSWORD`: the password used to send email notifications via 3rd party email provider
- `SMTP_SENDER`:: the sender used to send email notifications via 3rd party email provider
- `SMTP_HOST`: the host used to send email notifications via 3rd party email provider


If you are injecting those variables at runtime (for example in EC2), you will need to reload PM2 so he pickup the variables: 
```bash
pm2 flush                         # remove olds logs
pm2 restart all --update-env      # restart all processes with new env
pm2 reset all                     # reset stats of processes
pm2 save                          # save the current state so all applications can be restarted when the server is restarted
```

You can find [an example](https://github.com/keymetrics/on-premise/blob/master/terraform/keymetrics_aio_aws/user_data_backend.tpl) with the user_data script already configured for EC2


## Databases

You'll need three different databases for the backend to run: 

- **Elasticsearch v5.5**: We use it to store the majority of data that PM2 push to the backend, we have a configuration where we create 1 index per day, no replica, if you need to configure it contact us
- **MongoDB**: We use it to store users/buckets, no configuration is recommended on our end (Max version supported is **3.4**).
- **Redis**: Tested with Redis 3 and 4, no configuration needed too

You are most likely to have problem with Elasticsearch which is the most heavy used datastores, you might wamt to monitor your cluster (depending on how much you push data into it).

### What is a provider?

A 'provider' is simply the place from where you are retrieving the keymetrics software. For example if you are deploying our AMIs inside AWS, you'll retrieve them from AWS. You can also deploy them with docker and in this case you will get them from the docker hub.

### What do I need to give to get access to the keymetrics software from a provider?

- AWS: you will need to provide your Amazon Account ID (so you can access the AMIs) and your Amazon Region
- docker: you will need to provide the username of the hub.docker.com account that you'll use to pull the docker images

<a id="helm"></a>
## Deployment on Kubernetes with Helm

Documentation about how to deploy the keymetrics on-premise version on Kubernetes using Helm

### Requirements

In the following examples, we assume that you already have a fully working Kubernetes cluster with a working installation of Helm.
To install and learn how to use Helm, you can follow the [Helm Quick Start Guide](https://docs.helm.sh/using_helm/#quickstart).

### Setup steps

#### 1. Clone this repository

The first step is to locally clone this git repository:

`git clone https://github.com/keymetrics/on-premise.git km-on-premise`

`cd km-on-premise/helm/`

#### 2. Add the "incubator" repository needed for ElasticSearch chart

Because the ElasticSearch chart isn't a stable chart yet, we need to add its repository to the list of allowed ones.

`helm repo index incubator --url http://storage.googleapis.com/kubernetes-charts-incubator`

#### 3. Install the chart

The automatic installation is done using:

```
helm install keymetrics-aio --set km_license=<YOUR_LICENSE> \
                            --set km_public_dns=<YOUR_SUBDOMAIN> \
                            --set km_smtp_host=<SMTP_ADDRESS> \
                            --set km_smtp_user=<SMTP_USERNAME> \
                            --set km_smtp_pass=<SMTP_PASSWORD> \
                            --set km_smtp_sender=<SMTP_SENDER_ADDRESS>
```

This will install PM2 Plus and its requirements: 
 - [Redis](https://github.com/kubernetes/charts/tree/master/stable/redis
)
 - [ElasticSearch](https://github.com/kubernetes/charts/tree/master/incubator/elasticsearch)
 - [MongoDB](https://github.com/kubernetes/charts/tree/master/stable/mongodb)

These settings are required:

- `km_license`: You PM2 Plus license key.
- `km_public_dns`: The public dns record that will be pointing to your PM2 Plus instance (needed for requirections).
- `km_smtp_host`: SMTP Server address.
- `km_smtp_user`: SMTP Server username.
- `km_smtp_pass`: SMTP Server password.
- `km_smtp_sender`: Emails used in "From" field of emails.

Once the installation is done, Helm is going to print a summary of the resources that it created. Make sure to follow the `NOTES` in order to set you DNS correctly and the connect to the web interface.
