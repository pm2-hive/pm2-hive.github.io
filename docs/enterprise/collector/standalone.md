---
layout: docs
title: Standalone Agent | Guides | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
permalink: "/docs/enterprise/collector/standalone/"
description: "When monitoring your production environment, you might not see the point of using a process manager in your container when you already use orchestrator…"
---

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
