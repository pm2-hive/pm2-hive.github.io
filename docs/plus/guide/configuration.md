---
layout: docs
title: Configuration | Guide | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/guide/configuration/"
description: "Your dashboard already comes with a lot of metrics without any configuration. But don't worry, you also can add predefined set of metrics or - even better…"
---

![pm2io](https://raw.githubusercontent.com/keymetrics/branding/master/logos/pm2ioAPM/io-white.png)

# Configuration

Your dashboard already comes with a lot of metrics without any configuration. But don't worry, you also can add predefined set of metrics or - even better - to create custom ones.

PM2 comes with the [@pm2/io](https://github.com/keymetrics/pm2-io-apm) module, which is a module that gathers the metrics displayed in `pm2 monit` or in the web dashboard. By default, it just wraps your app. If you however want to refine the configuration, add custom metrics or custom actions, you must require it in your code.

## Installation

With npm:

```bash
npm install @pm2/io --save
```

With yarn:

```bash
yarn add @pm2/io
```

## Intialisation

Load and initialize `@pm2/io` at the top level of your application, before any other `require`.

```javascript
const io = require('@pm2/io')

io.init({
  metrics: {
    network: {
      ports: true
    }
  }
})
```

This first basic initialisation will add to the dashboard the port number your app is listening to.

 See all intialisation options in the [@pm2/io reference]({{ site.baseurl }}{% link docs/plus/reference/pm2io.md %}).
{: .tip}

## Next Steps


[@pm2/io reference]({{ site.baseurl }}{% link docs/plus/reference/pm2io.md %})
{: .btn-stylized}

[Custom Metrics]({{ site.baseurl }}{% link docs/plus/guide/custom-metrics.md %})
{: .btn-stylized}
