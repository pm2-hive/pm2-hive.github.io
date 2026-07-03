---
layout: docs-io
title: Entrypoint | Guide | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/guide/entrypoint/"
description: "The entrypoint.js lets you precisely contol your application flow and organize the link between the Node.js runtime and PM2."
---

# Entrypoint

The **entrypoint.js** lets you precisely contol your application flow and organize the link between the Node.js runtime and PM2.

## Entrypoint base class

The entrypoint has 4 methods; onStart, onStop, sensors and actuators. Here is an example of this class:

```javascript
const Entrypoint = require('@pm2/io').Entrypoint

new class App extends Entrypoint {
  // This is the very first method called on startup
  onStart (cb) {

    // Returning the callback will tell PM2 that the app is ready to process queries
    return cb()
  }

  // This is the very last method called on exit || uncaught exception
  onStop(err, cb, code, signal) {
  }

  // Here we declare some process metrics
  sensors () {
  }

  // Here are some actions to interact with the app in live
  actuators () {
  }
}
```

## Example

Here is a concrete example for a simple Hello world http api:

```javascript
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
      reply({ server: this.server })
    })
  }
}
```

Then to start it just run:

```
pm2 start entrypoint.js
```

## Roadmap

We plan to implement ecosystem file configuration straight into this entrypoint.js file, if you have any remarks, ideas or feedback feel free to [post an issue](https://github.com/Unitech/pm2)
