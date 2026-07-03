---
layout: post
title: Node.js clustering made easy with PM2
description: As you would probably know, Node.js is a platform built on Chrome's JavaScript runtime, gracefully named V8. The V8 engine, and hence Node.js, runs in a single-threaded way, therefore, doesn't take advantage of multi-core systems capabilities
tags: tutorial product performance
---

As you would probably know, Node.js is a platform built on [Chrome's JavaScript runtime](https://developers.google.com/v8/), gracefully named V8.  
The V8 engine, and hence Node.js, runs in a single-threaded way, therefore, doesn't take advantage of multi-core systems capabilities.

## Node.js cluster module

Luckily enough, Node.js offers the cluster module, which basically will spawn some workers which can all share any TCP connection.

_How does it work?_

Cluster module will set up a master and then fork your server app as many times as you want it to (also called a worker).  
It communicates with workers via [IPC](http://en.wikipedia.org/wiki/Inter-process_communication) channels and comes with an embedded load-balancer which uses [Round-robin algorithm](http://en.wikipedia.org/wiki/Round-robin_scheduling) to better distribute load among the workers.  
When using Round-robin scheduling policy, the master [accepts()](http://linux.die.net/man/2/accept) all incoming connections and sends the TCP handle for that particular connection to the chosen worker (still via IPC).

_How to use it?_

The most basic example is the following :

```js
const cluster = require('cluster')
const http = require('http')
const os = require('os')

const numCPUs = os.cpus().length

if (cluster.isMaster) {
  // Master:
  // Let's fork as many workers as you have CPU cores

  for (let i = 0; i < numCPUs; ++i) {
    cluster.fork()
  }
} else {
  // Worker:
  // Let's spawn a HTTP server
  // (Workers can share any TCP connection.
  //  In this case its a HTTP server)

  http.createServer((req, res) => {
    res.writeHead(200)
    res.end('hello world')
  }).listen(8080)
}
```

Of course, you can spawn as many workers as you wish. You're not limited by the CPU cores number since a worker is nothing more but a child process.  
As you can see, to make it work, you have to wrap your code inside some cluster handling logic and then add some more code to specify the expected behaviour in case your worker dies unexpectedly.

## The PM2 way

**Built-in clustering**

PM2 internally handles all of the above logic for you so you don't have to change anything in your code.  
The previous code becomes:

```js
const http = require('http')

http.createServer((req, res) => {
  res.writeHead(200)
  res.end('hello world')
}).listen(8080)
```

Then you type :

```bash
pm2 start app.js -i 4
```

`-i <number of workers>` will tell PM2 that you want to launch your app in cluster_mode (as opposed to fork_mode).

If 'number of workers' argument is `0`, PM2 will automatically spawn as many workers as you have CPU cores.

```bash
┌──────┬────┬─────────┬─────────┬────────┬─────┬────────┬───────────┐
│ Name │ id │ version | mode    │ status │ ↺   │ cpu    │ memory    │
├──────┼────┼─────────┼─────────┼────────┼─────┼────────┼───────────┤
│ app  │ 0  │ 1.0.0   │ cluster │ online │ 0   │ 0%     │ 42.7 MB   │
│ app  │ 1  │ 1.0.0   │ cluster │ online │ 0   │ 0%     │ 42.8 MB   │
│ app  │ 2  │ 1.0.0   │ cluster │ online │ 0   │ 0.2%   │ 43.4 MB   │
│ app  │ 3  │ 1.0.0   │ cluster │ online │ 0   │ 0%     │ 43.2 MB   │
│ app  │ 4  │ 1.0.0   │ cluster │ online │ 0   │ 0.2%   │ 43.0 MB   │
│ app  │ 5  │ 1.0.0   │ cluster │ online │ 0   │ 0%     │ 43.2 MB   │
│ app  │ 6  │ 1.0.0   │ cluster │ online │ 0   │ 0%     │ 43.0 MB   │
│ app  │ 7  │ 1.0.0   │ cluster │ online │ 0   │ 0.2%   │ 43.3 MB   │
└──────┴────┴─────────┴─────────┴────────┴─────┴────────┴───────────┘
 Use `pm2 show <id|name>` to get more details about an app
```

**Keeping your apps running no matter what**

If any of your workers happens to die, PM2 will restart them immediatly so you don't have to worry about that either.  
Or, of course, you can, at any time, restart them manually as follows:  
```bash
pm2 restart app
```

**Scaling your cluster in realtime**

If you consider that you don't have enough workers or more than needed, you can scale your cluster anytime by hitting `pm2 scale <app name> <n>` where `<n>` can be a consistent number which the cluster will scale up or down to.  
It can also be an addition such as `pm2 scale app +3` in which case 3 more workers will be added to the cluster.  

**Updating your apps in production with zero downtime**

PM2 `reload <app name>` feature will restart your workers one by one, and for each worker, wait till the new one has spawned before killing the old one.  
This way, your server keeps running even when you are deploying the new patch straight to production.

You can also use `gracefulReload` feature which does pretty much the same thing but instead of immediatly killing the worker it will send it a _shutdown_ signal via IPC so it can close ongoing connections or perform some custom tasks before exiting gracefully.  
Example :

```js
process.on('message', msg => {
  if (msg === 'shutdown') {
    close_all_connections()
    delete_cache()
    server.close()
    process.exit(0)
  }
})
```

## Conclusion

Cluster module is a powerful tool. It gets even better and easy to use along with PM2.  
Cluster.js was experimental on Node 0.10.x and is considered to be mature and production-ready since Node 0.11.x latest releases and of course Node 0.12.x.  
We strongly suggest you to always use the latest version of Node.js and [PM2](https://github.com/Unitech/PM2/) since both of these projects' contributors are working hard every day to make them better.

Enjoy Node.js' clustering with PM2!