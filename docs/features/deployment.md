---
layout: docs
title: Deployment
description: Easily deploy applications with PM2
permalink: /docs/usage/deployment/
---

## Deployment System

PM2 features a simple but powerful deployment system that allows to provision and update applications in production environment. This is great when you want to deploy applications on a baremetal server in one or many servers at once. 

```bash
> pm2 deploy <configuration_file> <environment> <command>

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

### Deployment Configuration

To configure the deployment system, add a `deploy` attribute to the Application Configuration File:

```javascript
module.exports = {
  apps : [{
    script: 'api.js',
  }, {
    script: 'worker.js'
  }],
   
  // Deployment Configuration
  deploy : {
    production : {
       "user" : "ubuntu",
       "host" : ["192.168.0.13", "192.168.0.14", "192.168.0.15"],
       "ref"  : "origin/master",
       "repo" : "git@github.com:Username/repository.git",
       "path" : "/var/www/my-repository",
       "post-deploy" : "npm install"
    }
  }
};
```

**Note**: make sure the application configuration file in the local folder is named either ecosystem.config.js or pm2.config.js, so you don't need to type the configuration filename for each command.

### Provision remote server

Before provisioning remote server verify that:

- Remote servers have PM2 installed
- Remote servers have granted permissions to GIT clone the target repository

Once remote servers have been configured you can start provisioning them:

```bash
$ pm2 deploy production setup
```

**Note**: as the app configuration file is named ecosystem.config.js or pm2.config.js in the local folder, you do not need to specify the filename each time

### Deploy application

Once the remote server have been provisioned you can now deploy the application:

```bash
$ pm2 deploy production
```

**Note**: if git report an error that there are local changes but still want to push what is on the remote GIT, you can use the `--force` option to force deployment. 

### Rollback to previous deployment

If you need to rollback to previous deployment you can use the `revert` option:

```bash
# Revert to -1 deployment
$ pm2 deploy production revert 1
```

### Execute a command on each server

To execute a one-time running command you can use the `exec` option:

```bash
$ pm2 deploy production exec "pm2 reload all"
```

### Specifics

#### Deployment Lifecycle

When deploying with PM2, you can specify what do before/after setup and before/after update:

```
"pre-setup" : "echo 'commands or local script path to be run on the host before the setup process starts'",
"post-setup": "echo 'commands or a script path to be run on the host after cloning the repo'",
"pre-deploy" : "pm2 startOrRestart ecosystem.json --env production",
"post-deploy" : "pm2 startOrRestart ecosystem.json --env production",
"pre-deploy-local" : "echo 'This is a local executed command'"
```

#### Multi host deployment

To deploy to multiple hosts in the same time, you just have to declare each host in an array under the attribute `host`.

```
"host" : ["212.83.163.1", "212.83.163.2", "212.83.163.3"],
```

#### Specifying SSH keys

You just have to add the "key" attribute with path to the public key, see below example :

```javascript
    "production" : {
      "key"  : "/path/to/some.pem", // path to the public key to authenticate
      "user" : "node",              // user used to authenticate
      "host" : "212.83.163.1",      // where to connect
      "ref"  : "origin/master",
      "repo" : "git@github.com:repo.git",
      "path" : "/var/www/production",
      "post-deploy" : "pm2 startOrRestart ecosystem.json --env production"
    },
```

### Troubleshooting

#### SSH clone errors

In most cases, these errors will be caused by `pm2` not having the correct keys to clone your repository. You need to verify at every step that the keys are available.

__Step 1__
If you are certain your keys are correctly working, first try running `git clone your_repo.git` on the target server. If it succeeds, move onto the next steps. If it failed, make sure your keys are stored both on the server and on your git account.

__Step 2__
By default `ssh-copy-id` copies the default identity, usually named `id_rsa`. If that is not the appropriate key:

```bash
ssh-copy-id -i path/to/my/key your_username@server.com
```
This adds your public key to the `~/.ssh/authorized_keys` file.

__Step 3__
If you get the following error:
```
--> Deploying to production environment
--> on host mysite.com
  ○ hook pre-setup
  ○ running setup
  ○ cloning git@github.com:user/repo.git
Cloning into '/var/www/app/source'...
Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights and that the repository exists.

**Failed to clone**

Deploy failed
```
...you may want to create a ssh config file. This is a sure way to ensure that the correct ssh keys are used for any given repository you're trying to clone. See [this example](https://gist.github.com/Protosac/c3fb459b1a942f161f23556f61a67d66):

```
# ~/.ssh/config
Host alias
    HostName myserver.com
    User username
    IdentityFile ~/.ssh/mykey
# Usage: `ssh alias`
# Alternative: `ssh -i ~/.ssh/mykey username@myserver.com`

Host deployment
    HostName github.com
    User username
    IdentityFile ~/.ssh/github_rsa
# Usage:
# git@deployment:username/anyrepo.git
# This is for cloning any repo that uses that IdentityFile. This is a good way to make sure that your remote cloning commands use the appropriate key
```
