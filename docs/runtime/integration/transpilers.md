---
layout: none
title: Transpilers | Integration | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/integration/transpilers/"
description: "This tutorial will show you how to use pm2 with transpilers."
sitemap: false
redirect_to: "/docs/tutorials/using-transpilers-with-pm2/"
---

# Using PM2 with transpilers

This tutorial will show you how to use pm2 with transpilers.

 We highly don't recommend to use this in **production** as it slows down your app. In that case, your app must be bundled i.e. transpiled from the source to get a pre-processed version of your app.
{: .warn}

## Typescript

```bash
## Add the new typescript dependency in PM2:
pm2 install typescript

## Start app.ts in watch & restart:
pm2 start app.ts --watch
```

## Babel

```bash
## Install the Babel CLI globally:
npm install -g babel-cli

## Start pm2 with the Babel CLI binary in watch mode:
pm2 start --watch --interpreter babel-cli app.js
```

Or, you can create an other file, which requires the transpiler and your app:
```javascript
// index.js
require('babel-register');
require('./app.js');
```
Then, run:
```bash
pm2 start --watch index.js
```

 The cluster mode is only available with the second option.
{: .tip}

## Coffee-script

```bash
## Install Coffee Script at PM2 level:
pm2 install coffeescript

## Start pm2 with coffee binary in watch mode:
pm2 start app.coffee
```

Or, you can install the coffeescript dependency via `npm install coffeescript` and require it in your code:

```javascript
// index.js
require('coffee/register');
require('./app.coffee');
```

Then, run:
```bash
pm2 start index.js
```

The cluster mode is only available with the second option.
{: .tip}
