---
layout: docs-io
title: Graceful Shutdown | Best Practices | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/best-practices/graceful-shutdown/"
description: "Your applications will restart several times in its lifetime, be it on deployment or, more sadly, if your application crashes."
---

# Graceful Shutdown

Your applications will restart several times in its lifetime, be it on deployment or, more sadly, if your application crashes.

But on a restart, a user can face two problems:
- a **downtime period**, your server returning "503 Service Unavailable" responses
- a **failed request**, if the request was in progress at the time of restart

**Downtime periods** can be avoided with the pm2 cluster mode and reload action.

**Failed requests** can be avoided with graceful shutdown and restart. This tutorial introduce you how to implement it.

## Graceful Shutdown

In a graceful shutdown, your app must go through 5 steps:

- receives a notification to stop
- asks the load balancer to stop receiving requests
- finishes all ongoing requests
- releases all resources (databases, queues...)
- exits

Let's say we have the following express app:

```javascript
const app = express()
const port = process.env.port || 8000

app.get('/', (req, res) => { res.end('Hello world') })

const server = require('http').createServer(app)
server.listen(port, () => {
  console.log('Express server listening on port ' + server.address().port)
})
```

We need first to intercept the **SIGINT** signal (emitted by `pm2 stop`):

```javascript
const app = express()
const port = process.env.port || 8000

app.get('/', (req, res) => { res.end('Hello world') })

const server = require('http').createServer(app)
server.listen(port, () => {
  console.log('Express server listening on port ' + server.address().port)
})

process.on('SIGINT', () => {
  console.info('SIGINT signal received.')
})
```

We then ask HTTP server to stop receiving requests and finish ongoing ones:

```javascript
const app = express()
const port = process.env.port || 8000

app.get('/', (req, res) => { res.end('Hello world') })

const server = require('http').createServer(app)
server.listen(port, () => {
  console.log('Express server listening on port ' + server.address().port)
})

process.on('SIGINT', () => {
  console.info('SIGINT signal received.')

  // Stops the server from accepting new connections and finishes existing connections.
  server.close(function(err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
})
```

At last, we close connection to all resources:

```javascript
const app = express()
const port = process.env.port || 8000

app.get('/', (req, res) => { res.end('Hello world') })

const server = require('http').createServer(app)
server.listen(port, () => {
  console.log('Express server listening on port ' + server.address().port)
})

process.on('SIGINT', () => {
  console.info('SIGINT signal received.')

  // Stops the server from accepting new connections and finishes existing connections.
  server.close(function(err) {
    // if error, log and exit with error (1 code)
    if (err) {
      console.error(err)
      process.exit(1)
    }

    // close your database connection and exit with success (0 code)
    // for example with mongoose
    mongoose.connection.close(function () {
      console.log('Mongoose connection disconnected')
      process.exit(0)
    })
  })
})
```

## Timeout for kill

By default, pm2 waits 1600ms before sending SIGKILL signal if the applications doesn't exit itself.

You can change this value, in ms, in your ecosystem.config.js:

```javascript
module.exports = {
  apps: [{
    name: "app",
    script: "./app.js",
    kill_timeout: 1600,
  }]
}
```

## Windows graceful stop

When signals are not available your process gets killed. In that case, you need to listen for `shutdown` events:

```javascript
process.on('message', (msg) => {
  if (msg == 'shutdown') {
    console.log('Closing all connections...')
    setTimeout(() => {
      console.log('Finished closing connections')
      process.exit(0)
    }, 1500)
  }
})
```

## Graceful start

Your application often require to be connected to your database or other resources before serving HTTP requests.

Your app must go through these 3 steps to avoid errors:

- opens DB connections
- starts listening to a port
- notifies pm2 that the application is ready

First, enable the `ready` signal in pm2 in your ecosystem.config.js:
```javascript
module.exports = {
  apps : [{
    name: "api",
    script: "./api.js",
    wait_ready: true,
    listen_timeout: 3000,
  }],
}
```

 By default, after 3000ms, pm2 will consider your app ready. Change this value with the `listen_timeout` value.
{: .tip}

Let's keep using the previous express app:
```javascript
const app = express()
const port = process.env.port || 8000

app.get('/', (req, res) => { res.end('Hello world') })

server.listen(port, () => {
  console.log('Express server listening on port ' + server.address().port)
})

...
```

First, wait for your database connection to be ready:
```javascript
const app = express()
const port = process.env.port || 8000

app.get('/', (req, res) => { res.end('Hello world') })

const server = require('http').createServer(app)
mongoose.connect('mongodb://mongosA:27501,mongosB:27501', (err) => {
  server.listen(port, () => {
    console.log('Express server listening on port ' + server.address().port)
  })
})

...
```

At last, notify pm2 that the application is ready with `process.send('ready')`:

```javascript
const app = express()
const port = process.env.port || 8000

app.get('/', (req, res) => { res.end('Hello world') })

const server = require('http').createServer(app)
mongoose.connect('mongodb://mongosA:27501,mongosB:27501', (err) => {
  server.listen(port, () => {
    console.log('Express server listening on port ' + server.address().port)
    process.send('ready')
  })
})

...
```

## Graceful start in cluster mode

In cluster mode, there is a default system that sets each cluster ready when the app accepts a connection. There is also a time out, which default to 3000ms, that you can set with the `listen_timeout` property in your ecosystem file.
