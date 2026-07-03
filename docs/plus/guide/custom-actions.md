---
layout: docs
title: Configuration | Guide | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/guide/custom-actions/"
description: "Custom actions are function that you expose to PM2 Plus with @pm2/io so you are able to launch them from the dashboard. A example use case that everyone…"
---

![pm2io](https://raw.githubusercontent.com/keymetrics/branding/master/logos/pm2ioAPM/io-white.png)

# Custom Actions

Custom actions are function that you expose to PM2 Plus with `@pm2/io` so you are able to launch them from the dashboard.
A example use case that everyone should be familiar with is the following:

```javascript
const { createLogger, format, transports } = require('winston')

const logger = createLogger({
  level: 'info',
  format: format.simple(),
  transports: [new transports.Console()]
})

logger.info('Hello world')
logger.debug('Debugging info')
```

Here i got a logger somewhere in my application, when putting it into production i don't want to get every `debug` log of it so by default i put the log level to `info`.
However if i want to debug my application, i need to edit the source code, rebuild and redeploy to be able to see debug information.

Here comes the custom actions:

```javascript
const { createLogger, format, transports } = require('winston')
const io = require('@pm2/io')

const logger = createLogger({
  level: 'info',
  format: format.simple(),
  transports: [new transports.Console()]
});

logger.info('Hello world')
logger.debug('Debugging info')

io.action('set debug level', (cb) => {
  // when running this action, we will be able to see all debug statement
  logger.transports.Console.level = 'debug'
  return cb({ level: 'debug' })
})

io.action('set info level', (cb) => {
  // and when running this one, you get back to your normal log level
  logger.transports.Console.level = 'info'
  return cb({ level: 'info' })
})
```

Custom actions are really powerful and only limited by your imagination, their usefulness really depend on your pains.
But we believe that updating small configuration like the log level shouldn't take more than a few minutes.

## Expose Remote Actions

You can remotely trigger functions directly from your dashboard. After having been exposed from your code, action buttons can be found in the `Action Center` section.

The function takes a function as a parameter, which needs to be called once the action is finished.

```javascript
const io = require('@pm2/io')

io.action('db:clean', (cb) => {
  db.clean(() => {
     return cb({ success: true })
  })
})
```

## How to use them in the dashboard

![remote action](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/plus/actionCenter/actionCenter.png)

When you added all the actions in your code, you can go to the `Actions center` in the dashboard.

From there you will see every actions that you have added. As soon as you click on them we will launch into your application.
You will of course be able to see the output that your action sent in the callback.

## Next Steps

[Realtime Logs]({{ site.baseurl }}{% link docs/plus/guide/realtime-logs.md %})
{: .btn-stylized}
