---
layout: docs
title: Notifications | Guide | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/guide/notifications/"
description: "Notifications are one of the most powerful feature of PM2 Plus, always getting you aware about critical events."
---

# Notifications

Notifications are one of the most powerful feature of PM2 Plus, always getting you aware about critical events.

By default, you receive notifications only by email and for critical events such as:
- downtime
- deployment
- issues
- restart

This section will help you to customize the notification systems to setup other channels and understand what you can receive as notifications.

## Issues notifications

By default, PM2 Plus sends three different kind of notification.
Issues are simply errors that your application have, there two type: 
- runtime errors: they made your application crash, pm2 automatically catch them and restart your application.
- custom errors: with `@pm2/io` you can send custom error that you need to track in your application

Here is an example on how you can report custom errors: 

```javascript
const io = require('@pm2/io')

io.notifyError(new Error('This is an error'), {
  // you can some http context that will be reported in the UI
  http: {
    url: req.url
  },
  // or anything that you can like an user id
  custom: {
    user: req.user.id
  }
})
```

The first time we receive an error, we send you notifications by email.
You can also configure to receive a slack message by going to `Settings > Alerts > 3rd Party Integration`

We will also send you notificatios in case of "bad behavior", which is when the same error happens more than 5 times in 60 seconds.
Note that we will avoid sending a notification for each "bad behavior" that we detect.

You can choose to not receive notifications for errors by going to `Settings > Alerts > Exceptions`

For both following integration, you need to use at least `@pm2/io` version 3.0.0

#### Report errors with Express

If you want you can configure your express middleware to automatically send you an error with the error middleware of express:

```js
const io = require('@pm2/io')
const express = require('express')
const app = express()

// add the routes that you want
app.use('/toto', () => {
  throw new Error('ajdoijerr')
})

// always add the middleware as the last one
app.use(io.expressErrorHandler())
```

#### Report errors with Koa

We also expose a custom koa middleware to report error with a specific koa middleware:

```js
const io = require('@pm2/io')
const Koa = require('koa')
const app = new Koa()

// the order isn't important with koa
app.use(pmx.koaErrorHandler())

// add the routes that you want
app.use(async ctx => {
  ctx.throw(new Error('toto'))
})
```


## Offline notifications

**NOTE: The offline notification only works with PM2 version above 3.2.2** 

When one of your servers isn't sending data to our servers for more than 2 minutes (can be configured), we tag him as "offline".
You can choose to receive a notifications when it happens by going to `Settings > Alerts > Server offline`
You can configure the threshold of how much time it need to be disconnected to send a notifications by going to `Settings > General > Your server is considered offline after`

If your applications are in auto scaling environment, we advise to turn of the offline notifications and turn on "Auto delete a server when going offline" in `Settings > General` so it disappear from the dashboard automatically.

## Restart notifications

Sometimes you may want to be alerted when PM2 restart your application, we added a way for you to be alerted in this case, enable it in `Settings > Alerts > Automatic / Manual Restart`
Automatic restart are the ones that are made by PM2 itself, because your app crashed for example.
Manual restart are the ones that are done via the CLI using `pm2 restart myapp`

## Deployment notifications

If you use git with your application, we also allow you to receive an alert when the application is updated.
You can turn it off or configure it by going to `Settings > Alerts > Deployment`

## Notification channels

By default, notifications are only sent by email but they can be enabled with slack or via a webhook.

### Slack notifications

The Slack integration allows you to receive exceptions and event notifications straight into a selected Slack channel.

First you need to get the Slack URL and to setup an incoming Webhook. More details on how to set this up can be found [here](https://my.slack.com/services/new/incoming-webhook/).

Then go to the notification docs `Settings > Alerts` and insert the webhook into the field. Enable and click on update.

Check if you successfully received a notification into your slack channel confirming that it has been configured.

### Webhooks

You can also set a webhook that will make POST HTTP request to a given URL when you receive a notifications.

The format of the data is a json like the following:

```json
 {
   "event":"event:new_exception",
   "data":{
      "process":{
         "pm_id":9,
         "name":"pm2-elasticsearch",
         "rev":"ac77098c5e1b10d74360b113da6e717fab8fe427",
         "server":"pm2-module-testing"
      },
      "data":{
         "message":"Bad argument",
         "stack":"TypeError: Bad argument\n    at TypeError (native)\n    at ChildProcess.spawn (internal/child_process.js:274:26)\n    at exports.spawn (child_process.js:362:9)\n    at Object.exports.execFile (child_process.js:151:15)\n    at exports.exec (child_process.js:111:18)\n    at /home/node/pm2-elasticsearch/lib/actions.js:25:5\n    at process.<anonymous> (/home/node/pm2-elasticsearch/node_modules/pmx/lib/actions.js:64:14)\n    at emitTwo (events.js:92:20)\n    at process.emit (events.js:172:7)\n    at handleMessage (internal/child_process.js:695:10)"
      },
      "at":1472651928925,
      "created_at":1472651928925,
      "updated_at":1472651928925,
      "count":1,
      "identifier":"ad6f8650dabfec83f183633b0bba7d97",
      "infected_servers":[
         "pm2-module-testing"
      ],
      "timestamps":[
         1472651928925
      ],
      "commits":[
         "ac77098c5e1b10d74360b113da6e717fab8fe427"
      ],
      "bucket_url":"https://app.pm2.io/.../"
   }
}
```
 
Use case example: You can now setup an express server that can receive webhooks, automatically send SMS or use any integration you want.

## Next Steps

[Issue Dashboard]({{ site.baseurl }}{% link docs/plus/guide/issue-dashboard.md %})
{: .btn-stylized}
