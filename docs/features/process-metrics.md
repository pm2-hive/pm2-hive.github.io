---
layout: docs
title: Custom Metrics
description: Monitor in-code values
permalink: /docs/usage/process-metrics/
---

## Custom Metrics

By plugging custom metrics onto your code, you will be able to monitor in-code values, in realtime.

## Install

Install the `@pm2/io` library to your application with:

```bash
npm install @pm2/io --save
```

For more information about the `@pm2/io` module checkout [the repo documentation](https://github.com/keymetrics/pm2-io-apm#table-of-contents)

## Using @pm2/io for metrics

Here is a basic example on how to use the @pm2/io library to create a *requests per minute* custom metric:

```javascript
var io = require('@pm2/io')
var http = require('http')

var meter = io.meter({
  name      : 'req/min',
  samples   : 1,
  timeframe : 60
})

http.createServer(function (req, res) {
  meter.mark()
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('Hello World!')
  res.end()
}).listen(6001)
```

## Monitoring metrics

Once you have started the application with `pm2 start app.js`, to display the `req/min` metric you can use:

```
pm2 monit
```

And check the box called "Custom Metrics":

<img src="https://i.imgur.com/WHDEvHg.png" title="custom metrics" width="300"/>

**Or** you can check the metrics with the:

```bash
pm2 show <application-name>
```

![process metrics](/images/processmetrics.png)

## Metrics helper available

Then you can program your very own metrics to track important informations. 4 differents probes are available:

- **Simple metrics**: Values that can be read instantly
    - eg. Monitor variable value
- **Counter**: Things that increment or decrement
    - eg. Downloads being processed, user connected
- **Meter**: Things that are measured as events / interval
    - eg. Request per minute for a http server
- **Histogram**: Keeps a resevoir of statistically relevant values biased towards the last 5 minutes to explore their distribution
    - eg. Monitor the mean of execution of a query into database

### Simple Metric: Simple value reporting

This allows to expose values that can be read instantly.

```javascript
var io = require('@pm2/io')

// Here the value function will be called each second to get the value
var metric = io.metric({
  name    : 'Realtime user',
  value   : function() {
    return Object.keys(users).length
  }
})

// Here we are going to call valvar.set() to set the new value
var valvar = io.metric({
  name    : 'Realtime Value'
})

valvar.set(23)
```

### Counter: Sequential value change

Values that increment or decrement.

Example to count Active Http Requests:

```javascript
var io = require('@pm2/io')
var http = require('http')

var counter = io.counter({
  name : 'Active requests'
})

http.createServer(function (req, res) {
  counter.inc()

  req.on('end', function() {
    // Decrement the counter, counter will eq 0                                                                                                                                                                      
    counter.dec()
  })
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('Hello World!')
  res.end()
}).listen(6001)
```

### Meter: Average calculated values

Values that are measured as events / interval.

Example to count number of queries per minute:

```javascript
var io = require('@pm2/io')
var http = require('http')

var meter = io.meter({
  name      : 'req/min',
  samples   : 1,
  timeframe : 60
})

http.createServer(function (req, res) {
  meter.mark()
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('Hello World!')
  res.end()
}).listen(6001)
```

#### Options

**samples** option is the rate unit. Defaults to **1** sec.
**timeframe** option is the timeframe over which events will be analyzed. Defaults to **60** sec.

### Histogram

Keeps a resevoir of statistically relevant values biased towards the last 5 minutes to explore their distribution.

```javascript
var io = require('@pm2/io')

var histogram = io.histogram({
  name        : 'latency',
  measurement : 'mean'
})

var latency = 0

setInterval(function() {
  latency = Math.round(Math.random() * 100)
  histogram.update(latency)
}, 100)
```
