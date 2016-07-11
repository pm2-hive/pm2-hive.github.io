---
layout: docs
title: Deployment
description: Easily deploy applications with PM2
permalink: /docs/usage/deployment/
---

## Getting started

PM2 embeds a simple and powerful deployment system with revision tracing. [Another step by step tutorial here](https://keymetrics.io/2014/06/25/ecosystem-json-deploy-and-iterate-faster/)

Please read the [Considerations to use PM2 deploy](#considerations)

1- Generate a sample ecosystem.json file that list processes and deployment environment

```bash
$ pm2 ecosystem
```

In the current folder a `ecosystem.json` file will be created.
It contains this:

```javascript
{
  // Applications part
  "apps" : [{
    "name"      : "API",
    "script"    : "app.js",
    "env": {
      "COMMON_VARIABLE": "true"
    },
    // Environment variables injected when starting with --env production
    // http://pm2.keymetrics.io/docs/usage/application-declaration/#switching-to-different-environments
    "env_production" : {
      "NODE_ENV": "production"
    }
  },{
    "name"      : "WEB",
    "script"    : "web.js"
  }],
  // Deployment part
  // Here you describe each environment
  "deploy" : {
    "production" : {
      "user" : "node",
      // Multi host is possible, just by passing IPs/hostname as an array
      "host" : ["212.83.163.1", "212.83.163.2", "212.83.163.3"],
      // Branch
      "ref"  : "origin/master",
      // Git repository to clone
      "repo" : "git@github.com:repo.git",
      // Path of the application on target servers
      "path" : "/var/www/production",
      // Can be used to give options in the format used in the configura-
      // tion file.  This is useful for specifying options for which there
      // is no separate command-line flag, see 'man ssh' 
      // can be either a single string or an array of strings
      "ssh_options": "StrictHostKeyChecking=no",
      // Commands to execute locally (on the same machine you deploy things)
      // Can be multiple commands separated by the character ";"
      "pre-deploy-local" : "echo 'This is a local executed command'"
      // Commands to be executed on the server after the repo has been cloned
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env production"
      // Environment variables that must be injected in all applications on this env
      "env"  : {
        "NODE_ENV": "production"
      }
    },
    "staging" : {
      "user" : "node",
      "host" : "212.83.163.1",
      "ref"  : "origin/master",
      "repo" : "git@github.com:repo.git",
      "path" : "/var/www/development",
      "ssh_options": ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
      "post-deploy" : "pm2 startOrRestart ecosystem.json --env dev",
      "env"  : {
        "NODE_ENV": "staging"
      }
    }
  }
}
```

Edit the file according to your needs.

2- Be sure that you have the public ssh key on your local machine

```bash
$ ssh-keygen -t rsa
$ ssh-copy-id node@myserver.com
```

3- Now initialize the remote folder with:

```bash
$ pm2 deploy <configuration_file> <environment> setup
```

E.g:

```bash
$ pm2 deploy ecosystem.json production setup
```

This command will create all the folders on your remote server.

4- Deploy your code

```bash
$ pm2 deploy ecosystem.json production
```

Now your code will be populated, installed and started with PM2

## Deployment options

Display deploy help via `pm2 deploy help`:

```
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

## Use different set of env variables

In the `post-deploy` attribute, you may have noticed the command `pm2 startOrRestart ecosystem.json --env production`. The `--env <environment_name>` allow to inject different set of environment variables.

Read more [here](http://pm2.keymetrics.io/docs/usage/application-declaration/#switching-to-different-environments)

## Related Commands

```
$ pm2 startOrRestart all.json            # Invoke restart on all apps in JSON
$ pm2 startOrReload all.json             # Invoke reload
$ pm2 startOrGracefulReload all.json     # Invoke gracefulReload
```

## Multi host deployment

To deploy to multiple host in the same time, just declare each host in an array under the attribute `host`

```javascript
{
  [...]
  "deploy" : {
    "production" : {
      "user" : "node",
      // Multi host in a js array
      "host" : ["212.83.163.1", "212.83.163.2", "212.83.163.3"],
      "ref"  : "origin/master",
      "repo" : "git@github.com:repo.git",
      "path" : "/var/www/production",
      "post-deploy" : "pm2 startOrRestart ecosystem.json --env production",
      "pre-deploy-local" : "echo 'This is a local executed command'"
    }
  [...]
}
```


## Using file key for authenticating

Just add the "key" attribute with file path to the .pem key within the attributes "user", "hosts"...

```javascript
    "production" : {
      "key"  : "/path/to/some.pem",
      "user" : "node",
      "host" : "212.83.163.1",
      "ref"  : "origin/master",
      "repo" : "git@github.com:repo.git",
      "path" : "/var/www/production",
      "post-deploy" : "pm2 startOrRestart ecosystem.json --env production"
    },
```

## Force deployment

You may get this message:

```
--> Deploying to dev environment
--> on host 192.168.1.XX

  push your changes before deploying

Deploy failed
```

If you want to deploy without pushing any data just append the `--force` option:

```bash
$ pm2 deploy ecosystem.json production --force
```

## Considerations

- You can use the option `--force` to skip local change detection
- You might want to commit your node_modules folder ([#622](https://github.com/Unitech/pm2/issues/622)) or add the `npm install` command to the `post-deploy` section: `"post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env production"`
- Verify that your remote server has the permission to git clone the repository
- You can declare specific environment variable depending on the environment you want to deploy the code to. For instance to declare variables for the production environment, just add "env_production": {} and declare that variables.
- PM2 will look by default to `ecosystem.json`. So you can skip the <configuration_file> options if it's the case
- You can embed the "apps" & "deploy" section in the package.json
- It deploys your code via ssh, you don't need any dependencies
- Process are initialized / started automatically depending on application name in `ecosystem.json`
- PM2-deploy repository is there: [pm2-deploy](https://github.com/Unitech/pm2-deploy)

## Contributing

The module is <a href="https://github.com/Unitech/pm2-deploy">https://github.com/Unitech/pm2-deploy</a>
Feel free to PR for any changes or fix.
