---
layout: none
title: Easy Deploy With SSH | Guide | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/guide/easy-deploy-with-ssh/"
description: "In many deployment workflows, the routine basically consists of connecting with SSH to multiple servers, git pull the latest version, then reload the app."
sitemap: false
redirect_to: "/docs/usage/deployment/"
---

# Easy Deploy with SSH

In many deployment workflows, the routine basically consists of connecting with SSH to multiple servers, git pull the latest version, then reload the app.

The PM2 deploy tool's purpose is to automate this task.

You set an array of distant hosts, a pre-deploy/post-deploy command line action, and you are done.

## Installation

### SSH setup

Be sure that you have the public ssh key on your local machine:

```bash
ssh-keygen -t rsa
ssh-copy-id node@myserver.com
```

### Ecosystem file

You first need to configure your ecosystem.config.js with all the necessary information:

```javascript
module.exports = {
  apps: [{
    name: "app",
    script: "app.js"
  }],
  deploy: {
    // "production" is the environment name
    production: {
      // SSH key path, default to $HOME/.ssh
      key: "/path/to/some.pem",
      // SSH user
      user: "ubuntu",
      // SSH host
      host: ["192.168.0.13"],
      // SSH options with no command-line flag, see 'man ssh'
      // can be either a single string or an array of strings
      ssh_options: "StrictHostKeyChecking=no",
      // GIT remote/branch
      ref: "origin/master",
      // GIT remote
      repo: "git@github.com:Username/repository.git",
      // path in the server
      path: "/var/www/my-repository",
      // Pre-setup command or path to a script on your local machine
      'pre-setup': "apt-get install git ; ls -la",
      // Post-setup commands or path to a script on the host machine
      // eg: placing configurations in the shared dir etc
      'post-setup': "ls -la",
      // pre-deploy action
      'pre-deploy-local': "echo 'This is a local executed command'",
      // post-deploy action
      'post-deploy': "npm install",
    },
  }
}
```

 To get more information about the deploy options, check the [ecosystem file reference]({{ site.baseurl }}{% link docs/runtime/reference/ecosystem-file.md %}).
{: .tip}

 Note that the distant path must be empty as it will be populated by pm2 deploy.
{: .tip}

### Setup

Make your first deploy and populate the distant path with:

```bash
pm2 deploy production setup
```

### Deploy

Here are some useful commands:

```bash
# Setup deployment at remote location
pm2 deploy production setup

# Update remote version
pm2 deploy production update

# Revert to -1 deployment
pm2 deploy production revert 1

# execute a command on remote servers
pm2 deploy production exec "pm2 reload all"
```

## Deployment options

Display deploy help via `pm2 deploy help`:

```
pm2 deploy <configuration_file> <environment> <command>

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

## Force deployment

You may get this message:

```
--> Deploying to dev environment
--> on host 192.168.1.XX

  push your changes before deploying

Deploy failed
```

That means that you have changes in your local system that aren't pushed inside your git repository, and since the deploy script get the update via `git pull` they will not be on your server.
If you want to deploy without pushing any data, you can append the `--force` option:

```bash
pm2 deploy ecosystem.json production --force
```

## Considerations

- You can use the option `--force` to skip local change detection

- Verify that your remote server has the permission to git clone the repository

- You can declare specific environment variables depending on the environment you want to deploy the code to. For instance to declare variables for the production environment, add "env_production": {} and declare the variables.

- You can embed the "apps" & "deploy" section in the package.json

## SSH clone errors
In most cases, these errors will be caused by `pm2` not having the correct keys to clone your repository. You need to verify at every step that the keys are available.

__Step 1__
If you are certain your keys are correctly working, first try running `git clone your_repo.git` on the target server. If it succeeds, move onto the next steps. If it failed, make sure your keys are stored both on the server and on your git account.

__Step 2__
By default `ssh-copy-id` copies the default identiy, usually named `id_rsa`. If that is not the appropriate key:

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

## Windows Consideration

To run the deploy script under Windows, you need to use a unix shell like bash, so we recommend to install either [Git bash](https://git-scm.com/download/win), [Babun](http://babun.github.io/) or  [Cygwin](https://cygwin.com/install.html)

## Contributing

This tool is a separate module of pm2. You can contribute to it [here](https://github.com/Unitech/pm2-deploy).

## Next Steps

Thanks for finishing this guide.
