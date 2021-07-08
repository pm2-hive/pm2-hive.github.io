---
layout: docs
title: Process Actions
description: Expose RPC Methods
permalink: /docs/usage/process-actions/
---

## Expose RPC Methods: Process Actions

Exposing RPC Methods will allow you to interact in real-time with a running process.

This is useful for:
- Changing behavior (e.g. switching log to debug)
- Retrieving data structure
- Triggering actions

### Quick Start

First install [tx2](https://github.com/pm2/tx2) module:

```bash
$ npm install tx2
```

Then create an application called rpc.js:

```javascript
const tx2 = require('tx2')

tx2.action('hello', (reply) => {
  reply({ answer : 'world' })
i})

setInterval(function() {
  // Keep application online
}, 100)
```

And start it with PM2:

```bash
$ pm2 start rpc.js
```

Now to trigger process actions, use the command:

```bash
$ pm2 trigger <application-name> <action-name>
# pm2 trigger rpc hello
```

### Listing available RPC methods

To list all available RPC methods:

```bash
pm2 show <application-name>
# pm2 show rpc
```

### Passing a parameter

To pass a parameter to the remote function, just add the `param` attribute to the callback:

```javascript
var tx2 = require('tx2')

tx2.action('world', function(param, reply) {
  console.log(param)
  reply({success : param})
})
```

Restart your application and call this process function with PM2:

```bash
pm2 trigger <application-name> <action-name> [parameter]
# pm2 trigger rpc world somedata
```

### Triggering from Web Dashboard

All RPC methods exposed from your application, once connected to [pm2.io](https://app.pm2.io) will be displayed and actionable from a web interface.

## TX2 API Documentation

[https://github.com/pm2/tx2/blob/main/API.md](https://github.com/pm2/tx2/blob/main/API.md)
