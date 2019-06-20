---
layout: docs
title: Use PM2 in Cloud Providers
description: Use PM2 in a cloud environment (without CLI)
permalink: /docs/usage/use-pm2-with-cloud-providers/
---

## Using PM2 in Cloud Providers

You might find yourself in a situation in which you do not have access to a raw CLI to start your Node.js applications. You have 2 ways to circumvent this:
* Use the preinstall directive to install PM2 globally and start your application in the start script.
* Require PM2 as a dependency and call the module via the start script.

## Method 1: Pre install PM2 globally

The easiest way is to install pm2 globally via the preinstall scripts and start your application via pm2.

In package.json:

```json
  "scripts": {
    "preinstall": "npm install pm2 -g",
    "start": "pm2-runtime app.js -i max"
   },
```

* `-i max` will [start your application in cluster mode](http://pm2.keymetrics.io/docs/usage/cluster-mode/), allowing you to get the most performance out of your instance!

For a fine tuned configuration look at [Process Files](http://pm2.keymetrics.io/docs/usage/application-declaration/).

## Method 2: Require PM2 as a module

Depending on your cloud provider, the `preinstall` script might not be supported or pm2 might not be installed globally.
To solve this we can require pm2 from the `node_module` folder:

Install pm2 in your projet using `npm install --save pm2`

In package.json:

```json
  "scripts": {
    "start": "node ./node_modules/.bin/pm2-runtime app.js -i max"
  }
```

## Link to [PM2.io](https://pm2.io/)

You can set PM2_PUBLIC_KEY and PM2_SECRET_KEY in the environment variables so that once PM2 starts, it will automatically connect to Keymetrics. Or in bash mode:

```bash
export PM2_PUBLIC_KEY="XXXX"
export PM2_SECRET_KEY="YYYY"
pm2 update
```

## Set a fixed Server Name

You might want fixed server name so the names are constant in Keymetrics. The default link is the hostname (`$HOST` var) plus a few random characters. If you set the `$PM2_MACHINE_NAME`, the name will be fixed and used on the dashboard.

Be careful, in case of duplicate hostnames the dashboard will receive data from both instances and flicker.


```bash
export PM2_MACHINE_NAME=$HOST
```
