---
layout: docs
title: Transaction Tracing | Guide | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
permalink: "/docs/enterprise/guides/transaction-tracing/"
description: "Note : We have finished our new tracing solution which is now called the Distributed Tracing, we are now deprecating the old Transaction Tracing."
---

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

