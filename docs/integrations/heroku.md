---
layout: docs
title: Heroku Integration
description: PM2 integration for Heroku
permalink: /docs/integrations/heroku/
---

## Using PM2 with Heroku

This page will guide you step by step through the PM2 integration with Heroku.

We will use Git and the Heroku CLI.

## Prepare your app

### Set your ecosystem file

Generate an `ecosystem.config.js` template with:

```bash
pm2 init
```

Modify the ecosystem file to match your needs:

```javascript
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```

Learn more about ecosystem file [here](/docs/usage/application-declaration/).
{: .tip}

We recommend to use the cluster mode with Heroku, as each dyno has multi-core CPU.

 Learn more about the [cluster mode](/docs/usage/cluster-mode/).
{: .tip}

### Add PM2 as a module

Add pm2 as a dependency to your projet.

With npm:

```bash
npm install pm2
```

With yarn:

```bash
yarn add pm2
```

### Set your package.json

In your `package.json`, modify your `start` script like the following:

```json
{
  "scripts": {
    "start": "pm2-runtime start ecosystem.config.js --env production"
  }
}
```

## Deploy with Heroku

### Create an account on Heroku

Sign up for an account on Heroku [here](https://signup.heroku.com/).

### Install the CLI

Follow the instructions to install [here](https://devcenter.heroku.com/articles/heroku-cli).

Then, run `heroku login` to connect the CLI to your account.

### Init your Heroku app

We will first create a new empty application on Heroku and an associated empty Git repository.

Run this command from your app root folder:
```bash
heroku create

Creating app... done, ⬢ guarded-island-32432
https://guarded-island-32432.herokuapp.com/ | https://git.heroku.com/guarded-island-32432.git
```

You now have a new git remote named `heroku`. If you push to this repository, your code is automatically deployed at the given URL.

### Deploy your app on Heroku

Add and commit all your changes, then run:

```bash
git push heroku master
Initializing repository, done.
updating 'refs/heads/master'
remote: Compressing source files... done.
remote: Building source:
...
remote:
remote: Verifying deploy... done.
To https://git.heroku.com/aqueous-temple-78487.git
```

## You are ready

That's all! The last line of the deployment will give you the URL where your app is available.
