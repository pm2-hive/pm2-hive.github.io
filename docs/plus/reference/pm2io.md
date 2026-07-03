---
layout: docs
title: Reference | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/reference/pm2io/"
description: "@pm2/io is the library that comes with PM2 which is in charge of gathering the metrics that are displayed in PM2 Plus By default, the module just wraps…"
---

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


