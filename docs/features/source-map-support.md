---
layout: docs
title: Source map support
description: Source map support for BabelJS/Typescript and any transpiler
permalink: /docs/usage/source-map-support/
---

If you use [BabelJS](https://babeljs.io/), [Typescript](http://www.typescriptlang.org/) or any other Javascript superset you may have noticed that when an exception occurs, the stacktrace is not meaningful at all. To get interesting informations you need to generate [source map files](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

Once these source map files are generated, PM2 will automatically detects them and will help you inspect errors.

## Source map

Since the version 1.0.2, PM2 embeds a mecanism to support javascript source map.

**PM2 automatically detects javascript source map files** if you start app.js, it will expect app.js.map to exist as well.

If you have a different layout, you can force the source map support by starting your application:

Via CLI:

```bash
pm2 start app.js --source-map-support
```

Or via JSON file:

```javascript
module.exports = {
   name: 'babel-app',
   script: 'app.js',
   source_map_support: true
}
```

### Inspect exceptions

Exceptions are logged into your application error log file.

To check your logs to detect exceptions, you simply have to type:

```bash
pm2 logs main
```

Else use [keymetrics.io](https://keymetrics.io/) to have a clean listing and notifications of [new alerts happening](http://docs.keymetrics.io/docs/pages/issues/).

### Disable source map support

If you do not want PM2 to automatically support javascript source map you can use the option `--disable-source-map`.

It can be done both via CLI and via JSON file.
