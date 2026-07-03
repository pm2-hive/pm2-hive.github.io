---
layout: docs
title: Issue Dashboard | Guide | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/guide/issue-dashboard/"
description: "By default when one of your applications crash, pm2 will of course automatically restart it but it will also send the error to PM2 Plus. In the issue…"
---

# Issue dashboard

![issue dashboard](https://raw.githubusercontent.com/keymetrics/branding/master/screenshots/plus/issues/issues.png)

By default when one of your applications crash, pm2 will of course automatically restart it but it will also send the error to PM2 Plus.
In the issue dashboard, you will be able to see for each error:
- How much time the error happened?
- The servers that were impacted by this errors
- The stack trace
- The exact line of code that thrown the error
- Few applications logs before the error happened

You can of course delete them if you think they are not relevant by click on `

## Manually emit an issue

It's possible that you need to report an error that isn't crashing your process.
In this case you can use `io.notifyError`:

```javascript
const io = require('@pm2/io')

try {
  // Critical action to be tested
  user.sendNotifications()
} catch (error) {
  io.notifyError(new Error('Notification failed'), {
    // or anything that you can like an user id
    custom: {
      user: user.id
    }
  })
}
```

## Next Steps

[Notifications]({{ site.baseurl }}{% link docs/plus/guide/custom-metrics.md %})
{: .btn-stylized}
