---
layout: docs
title: Capistrano like deployments
description: How to deploy with pm2, symlinks and a correct working directory
permalink: /docs/tutorials/capistrano-like-deployments
---

## Capistrano like deployments

## The main issue

No matter the tools you use to deploy your code, you might get confronted to a **Capistrano**-like structure. 
In general, the method will have a directory tree like this one:

```
project_root
├── current -> releases/20150301100000 # this is a symlink to the current release
└── releases
    ├── 20150301100000
    ├── 20150228100000
    └── 20150226100000
```

In most of this kind of deployment, old and no longer used releases get deleted. Indeed, a new release will have the following consequences:

1. The project is deployed to a new path, here `releases/YYYYMMDDHHMMSS`
2. The `current` symlink changes to the new path
3. Old releases are deleted.

With PM2, you can be tempted to run everything like you usually would, for example:

1. Do the deployment
2. Restart the PM2 script from the freshly deployed directory

But wait, there is something wrong with this method. Let's illustrate with the first to the 11th deployments. In our example, the 1st release will get deleted while we want to keep 10 releases:

1. Do the first deployment
2. From the `current` path, start our project `pm2 startOrRestart index.js`, the current working directory is `releases/20150301100000`
3. Days are going by
4. 11th deployment 
5. The 1st deployment is no longer used, in consequence it gets deleted
6. `pm2 startOrRestart index.js` (or any PM2 command) will fail with error `Error: ENOENT, no such file or directory for process.cwd()`

What has gone wrong then? 
It's really straightforward: 10 days ago, PM2 was started in the `releases/20150301100000` but this one just got removed! 
So, `process.cwd()` doesn't exist anymore. It's just like running two shells in the same directory, removing it from one shell and trying to run any command in the other shell. 
It will fail and generate this kind of error:

```
fatal: Unable to read current working directory: No such file or directory.
```

## The solution

In my opinion, Capistrano structures are great. They allow you to rollback with nothing more than a symlink change. 
To resolve this issue we just need to start PM2 in a directory that will never get removed.
My proposal here is to define an absolute `project_root`. It will store all the necessary tools required to get our application on tracks such as configuration files, logs, data (i.e. sqlite) etc. 

The structure should look like this now:

```
project_root # in this example absolute path is /home/www/project_root
├── current -> releases/20150301100000 # this is a symlink to the current release
├── releases
|   ├── 20150301100000
|   ├── 20150228100000
|   └── 20150226100000
├── logs # keeping our pm2 logs in here is a good idea so that they stay the same between deployments
└── configuration # Are you comitting your database environments?
```

And, what's more important than this is to define the PM2 ecosystem to match this structure:

```json
# ecosystem.json
{
  "apps": [{
    "name": "my-app",
    "script": "./index.js",
    "cwd": "/home/www/project_root/current", 
    "error_file": "/home/www/project_root/logs/app.err.log",
    "out_file": "../logs/app.out.log", #this is the same as the absolute error_file path
    "exec_mode": "fork_mode"
  }]
}
```

*You don't like absolute paths in this configuration? Use the `PWD` environement variable instead!*

Now, the `ecosystem.json` is usually inside your project, or repository. To start it properly you'll have to start PM2 from the `project_root` directory:

```bash
# somewhere in your deployment script
cd /home/www/project_root
pm2 startOrRestart current/ecosystem.json
```

## Logs and data tip

When working in continuous integration world, you'll rather have the `logs` and `data` directories inside your repository. This eases the testability and portability of your application. When refering to a Capistrano structure, my suggestion would be to symlink data directories to the parent level.

In this case, the `ecosystem.json` can be like this:

```json
# ecosystem.json
{
  "apps": [{
    "name": "my-app",
    "script": "./index.js",
    "cwd": "/home/www/project_root/current",
    "error_file": "./logs/app.err.log",
    "out_file": "./logs/app.out.log", 
    "exec_mode": "fork_mode"
  }]
}
```

And the static project directory would be:

```
project_root 
├── logs 
├── configuration 
|   └── development.yml 
└── data 
    ├── staging.sqlite 
    └── development.sqlite 
```

When deployed, all you have to do is to link `logs`, `configuration`, `data` to the parent directory! 
This way, in a deployed environment of the same project, it'd look a lot like this:

```
project_root 
├── logs -> ../logs
├── configuration  -> ../configuration
└── data -> /home/www/project_root/data # absolute path for the example
```

For more informations, take a look at the [original issue](https://github.com/Unitech/pm2/issues/1623).

## Shipit PM2 example

This is the task I use with [shipit](https://github.com/shipitjs/shipit). Note that the same command could apply to most of the deployment tools.

```javascript
function pm2Task(gruntOrShipit) {
  let shipit = utils.getShipit(gruntOrShipit)

  utils.registerTask(shipit, 'pm2', task)

  function task() {
    shipit.log('Launching pm2') 

    let schema = shipit.config.pm2 && shipit.config.pm2.script ? shipit.config.pm2.script : 'ecosystem.json'

    let cmd = `SOME_APP_ENV="${shipit.environment}" cd ${shipit.config.deployTo} && pm2 startOrRestart --env ${shipit.environment} current/${schema}`

    return shipit.remote(cmd)
  }

  shipit.on('cleaned', function() {
    return shipit.start('pm2') 
  })
}
```

In our example, the executed command would result in:

```bash
SOME_APP_ENV="production" cd /home/www/project_root && pm2 startOrRestart --env production current/ecosystem.json`
```

Note that I'm using [PM2's environments ability](http://pm2.keymetrics.io/docs/usage/application-declaration/#switching-to-different-environments) on top of declaring my own environment variable (`SOME_APP_ENV`).
