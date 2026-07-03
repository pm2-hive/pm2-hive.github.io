---
layout: docs
title: Configuration | Guide | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/guide/custom-metrics/"
description: "By default PM2 Plus will add some metrics into your application, but it's not always enough. @pm2/io is the library that will help you add custom metrics…"
---

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
