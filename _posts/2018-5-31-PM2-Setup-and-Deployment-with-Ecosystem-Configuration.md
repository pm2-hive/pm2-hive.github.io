---
layout: post
title: PM2 Setup and Deployment with Ecosystem Configuration
description: We announced it at NodeJS paris meetup and we did it! For the release of PM2 0.9.xa new awesome and simple feature will make your life much easier
tags: tutorial performance product
---

We announced it at [NodeJS paris meetup](http://www.nodejsparis.fr/meetups) (here are the [slides](http://www.slideshare.net/Alexandre-Strzelewicz/keymetrics-pm2)) and we did it! For the release of [PM2 0.9.x](https://github.com/Unitech/pm2), a new awesome and simple feature will make your life much easier.

We embedded a modified version of [deploy](https://github.com/visionmedia/deploy) from the Node.js Mozart, [TJ Holowaychuk](https://github.com/visionmedia) and we also refactored the JSON application declaration. Internally it's a simple bash script that **doesn't need any external dependencies** to be installed.

Here are the features of this embedded deploy system:
```bash
$ pm2 deploy <configuration_file> <environment> <command>

  Commands:
    setup                run remote setup commands
    update               update deploy to the latest release
    revert [n]           revert to [n]th last deployment or 1
    curr[ent]            output current release commit
    prev[ious]           output previous release commit
    exec|run <cmd>       execute the given <cmd>
    list                 list previous deploy commits
    [ref]                deploy to [ref], the "ref" setting, or latest tag
```

You can display the PM2 deploy help with:
```bash
pm2 deploy help
```

And dont forget that this feature is available on PM2 > 0.9, so [update PM2 accordingly](https://github.com/Unitech/pm2#how-to-update-pm2).

## The ecosystem.config.js file

Now, a new file called by default `ecosystem.config.js` (previously `ecosystem.json`) will allow you to declare your applications/services and also the different hosts you want to deploy code into.

You can generate a sample `ecosystem.config.js` via the command:
```bash
pm2 ecosystem
```

This file will look like this:

```json
{
  "apps" : [{
    "name"      : "API",
    "script"    : "app.js",
    "env": {
      "COMMON_ENV_VAR": "true"
    }
    "env_production": {
      "NODE_ENV": "production",
    }
  },{
    "name"      : "WEB",
    "script"    : "web.js"
  }],
  "deploy" : {
    "production" : {
      "user" : "node",
      "host" : "212.83.163.1",
      "repo" : "git@github.com:repo.git",
      "ref"  : "origin/master",
      "path" : "/var/www/production",
      "post-deploy" : "pm2 startOrRestart ecosystem.config.js --env production"
    },
    "dev" : {
      "user" : "node",
      "host" : "212.83.163.1",
      "repo" : "git@github.com:repo.git",
      "ref"  : "origin/master",
      "path" : "/var/www/development",
      "post-deploy" : "pm2 startOrRestart ecosystem.config.js --env production"
    }
  }
}
```

There is the `apps` section that describes your different applications/services to be run and the `deploy` section that describes where your code should be deployed.

As you can notice, there is also a `env_<ENVIRONMENT>` attribute that specify dedicated environment variable depending on where you gonna deploy your code.

As always, locally you can launch all theses services via:
```bash
pm2 start ecosystem.config.js
```

### Deploy declaration

On each enviroment (production, dev...) there are some attributes configurable like these ones:

    key /path/to/some.pem
    user deployer
    host n.n.n.n
    repo git@github.com:visionmedia/express.git
    path /var/www/myapp.com
    ref origin/master
    pre-deploy ./bin/something
    post-deploy /var/www/myapp.com/update.sh

Customize / add the keys depending on your needs.

**Important Note** : by default the `post-deploy` is set with some logic dedicated to PM2.  
Internally if this attribute is not set, the `post-deploy` will call `pm2 startOrRestart ecosystem.config.js` ([startOrRestart](https://github.com/Unitech/pm2/blob/master/bin/pm2#L142))

## Configuring deployment

On your target servers you must already have PM2 installed via:
```bash
npm install pm2@latest -g
```

At the same time have PM2 be able to start on server startup via:
```bash
pm2 startup ubuntu
```

Disconnect from your remote server and make sure that your remote server has your ssh keys. You can generate and copy them via:
```bash
ssh-keygen -t rsa
ssh-copy-id node@myserver.com
```

Once you have generated the `ecosystem.config.js` and edited it accordingly to your needs, you're all set and ready to go!

## Setup and Deployment

### Setup

**Important note**: Commit your node_modules folder on your project Git repository. It's a best practice when you deploy code to keep version consistency between all the environments.

First PM2 has to initialize your remote system. To do that:

```bash
pm2 deploy <environment_key> setup
```

This will create folders depending on the `path` attribute  
**Note**: By default PM2 will look for a local ecosystem.config.js file, if you want to set another file do `$ pm2 deploy <ecosystem_file> <environment_key> setup` (for instance you can use the package.json instead!)

### Deploying

Now PM2 has to grab the latest version of your app and start the applications configured in the ecosystem.config.js under `apps` attribute. To do that:
```bash
pm2 deploy <environment_key>
```

Done !

## Other commands

With the `ecosystem.config.js` on the current folder:
```bash
# Update the code
pm2 deploy <environment_key> update

# Revert to [n] th commit
pm2 deploy <environment_key> revert 1

# Execute a command on the server
pm2 deploy production exec "pm2 restart all"
```

## Conclusion

Hope this will be helpful to you! Some other links that might interests you:

* The [pm2-deploy module embedded in PM2](https://github.com/Unitech/pm2-deploy)
* Deployment documentation on [PM2 Readme.md](https://github.com/Unitech/pm2#deployment)
* If you have any question tell us via [PM2 Github issues system](https://github.com/Unitech/pm2/issues?state=open)

Cheers!