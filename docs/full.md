---
layout: docs
title: Single Page Doc
description: One page documentation
permalink: /docs/usage/pm2-doc-single-page/
---


## Welcome!

Welcome to the PM2 Quick Start!

PM2 is daemon process manager that will help you manage and keep your application online. Getting started with PM2 is straightforward, it is offered as a simple and intuitive CLI, installable via NPM.


## Installation

The latest PM2 version is installable with NPM or Yarn:

```bash
$ npm install pm2@latest -g
# or
$ yarn global add pm2
```

To install Node.js and NPM you can use [NVM](https://yoember.com/nodejs/the-best-way-to-install-node-js/)

## Start an app

The simplest way to start, daemonize and monitor your application is by using this command line:

```bash
$ pm2 start app.js
```

Or start any other application easily:

```bash
$ pm2 start bashscript.sh
$ pm2 start python-app.py --watch
$ pm2 start binary-file -- --port 1520
```

Some options you can pass to the CLI:

```bash
# Specify an app name
--name <app_name>

# Watch and Restart app when files change
--watch

# Set memory threshold for app reload
--max-memory-restart <200MB>

# Specify log file
--log <log_path>

# Pass extra arguments to the script
-- arg1 arg2 arg3

# Delay between automatic restarts
--restart-delay <delay in ms>

# Prefix logs with time
--time

# Do not auto restart app
--no-autorestart

# Specify cron for forced restart
--cron <cron_pattern>

# Attach to application log
--no-daemon
```

As you can see many options are available to manage your application with PM2. You will discover them depending on your use case.

## Managing processes

Managing application state is simple here are the commands:

```bash
$ pm2 restart app_name
$ pm2 reload app_name
$ pm2 stop app_name
$ pm2 delete app_name
```

Instead of `app_name` you can pass:
- `all` to act on all processes
- `id` to act on a specific process id

## Check status, logs, metrics

Now that you have started this application, you can check his status, logs, metrics and even get the online dashboard with <a href="https://pm2.io" target="_blank">pm2.io</a>.

### List managed applications

List the status of all application managed by PM2:

```bash
$ pm2 [list|ls|status]
```

![https://i.imgur.com/LmRD3FN.png](https://i.imgur.com/LmRD3FN.png)

### Display logs

To display logs in realtime:

```bash
$ pm2 logs
```

To dig in older logs:

```bash
$ pm2 logs --lines 200
```

### Terminal Based Dashboard

Here is a realtime dashboard that fits directly into your terminal:

```bash
$ pm2 monit
```

![https://i.imgur.com/xo0LDb7.png](https://i.imgur.com/xo0LDb7.png)

### pm2.io: Monitoring & Diagnostic Web Interface

Web based dashboard, cross servers with diagnostic system:

```bash
$ pm2 plus
```

![https://i.imgur.com/sigMHli.png](https://i.imgur.com/sigMHli.png)

## Cluster mode

For Node.js applications, PM2 includes an automatic load balancer that will share all HTTP[s]/Websocket/TCP/UDP connections between each spawned processes.

To start an application in Cluster mode:

```
$ pm2 start app.js -i max
```

Read more about cluster mode [here](/docs/usage/cluster-mode/).

## Ecosystem File

You can also create a configuration file, called Ecosystem File, to manage multiple applications.
To generate an Ecosystem file:

```bash
$ pm2 ecosystem
```

This will generate and ecosystem.config.js file:

```javascript
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }, {
     name: 'worker',
     script: 'worker.js'
  }]
}
```

And start it easily:

```bash
$ pm2 start process.yml
```

Read more about application declaration [here](/docs/usage/application-declaration/).

## Setup startup script

Restarting PM2 with the processes you manage on server boot/reboot is critical. To solve this, just run this command to generate an active startup script:

```bash
$ pm2 startup
```

And to freeze a process list for automatic respawn:

```bash
$ pm2 save
```
Read more about startup script generator [here](/docs/usage/startup/).

## Restart application on changes

It's pretty easy with the `--watch` option:

```bash
$ cd /path/to/my/app
$ pm2 start env.js --watch --ignore-watch="node_modules"
```

This will watch & restart the app on any file change from the current directory + all subfolders and it will ignore any changes in the node_modules folder `--ignore-watch="node_modules"`. 

You can then use `pm2 logs` to check for restarted app logs.

## Updating PM2

We made it simple, there is no breaking change between releases and the procedure is straightforward:

```bash
npm install pm2@latest -g
```

Then update the in-memory PM2 :

```bash
pm2 update
```

## CheatSheet

Here are some commands that are worth knowing. Just try them with a sample application or with your current web application on your development machine:

```bash
# Fork mode
pm2 start app.js --name my-api # Name process

# Cluster mode
pm2 start app.js -i 0        # Will start maximum processes with LB depending on available CPUs
pm2 start app.js -i max      # Same as above, but deprecated.
pm2 scale app +3             # Scales `app` up by 3 workers
pm2 scale app 2              # Scales `app` up or down to 2 workers total

# Listing

pm2 list               # Display all processes status
pm2 jlist              # Print process list in raw JSON
pm2 prettylist         # Print process list in beautified JSON

pm2 describe 0         # Display all informations about a specific process

pm2 monit              # Monitor all processes

# Logs

pm2 logs [--raw]       # Display all processes logs in streaming
pm2 flush              # Empty all log files
pm2 reloadLogs         # Reload all logs

# Actions

pm2 stop all           # Stop all processes
pm2 restart all        # Restart all processes

pm2 reload all         # Will 0s downtime reload (for NETWORKED apps)

pm2 stop 0             # Stop specific process id
pm2 restart 0          # Restart specific process id

pm2 delete 0           # Will remove process from pm2 list
pm2 delete all         # Will remove all processes from pm2 list

# Misc

pm2 reset <process>    # Reset meta data (restarted time...)
pm2 updatePM2          # Update in memory pm2
pm2 ping               # Ensure pm2 daemon has been launched
pm2 sendSignal SIGUSR2 my-app # Send system signal to script
pm2 start app.js --no-daemon
pm2 start app.js --no-vizion
pm2 start app.js --no-autorestart
```

## What's next?

Learn how to declare all your application's behavior options into a [JSON configuration file](http://pm2.keymetrics.io/docs/usage/application-declaration/).

Learn how to do [clean stop and restart](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/) to increase reliability.

Learn how to [deploy and update production applications easily](http://pm2.keymetrics.io/docs/usage/deployment/).

Monitor your production applications with [Keymetrics](https://keymetrics.io/).

## How to update PM2

Install the latest pm2 version:

```bash
npm install pm2@latest -g
```

Then update the in-memory PM2 :

```bash
pm2 update
```


## Ecosystem File

PM2 empowers your process management workflow. It allows you to fine-tune the behavior, options, environment variables, logs files of each application via a process file. It's particularly useful for micro-service based applications.

Configuration format supported are Javascript, JSON and YAML.

## Generate configuration

To generate a sample process file you can type this command:

```
pm2 ecosystem
```

This will generate a sample `ecosystem.config.js`:

```javascript
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```

Once edited at your convenience you can start/restart/stop/delete this file via CLI:

```bash
$ pm2 [start|restart|stop|delete] ecosystem.config.js
```

Checkout [the section about acting with CLI](#cli) on ecosystem.config.js to know more.

### Javascript format

You can declare multiple application easily and specify different options for each of them:

```javascript
module.exports = {
  apps : [{
    name        : "worker",
    script      : "./worker.js",
    watch       : true,
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name       : "api-app",
    script     : "./api.js",
    instances  : 4,
    exec_mode  : "cluster"
  }]
}
```

**Note that using a Javascript configuration file requires to end the file name with `.config.js`**

### YAML format

You can also create a Ecosystem file in YAML format.
Example:

```yaml
apps:
  - script   : ./api.js
    name     : 'api-app'
    instances: 4
    exec_mode: cluster
  - script : ./worker.js
    name   : 'worker'
    watch  : true
    env    :
      NODE_ENV: development
    env_production:
      NODE_ENV: production
```

### CLI

Then you can run and manage your processes easily:

```bash
# Start all applications
pm2 start ecosystem.config.js

# Start only the app named worker-app
pm2 start ecosystem.config.js --only worker-app

# Stop all
pm2 stop ecosystem.config.js

# Restart all
pm2 start   ecosystem.config.js
## Or
pm2 restart ecosystem.config.js

# Reload all
pm2 reload ecosystem.config.js

# Delete all
pm2 delete ecosystem.config.js
```

### Act on a specific process

You can also act on a particular application by using its name and the option `--only <app_name>`:

```bash
pm2 start   ecosystem.config.js --only api-app
pm2 restart ecosystem.config.js --only api-app
pm2 reload  ecosystem.config.js --only api-app
pm2 delete  ecosystem.config.js --only api-app
```

### Switching environments

You may have noticed that you can declare environment-specific variables with the attribute `env_*` (e.g. env_production, env_staging...). They can be switched easily. You just need to specify the `--env <environment_name>` when acting on the application declaration.

Example:

```bash
# Inject what is declared in env_production
pm2 start process.json --env production

# Inject what is declared in env_staging
pm2 restart process.json --env staging
```

## Attributes available

Application behavior and configuration can be fine-tuned with the following attributes:

### General

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|name   | (string)   | "my-api" | application name (default to script filename without extension)|
|script| (string)    | "./api/app.js" | script path relative to pm2 start|
|cwd| (string)       | "/var/www/" | the directory from which your app will be launched|
|args| (string)      | "-a 13 -b 12" | string containing all arguments passed via CLI to script|
|interpreter| (string) | "/usr/bin/python" |interpreter absolute path (default to node)|
|interpreter_args| (string) | "--harmony" | option to pass to the interpreter|
|node_args| (string) |   |alias to interpreter_args |


### Advanced features

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|instances | number | -1 | number of app instance to be launched |
|exec_mode | string | "cluster" | mode to start your app, can be "cluster" or "fork", default fork|
| watch   | boolean or [] |  true |  enable watch & restart feature, if a file change in the folder or subfolder, your app will get reloaded |
|    ignore_watch    |   list  |     ["[\\/\\\\]\\./", "node_modules"]     | list of regex to ignore some file or folder names by the watch feature|
| max_memory_restart |  string |  "150M" |  your app will be restarted if it exceeds the amount of memory specified. human-friendly format : it can be "10M", "100K", "2G" and so on... |
| env |  object |   {"NODE_ENV": "development", "ID": "42"}  | env variables which will appear in your app |
| env_<ENV_NAME> |  object |   {"NODE_ENV": "production", "ID": "89"}  | inject <ENV_NAME> when doing pm2 restart app.yml --env <ENV_NAME>|
| source_map_support | boolean |  true | default to true, [enable/disable source map file]
| instance_var | string | "NODE_APP_INSTANCE" | [see documentation](http://pm2.keymetrics.io/docs/usage/environment/#specific-environment-variables)|

### Log files

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|log_date_format| (string) | "YYYY-MM-DD HH:mm Z" | log date format (see log section)|
|error_file| (string)| | error file path (default to $HOME/.pm2/logs/XXXerr.log)|
|out_file| (string) | | output file path (default to $HOME/.pm2/logs/XXXout.log)|
|combine_logs| boolean | true | if set to true, avoid to suffix logs file with the process id |
|merge_logs| boolean | true | alias to combine_logs |
|pid_file| (string) | | pid file path (default to $HOME/.pm2/pid/app-pm_id.pid)|

### Control flow

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|min_uptime| (string) | | min uptime of the app to be considered started |
| listen_timeout | number | 8000 | time in ms before forcing a reload if app not listening |
| kill_timeout | number | 1600 | time in milliseconds before sending [a final SIGKILL](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/#cleaning-states-and-jobs) |
| wait_ready | boolean | false | Instead of reload waiting for listen event, wait for process.send('ready') |
| max_restarts| number | 10 | number of consecutive unstable restarts (less than 1sec interval or custom time via min_uptime) before your app is considered errored and stop being restarted|
| restart_delay    | number |                    4000                   |                             time to wait before restarting a crashed app (in milliseconds). defaults to 0.|
| autorestart | boolean |  false  |  true by default. if false, PM2 will not restart your app if it crashes or ends peacefully  |
| cron_restart    |  string |                "1 0 * * *"                |                                      a cron pattern to restart your app. Application must be running for cron feature to work  |
| vizion       | boolean |                   false                   |  true by default. if false, PM2 will start without vizion features (versioning control metadatas) |
| post_update    |   list  | ["npm install", "echo launching the app"] |                                        a list of commands which will be executed after you perform a Pull/Upgrade operation from Keymetrics dashboard |
| force       | boolean |                    true                   |                                          defaults to false. if true, you can start the same script several times which is usually not allowed by PM2 |

### Deployment 

Entry name|Description|Type|Default
---|---|---|---
key|SSH key path|String|$HOME/.ssh
user|SSH user|String|
host|SSH host|[String]|
ssh_options|SSH options with no command-line flag, see 'man ssh'|String or [String]|
ref|GIT remote/branch|String|
repo|GIT remote|String|
path|path in the server|String|
pre-setup| Pre-setup command or path to a script on your local machine|String|
post-setup|Post-setup commands or path to a script on the host machine|String
pre-deploy-local|pre-deploy action|String|
post-deploy|post-deploy action|String|

## Considerations

All command line options passed when using the JSON app declaration will be dropped i.e.

### Multiple JSON

You can start as many JSON application declarations as you want.

```bash
$ cat node-app-1.json
{
  "name" : "node-app-1",
  "script" : "app.js",
  "cwd" : "/srv/node-app-1/current"
}

$ cat node-app-2.json
{
  "name" : "node-app-2",
  "script" : "app2.js",
  "cwd" : "/srv/node-app-2/current"
}
```

```bash
pm2 start node-app-1.json
pm2 start node-app-2.json
```

Will result in two apps launched:

```
ps aux | grep node-app
root  14735  5.8  1.1  752476  83932 ? Sl 00:08 0:00 pm2: node-app-1
root  24271  0.0  0.3  696428  24208 ? Sl 17:36 0:00 pm2: node-app-2
```

### CWD

**cwd:** your JSON declaration does not need to reside with your script.  If you wish to maintain the JSON(s) in a location other than your script (say, `/etc/pm2/conf.d/node-app.json`) you will need to use the `cwd` feature (Note, this can be really helpful for capistrano style directory structures that uses symlinks). Files can be either relative to the `cwd` directory, or absolute (see example below).

### CLI/JSON options

All the keys can be used in a JSON configured file, but will remain almost the same on the command line e.g.:

```
exec_mode         -> --execute-command
max_restarts      -> --max-restarts
force             -> --force
```

Using quotes to make an ESC, e.g.:

```bash
$pm2 start test.js --node-args "port=3001 sitename='first pm2 app'"
```

The `nodeArgs` argument will be parsed as

```JSON
[
  "port=3001",
  "sitename=first pm2 app"
]
```

but not

```JSON
[
  "port=3001",
  "sitename='first",
  "pm2",
  "app'"
]
```

### Disabling logs

You can pass `/dev/null` to error_file or out_file to disable logs saving.
Note: starting PM2 `2.4.0`, `/dev/null` or `NULL` disable logs independently of the platform.

### Logs suffix

You can disable automatic ID suffixs on logs (e.g. `app-name-ID.log`) by passing enabling the option `merge_logs: true`

### Environment definition

You'll need to use `--env <envname>` to tell pm2 to use specific environment defined inside a process file :

```json
{
  "apps" : [{
    "name"        : "worker",
    "script"      : "./worker.js",
    "watch"       : true,
    "env": {
      "NODE_ENV": "development"
    },
    "env_production" : {
       "NODE_ENV": "production"
    }
  },{
    "name"       : "api-app",
    "script"     : "./api.js",
    "instances"  : 4,
    "exec_mode"  : "cluster"
  }]
}
```

In this example, you will run `pm2 start ecosystem.json` and it will start your application with the default environment (in development so).
Then you use `pm2 start ecosystem.json --env production` and it will use the attribute `env_<name>` where name is `production` here, so it will start your app with `NODE_ENV=production`.

### Special `ext_type`

- min_uptime
  Value of `min_uptime` can be:
    - **Number**
      e.g. `"min_uptime": 3000` means 3000 milliseconds.
    - **String**
      Therefore, we are making it short and easy to configure: `h`, `m` and `s`, e.g.: `"min_uptime": "1h"` means one hour, `"min_uptime": "5m"` means five minutes and `"min_uptime": "10s"` means ten seconds (those will be transformed into milliseconds).

- max_memory_restart
  Value of `max_memory_restart` can be:
    - **Number**
        e.g. `"max_memory_restart": 1024` means 1024 bytes (**NOT BITS**).
    - **String**
        Therefore, we are making it short and easy to configure: `G`, `M` and `K`, e.g.: `"max_memory_restart": "1G"` means one gigabyte, `"max_memory_restart": "5M"` means five megabytes and `"max_memory_restart": "10K"` means ten kilobytes (those will be transformed into byte(s)).

- Optional values
  For example `exec_mode` can take `cluster` (`cluster_mode`) or `fork` (`fork_mode`) as possible values.

- Things to know
  - `"instances": 0` means that PM2 will launch the maximum processes possible according to the numbers of CPUs (cluster mode)
  - array
  `args`, `node_args` and `ignore_watch` could be type of `Array` (e.g.: `"args": ["--toto=heya coco", "-d", "1"]`) or `string` (e.g.: `"args": "--to='heya coco' -d 1"`)


## Cluster Mode

The **cluster mode** allows networked Node.js applications (http(s)/tcp/udp server) to be scaled accross all CPUs available, without any code modifications. This greatly increases the performance and reliability of your applications, depending on the number of CPUs available.  Under the hood, this uses the Node.js [cluster module](https://nodejs.org/api/cluster.html) such that the scaled application's child processes can automatically share server ports. To learn more, see [How It Works](https://nodejs.org/api/cluster.html#cluster_how_it_works) in the official Node.js documentation on the cluster module.

![http://i.imgur.com/kTAowsL.png](http://i.imgur.com/kTAowsL.png)

## Usage

To enable the **cluster mode**, just pass the -i <instances> option:

```bash
pm2 start app.js -i max
```

`max` means that PM2 will auto detect the number of available CPUs and run as many processes as possible

Or via a [js/yaml/json file](http://pm2.keymetrics.io/docs/usage/application-declaration/):

```javascript
module.exports = {
  apps : [{
    script    : "api.js",
    instances : "max",
    exec_mode : "cluster"
  }]
}
```

**NOTE**: you need to set the exec_mode to `cluster` so PM2 know you want to load balance between each instances, by default it will not

Then to start the Process File:

```bash
pm2 start processes.json
```

The *-i* or *instances* option can be:
- **0/max** to spread the app across all CPUs
- **-1** to spread the app across all CPUs - 1
- **number** to spread the app across **number** CPUs

## Reload

As opposed to `restart`, which kills and restarts the process, `reload` achieves a **0-second-downtime** reload.

To reload an app:

```bash
pm2 reload <app_name>
```

Or:

```bash
pm2 reload process.json
pm2 reload process.json --only api
```

If the reload system hasn't managed to reload your application, a timeout will fallback to a classic restart.

## Graceful Shutdown

In production environment, you may need to wait for remaining queries to be processed or close all connections before exiting the application. On the *PM2 reload context* it can be translated into a very long reload or a reload that doesn't work (fallback to restart) meaning that your application still has open connections on exit. You may alternatively need to close all databases connections, clear data queues or whatever.

To Gracefully Shutdown an application you can catch the **SIGINT** signal (the first signal sent on exit by PM2) and execute actions to wait/clear all these states:

```javascript
process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });
});
```

[Read more about Graceful Shutdown](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/) feature.

## Statelessify your application

Be sure your [**application is stateless**](http://pm2.keymetrics.io/docs/usage/specifics/#stateless-apps) meaning that no local data is stored in the process, for example sessions/websocket connections, session-memory and related. Use Redis, Mongo or other databases to share states between processes.

Another resource on how to write efficient, production ready stateless application is [The Twelve Factor Application manifesto](https://12factor.net/).


## Contributing/Development mode

It's very simple to play with PM2:

```bash
pm2 kill   # kill the current pm2
git clone my_pm2_fork.git
cd pm2/
DEBUG=* ./bin/pm2 --no-daemon
```

Each time you edit the code, be sure to kill and restart PM2 to make changes taking effect.


**DEBUG="*"** Allows to display all possible debug logs in ~/.pm2/pm2.log

## Install PM2 development

```bash
npm install https://github.com/Unitech/pm2#development -g
```

## Launch the tests

Master: [![Build Status](https://img.shields.io/travis/Unitech/pm2/master.svg?style=flat-square)](https://travis-ci.org/Unitech/pm2)

Dev   : [![Build Status](https://img.shields.io/travis/Unitech/pm2/development.svg?style=flat-square)](https://travis-ci.org/Unitech/pm2)

Just try the tests before using PM2 on your production server:

```bash
git clone https://github.com/Unitech/pm2.git
cd pm2
npm install  # Or do NODE_ENV=development npm install if some packages are missing
npm test
```

If a test is not correctly working, please report issues [here](https://github.com/Unitech/pm2/issues?state=open).
You should also make sure that you have all dependencies needed. 
For Ubuntu:

```bash
sudo apt-get install build-essential
# nvm is a Node.js version manager - https://github.com/creationix/nvm
wget -qO- https://raw.github.com/creationix/nvm/master/install.sh | sh
nvm install 4
nvm use 4
```


## Getting started

PM2 embeds a simple and powerful deployment system with revision tracing. [Another step by step tutorial here](https://keymetrics.io/2014/06/25/ecosystem-json-deploy-and-iterate-faster/).

Please read the [Considerations to use PM2 deploy](#considerations).

## Simple deploy

Baically you only need to add a "deploy" attribute to the ecosystem.json. Here is a bare minimum to deploy an application:

process.json:

```javascript
{
   "apps" : [{
      "name" : "HTTP-API",
      "script" : "http.js"
   }],
   "deploy" : {
     // "production" is the environment name
     "production" : {
       "user" : "ubuntu",
       "host" : ["192.168.0.13"],
       "ref"  : "origin/master",
       "repo" : "git@github.com:Username/repository.git",
       "path" : "/var/www/my-repository",
       "post-deploy" : "npm install; grunt dist"
      },
   }
}
```

/bin/bash:

```bash
# Setup deployment at remote location
$ pm2 deploy production setup

# Update remote version
$ pm2 deploy production update

# Revert to -1 deployment
$ pm2 deploy production revert 1

# execute command on remote machines
$ pm2 deploy production exec "pm2 reload all"
```

## Complete tutorial

1- Generate a sample ecosystem.json file that lists the processes and the deployment environment.

```bash
pm2 ecosystem
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
      // To prepare the host by installing required software (eg: git)
      // even before the setup process starts
      // can be multiple commands separated by the character ";"
      // or path to a script on your local machine
      "pre-setup" : "apt-get install git",
      // Commands / path to a script on the host machine
      // This will be executed on the host after cloning the repository
      // eg: placing configurations in the shared dir etc
      "post-setup": "ls -la",
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
ssh-keygen -t rsa
ssh-copy-id node@myserver.com
```
If you encounter any errors, please refer to the troubleshooting section below.

3- Now initialize the remote folder with:

```bash
pm2 deploy <configuration_file> <environment> setup
```

Example:

```bash
pm2 deploy ecosystem.json production setup
```

This command will create the folders on your remote server.

4- Deploy your code

```bash
pm2 deploy ecosystem.json production
```

Now your code will be populated, installed and started with PM2.

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

## Use different set of env variables

In the `post-deploy` attribute, you may have noticed the command `pm2 startOrRestart ecosystem.json --env production`. The `--env <environment_name>` allows to inject different sets of environment variables.

Read more [here](http://pm2.keymetrics.io/docs/usage/application-declaration/#switching-to-different-environments).

## Related Commands

```
pm2 startOrRestart all.json            # Invoke restart on all apps in JSON
pm2 startOrReload all.json             # Invoke reload
```

## Multi host deployment

To deploy to multiple hosts in the same time, you just have to declare each host in an array under the attribute `host`.

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
      "pre-setup" : "echo 'commands or local script path to be run on the host before the setup process starts'",
      "post-setup": "echo 'commands or a script path to be run on the host after cloning the repo'",
      "post-deploy" : "pm2 startOrRestart ecosystem.json --env production",
      "pre-deploy-local" : "echo 'This is a local executed command'"
    }
  [...]
}
```


## Using SSH keys

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
- You might want to commit your node_modules folder ([#622](https://github.com/Unitech/pm2/issues/622)) or add the `npm install` command to the `post-deploy` section: `"post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env production"`
- Verify that your remote server has the permission to git clone the repository
- You can declare specific environment variables depending on the environment you want to deploy the code to. For instance to declare variables for the production environment, add "env_production": {} and declare the variables.
- By default, PM2 will use `ecosystem.json`. So you can skip the <configuration_file> options if this is the case
- You can embed the "apps" & "deploy" section in the package.json
- It deploys your code via ssh, you don't need any dependencies
- Processes are initialized / started automatically depending on the application name in `ecosystem.json`
- PM2-deploy repository can be found here: [pm2-deploy](https://github.com/Unitech/pm2-deploy)
- **WINDOWS** : see point below (at the end)

## Troubleshooting
##### SSH clone errors
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

The module is <a href="https://github.com/Unitech/pm2-deploy">https://github.com/Unitech/pm2-deploy</a>
Feel free to PR for any changes or fix.


<center style="margin-top: 28px; margin-bottom: 23px">
<img src="/images/docker_logo.png" title="Docker PM2 Node.js"/>
</center>

## Docker Integration

Using Containers? We got your back. Start today using **pm2-runtime**, a perfect companion to get the most out of Node.js in production environment.

The goal of pm2-runtime is to wrap your applications into a proper Node.js production environment. It solves major issues when running Node.js applications inside a container like:

- Second Process Fallback for High Application Reliability
- Process Flow Control
- Automatic Application Monitoring to keep it always sane and high performing
- Automatic Source Map Discovery and Resolving Support 

Further than that, using PM2 as a layer between the container and the application brings PM2 powerful features like [application declaration file](/docs/usage/application-declaration/), [customizable log system](/docs/usage/log-management/) and other great features to manage your Node.js application in production environment.

## Use PM2 inside Containers

In your Dockerfile add this line to install PM2:

```
RUN npm install pm2 -g
```

Then replace the `node` binary with `pm2-runtime` 

```
CMD ["node", "app.js"]
```

to:

```
CMD ["pm2-runtime", "app.js"]
```

**You are now all set!** Your Node.js application is now wrapped into a proper Node.js production environment.

### Starting a configuration file

Instead of running your raw Node.js application with PM2, you can declare it into a configuration file (or process file) and set some configuration variables, like enabling the cluster mode.

Let's create a ecosystem.config.js file with this content:

```javascript
module.exports = [{
  script: 'app.js',
  name: 'app',
  exec_mode: 'cluster',
  instances: 2
}, {
  script: 'worker.js',
  name: 'worker'
}]
```

All options available are [listed here](/docs/usage/application-declaration/#attributes-available).

You can then replace the **CMD** directive by this:

```
CMD ["pm2-runtime", "process.yml"]
```

To split each processes in his own Docker, you can use the --only [app-name] option:

```
CMD ["pm2-runtime", "process.yml", "--only", "APP"]
```

### Logging Format option

If you want to change the log output format you can select one of this options:

- **--json**: will output logs in JSON format (logstash)
- **--format**: will output logs in = style format
- **--raw**: will output logs as is

To use one of this flag, you just need to pass them to pm2-runtime:

```
CMD ["pm2-runtime", "--json", "process.yml"]
```

### Enabling Graceful Shutdown

When the Container receives a shutdown signal, PM2 forwards this signal to your application allowing to close all the database connections, wait that all queries have been processed or that any other final processing has been completed before a successfull graceful shutdown.

Catching a shutdown signal is straightforward. You need to add a listener in your Node.js applications and execute anything needed before stopping the app:

```javascript
process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });
});
```

By default PM2 will wait 1600ms before sending a final SIGKILL signal. You can modify this delay by setting the `kill_timeout` option inside your application configuration file.

Read more about application state management [here](http://localhost:4000/docs/usage/signals-clean-restart/)

### Development environment

You may want to tell Developers to program inside a container to keep a consistant environment between develoment, test and production.

Replacing **pm2-runtime** with **pm2-dev** will enable the watch and restart features. This is quite interesting in a development container when the host files are exposed to the container as a VOLUME.

### Using PM2.io

[Keymetrics.io](https://keymetrics.io/) is a monitoring service built on top of PM2 that allows to monitor and manage applications easily (logs, restart, exceptions monitoring...). Once you created a Bucket on Keymetrics you will get a public and a secret key.

To enable Keymetrics monitoring with **pm2-runtime**, you can either use the CLI option **--public XXX** and **--secret YYY** or pass the environment variables **KEYMETRICS_PUBLIC** and **KEYMETRICS_SECRET**.

Example with the CLI options via a Dockerfile:

```
CMD ["pm2-runtime", "--public", "XXX", "--secret", "YYY", "process.yml"]
```

Or via environment variables:

```
ENV PM2_PUBLIC_KEY=XXX
ENV PM2_SECRET_KEY=YYY
```

Or via the Docker run command:

```
docker run --net host -e "PM2_PUBLIC_KEY=XXX" -e "PM2_SECRET_KEY=XXX" <...>
```

## pm2-runtime Helper

Here is the pm2-runtime helper:

```
>>> pm2-runtime -h

  Usage: pm2-runtime app.js

  pm2-runtime is a drop-in replacement node.js binary with some interesting production features

  Options:

    -V, --version              output the version number
    -i --instances <number>    launch [number] of processes automatically load-balanced. Increase overall performances and performance stability.
    --secret [key]             [MONITORING] keymetrics secret key
    --public [key]             [MONITORING] keymetrics public key
    --machine-name [name]      [MONITORING] keymetrics machine name
    --raw                      raw log output
    --json                     output logs in json format
    --format                   output logs formated like key=val
    --delay <seconds>          delay start of configuration file by <seconds>
    --web [port]               launch process web api on [port] (default to 9615)
    --only <application-name>  only act on one application of configuration
    --no-auto-exit             do not exit if all processes are errored/stopped or 0 apps launched
    --env [name]               inject env_[name] env variables in process config file
    --watch                    watch and restart application on file change
    --error <path>             error log file destination (default disabled)
    --output <path>            output log file destination (default disabled)
    -h, --help                 output usage information


  Commands:

    *
    start <app.js|json_file>  start an application or json ecosystem file
```


## When starting a new process

PM2 will inject environment in this order when **starting** a new process :

- First the PM2 CLI will use its environment so the current environment of your shell will be injected.
- PM2 will then inject the environment that you can configure with the ecosystem file :

```javascript
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        watch: true,
        env: {
          "NODE_ENV": "development",
        }
      }
  ]
}
```

Here you can see that PM2 will override the current environment to add `NODE_ENV=development`. But you can also define different environments like this :

```javascript
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        watch: true,
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 80,
            "NODE_ENV": "production",
        }
      }
  ]
}
```

Here the default environment is in the `env`, but you can decide to use `env_production` by using `pm2 start ecosystem.config.js --env production`.

You can define as many environments as you like, just remember that you must pass the name of the environment (after `env_`) you want to use with `--env`.

## Specific environment variables

### NODE_APP_INSTANCE (PM2 2.5 minimum)

There is the `NODE_APP_INSTANCE` environment variable that is used to make a difference between process, for example you may want to run a cronjob only on one process, you can just check if `process.env.NODE_APP_INSTANCE === '0'`.
Two processes can never have the same number, its still true after `pm2 restart` and `pm2 scale` commands.

You may have problems with [node-config](https://github.com/Unitech/pm2/issues/2045) with the `NODE_APP_INSTANCE` name, so you can rename it with `instance_var` options :

```javascript
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        watch: true,
        instance_var: 'INSTANCE_ID',
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        }
      }
  ]
}
```

In this case the variable will have the same behavior but will be in `process.env.INSTANCE_ID`.

#### increment_var (PM2 2.5 minimum)

There is an option to ask PM2 to increment a environment variable for each instance launched, for example:

```javascript
module.exports = {
  apps : [
      {
        name: "myapp",
        script: "./app.js",
        instances: 2,
        exec_mode: "cluster",
        watch: true,
        increment_var : 'PORT',
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        }
      }
  ]
}
```

In this example, if i run `pm2 start ecosystem.config.js` :
 - PM2 will see that i want to increment the `PORT` variable for each instance
 - It will see that i have defined the default to `3000`
 - The first instance will have `process.env.PORT = 3000` and the second `process.env.PORT = 3001`

**NOTE** : It will increment also when scaling using `pm2 scale myapp 4`, both new instances will have `3002` and `3003` as `PORT` variable.


If you just want a fresh install of PM2 without setting up Node.Js, pm2 is avalaible as a `.deb` package!

It is built to work with the lastest Long Term Support release of ubuntu.

## Installation

```bash
# 1. Add the PM2 repository signing key
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv D1EA2D4C

# 2. Add the PM2 repository
echo "deb http://apt.pm2.io/ubuntu stable main" | sudo tee /etc/apt/sources.list.d/pm2.list

# 3. Update list of available packages
sudo apt-get update

# 4. Install PM2
sudo apt-get install pm2
```





## Log management

PM2 allows you to easily manage your application's logs. You can display the logs coming from all your applications in real-time, flush them, and reload them.
There are also different ways to configure how PM2 will handle your logs (separated in different files, merged, with timestamp...) without modifying anything in your code.

## Application log options

### CLI

When running `pm2 start app.js [OPTIONS]` you can pass any of this options to the CLI:

```bash
-l --log [path]              specify filepath to output both out and error logs
-o --output <path>           specify out log file
-e --error <path>            specify error log file
--time                       prefix logs with standard formated timestamp
--log-date-format <format>   prefix logs with custom formated timestamp
--log-type <type>            specify log output style (raw by default, or json)
--merge-logs                 when running mutiple process with same app name, do not split file by id
```

### Ecosystem

Via [Ecosystem files](/docs/usage/application-declaration/) you can pass all the same options:

```
modules.exports = [{
  script: 'echo.js',
  error_file: 'err.log',
  out_file: 'out.log',
  log_file: 'combined.log',
  time: true
}]
```

## Displaying logs

Displaying logs of a specified process or of all processes in real-time:

```bash
# Display option for pm2 logs command
pm2 logs -h

# Display all apps logs
pm2 logs

# Display only `api` application logs
pm2 logs api

# Display X lines of api log file
pm2 logs big-api --lines 1000
```

## Logs output

You can also display the logs in different format:

### JSON output

Output logs in json format with:

```bash
pm2 logs --json
```

For each application line this metadata will be printed:

```json
{
   "message": "echo\n",                     // the actual message that has been `console.log`
   "timestamp": "2017-02-06T14:51:38.896Z", // timestamp of the message, can be formated
   "type": "out",                           // the type of logs, can be `err`, `out` or `PM2`
   "process_id": 0,                         // the process id used by PM2
   "app_name": "one-echo"                   // the application name
}
```


### Formatted output

This is another way of printing the logs:

```bash
pm2 logs --format
```

This will output:

```
timestamp=2019-06-21-19:03:58-0700 app=stdout id=9 type=out message=ooo
timestamp=2019-06-21-19:03:58-0700 app=stdout id=9 type=out message=ooo
timestamp=2019-06-21-19:03:58-0700 app=stdout id=9 type=out message=ooo
timestamp=2019-06-21-19:03:58-0700 app=stdout id=9 type=out message=ooo
timestamp=2019-06-21-19:03:58-0700 app=log id=10 type=out message=out
timestamp=2019-06-21-19:03:58-0700 app=log id=10 type=error message=err
```

## Flushing logs

This will empty all current application logs managed by PM2:

```bash
pm2 flush
```

## Size limited log rotation

You can also install [pm2-logrotate](http://pm2.keymetrics.io/docs/usage/log-management/#pm2-logrotate-module) to automatically rotate and keep all the logs file using a limited space on disk.

To install it:

```bash
pm2 install pm2-logrotate
```

Read more about pm2-logrotate [here](https://github.com/pm2-hive/pm2-logrotate#configure)


## Reloading all logs

Reloading logs is especially useful for Logrotate or any other rotating log system.
You can reload logs by sending `SIGUSR2` to the PM2 process.
You can also reload all logs via the command line with:

```bash
pm2 reloadLogs
```

### Disabling log suffix

Use the `--merge-logs` option to disable automatic log file suffixing.

### Disable logging

```
{
  "out_file": "/dev/null",
  "error_file": "/dev/null"
}
```

You can provide `/dev/null` or `NULL` as output of logs (not depending on the platform, they are harcoded string).

### Setting up a native logrotate

```bash
sudo pm2 logrotate -u user
```

This will write a basic logrotate configuration to `/etc/logrotate.d/pm2-user` that will look like this:

```
/home/user/.pm2/pm2.log /home/user/.pm2/logs/*.log {
        rotate 12
        weekly
        missingok
        notifempty
        compress
        delaycompress
        create 0640 user user
}
```


## Max Memory Threshold Auto Reload

PM2 allows to reload (auto fallback to restart if not in cluster) an application based on a memory limit/ Please note that the PM2 internal worker (which checks memory), starts every 30 seconds, so you may have to wait a bit before your process gets restarted automatically after reaching the memory threshold.

CLI:

```bash
pm2 start api.js --max-memory-restart 300M
```

Config file (ecosystem.config.js):

```bash
module.exports = {
  apps: [{
    name: 'api',
    script: 'api.js',
    max_memory_restart: '300M'
  }]
}
```

*Note:* Units can be K(ilobyte), M(egabyte), G(igabyte).


## Monitoring CPU/Memory

<center>
<img src="/images/pm2-monit.png" title="PM2 Monit"/>
</center>

PM2 gives you a simple way to monitor the resource usage of your application.
You can monitor memory and CPU easily and straight from your terminal:

```bash
pm2 monit
```

## PM2.io

If you manage your Node.js application with PM2, we invite you to try [PM2.io](https://pm2.io). It makes monitoring and managing applications accross servers easier than ever.

Feel free to try it:
[Discover the monitoring dashboard for PM2](https://app.pm2.io/#/register)

## Memory threshold

PM2 allows to reload (auto fallback to restart) an application based on a memory limit. 
Please note that the PM2 internal worker (which checks memory and related), starts every 30 seconds, so you may have to wait a bit before your process gets restarted automatically after reaching the memory threshold.

### CLI

```bash
pm2 start big-array.js --max-memory-restart 20M
```

### Via Ecosystem File

```javascript
module.exports = {
   name: 'max-mem',
   script: 'big-array.js',
   max_memory_restart: '100M'
}
```

### Programmatic

```javascript
pm2.start({
  name               : "max_mem",
  script             : "big-array.js",
  max_memory_restart : "20M"
}, function(err, proc) {
  // Processing
});
```

### Units

Units can be K(ilobyte), M(egabyte), G(igabyte).

```
50M
50K
1G
```


PM2 can be used programmatically, meaning that you can embed a process manager directly in your code, spawn processes, keep them alive even if the main script is exited.

It's also useful when you deploy a Node.js application [in any kind of Cloud Provider / PaaS](/docs/usage/use-pm2-with-cloud-providers/).

## Simple example

This example shows you how to start app.js with some configuration attributes. Elements passed to start are the same than those you can declare in a [JS/JSON configuration](/docs/usage/application-declaration/) file:

**NB**: If your script does not exit by itself, make sure you called `pm2.disconnect()` at the end.

```bash
npm install pm2 --save
```

```javascript
var pm2 = require('pm2');

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  
  pm2.start({
    script    : 'app.js',         // Script to be run
    exec_mode : 'cluster',        // Allows your app to be clustered
    instances : 4,                // Optional: Scales your app by 4
    max_memory_restart : '100M'   // Optional: Restarts your app if it reaches 100Mo
  }, function(err, apps) {
    pm2.disconnect();   // Disconnects from PM2
    if (err) throw err
  });
});
```

## Programmatic API

`npm install pm2 --save`

**`pm2.connect(errback)`** - Either connects to a running pm2 daemon ("God") or launches and daemonizes one. Once launched, the pm2 process will keep running after the script exits.  
**`pm2.connect(noDaemonMode, errback)`**

* `noDaemonMode` - (Default: false) If true is passed for the first argument, pm2 will not be run as a daemon and will die when the related script exits. By default, pm2 stays alive after your script exits. If pm2 is already running, your script will link to the existing daemon but will die once your process exits.
* `errback(error)` - Called when finished connecting to or launching the pm2 daemon process.

**`pm2.start(options, errback)`** - Starts a script that will be managed by pm2.  
**`pm2.start(jsonConfigFile, errback)`**  
**`pm2.start(script, errback)`**  
**`pm2.start(script, options, errback)`**  
**`pm2.start(script, jsonConfigFile, errback)`**  

* `script` - The path of the script to run.
* `jsonConfigFile` - The path to a JSON file that can contain the same options as the `options` parameter.
* `errback(err,proc)` - An errback called when the `script` has been started. The `proc` parameter will be a [pm2 process object](https://github.com/soyuka/pm2-notify#templating).
* `options` - An object with the following options (additional descriptions of these options are [here](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#graceful-reload)):
  * `name` - An arbitrary name that can be used to interact with (e.g. restart) the process later in other commands. Defaults to the script name without its extension (eg `"testScript"` for `"testScript.js"`).
  * `script` - The path of the script to run.
  * `args` - A string or array of strings composed of arguments to pass to the script.
  * `interpreterArgs` - A string or array of strings composed of arguments to call the interpreter process with. Eg "--harmony" or ["--harmony","--debug"]. Only applies if `interpreter` is something other than "none" (its "node" by default).
  * `cwd` - The working directory to start the process with.
  * `output` - (Default: `"~/.pm2/logs/app_name-out.log"`) The path to a file to append stdout output to. Can be the same file as `error`.
  * `error` - (Default: `"~/.pm2/logs/app_name-error.err"`) The path to a file to append stderr output to. Can be the same file as `output`.
  * `logDateFormat` - The display format for log timestamps (eg "YYYY-MM-DD HH:mm Z"). The format is a [moment display format](http://momentjs.com/docs/#/displaying/).
  * `pid` - (Default: `"~/.pm2/pids/app_name-id.pid"`) The path to a file to write the pid of the started process. The file will be overwritten. Note that the file is not used in any way by pm2 and so the user is free to manipulate or remove that file at any time. The file will be deleted when the process is stopped or the daemon killed.
  * `minUptime` - The minimum uptime of the script before it's considered successfully started. 
  * `maxRestarts` - The maximum number of times in a row a script will be restarted if it exits in less than `min_uptime`.
  * `maxMemoryRestart` - If sets and `script`'s memory usage goes about the configured number, pm2 restarts the `script`. Uses human-friendly suffixes: 'K' for kilobytes, 'M' for megabytes, 'G' for gigabytes', etc. Eg "150M".
  * `killTimeout` - (Default: `1600`) The number of milliseconds to wait after a `stop` or `restart` command issues a `SIGINT` signal to kill the script forceably with a `SIGKILL` signal. 
  * `restartDelay` - (Default: `0`) Number of millseconds to wait before restarting a script that has exited.  
  * `interpreter` - (Default: `'node'`) The interpreter for your script (eg "python", "ruby", "bash", etc). The value "none" will execute the 'script' as a binary executable.
  * `execMode` - (Default: `'fork'`) If sets to 'cluster', will enable clustering (running multiple instances of the `script`). [See here for more details](http://pm2.keymetrics.io/docs/usage/cluster-mode/).
  * `instances` - (*Default: `1`*) How many instances of `script` to create. Only relevant in `exec_mode` 'cluster'.
  * `mergeLogs` - (Default: `false`) If true, merges the log files for all instances of `script` into one stderr log and one stdout log. Only applies in 'cluster' mode. For example, if you have 4 instances of 'test.js' started via pm2, normally you would have 4 stdout log files and 4 stderr log files, but with this option set to true you would only have one stdout file and one stderr file.
  * `watch` - If set to `true`, the application will be restarted on change of the `script` file.
  * `force` (Default: `false`) By default, pm2 will only start a script if that script isn't already running (a script is a path to an application, not the name of an application already running). If `force` is set to true, pm2 will start a new instance of that script.
  * `autorestart` (Default `true`).  If `false`, pm2 will *not* attempt to restart it following successful completion or process failure.
  * `cron`
  * `executeCommand`
  * `write`
  * `sourceMapSupport`
  * `disableSourceMapSupport`

**`pm2.disconnect()`** - Disconnects from the pm2 daemon.

**`pm2.stop(process, errback)`** - Stops a process but leaves the process meta-data in pm2's list. *[See here for how pm2 stops a process](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/)*  
**`pm2.restart(process, errback)`** - Stops and restarts the process.  
**`pm2.delete(process, errback)`** - Stops the process and removes it from pm2's list. The process will no longer be accessible by its `name`.  
**`pm2.reload(process, errback)`** - Zero-downtime rolling restart. At least one process will be kept running at all times as each instance is restarted individually. *Only works for scripts started in cluster mode. [See here for more details](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#reload-without-downtime).*  
**`pm2.gracefulReload(process, options, errback)`** - Sends the process a shutdown message before initiating `reload`. [See here for more details](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/#graceful-reload).

* `process` - Can either be the `name` as given in the `pm2.start` `options`, a process id, or the string "all" to indicate that all scripts should be restarted.
* `options` - (Optional) An object with the following options:
  * `updateEnv` - (Default: false) If true is passed in, pm2 will reload it's environment from process.env before reloading your process.
* `errback(err, proc)`

**`pm2.killDaemon(errback)`** - Kills the pm2 daemon (same as `pm2 kill`). Note that when the daemon is killed, all its processes are also killed. Also note that you still have to explicitly disconnect from the daemon even after you kill it.

**`pm2.describe(process,errback)`** - Returns various information about a process: eg what stdout/stderr and pid files are used.

* `errback(err, processDescription)`
* `processDescription` - An object with information about the process. Contains the properties:
  * `name` - The name given in the original `start` command. 
  * `pid` - The pid of the process.
  * `pm_id` - The pid for the `pm2` God daemon process.
  * `monit` - An object containing:
    * `memory` - The number of bytes the process is using.
    * `cpu` - The percent of CPU being used by the process at the moment.
  * `pm2_env` - The list of path variables in the process's environment. These variables include:
    * `pm_cwd` - The working directory of the process.
    * `pm_out_log_path` - The stdout log file path.
    * `pm_err_log_path` - The stderr log file path.
    * `exec_interpreter` - The interpreter used.
    * `pm_uptime` - The uptime of the process.
    * `unstable_restarts` - The number of unstable restarts the process has been through.
    * `restart_time`
    * `status` - "online", "stopping", "stopped", "launching", "errored", or "one-launch-status"
    * `instances` - The number of running instances.
    * `pm_exec_path` - The path of the script being run in this process.

**`pm2.list(errback)`** - Gets the list of running processes being managed by pm2.

* `errback(err, processDescriptionList)` - The `processDescriptionList` parameter will contain a list of `processDescription` objects as defined under `pm2.describe`. 

**`pm2.dump(errback)`** - Writes the process list to a json file at the path in the DUMP_FILE_PATH environment variable ("~/.pm2/dump.pm2" by default).

* `errback(err, result)`

**`pm2.flush(process,errback)`** - Flushes the logs.

* `errback(err, result)`

**`pm2.dump(errback)`**

* `errback(err, result)`

**`pm2.reloadLogs(errback)`** - *Rotates* the log files. The new log file will have a higher number in it (the default format being `${process.name}-${out|err}-${number}.log`).

* `errback(err, result)`

**`pm2.launchBus(errback)`** - Opens a message bus.

* `errback(err, bus)` - The `bus` will be an [Axon Sub Emitter](https://github.com/tj/axon#pubemitter--subemitter) object used to listen to and send events.

**`pm2.sendSignalToProcessName(signal, process, errback)`**

* `errback(err, result)`

**`pm2.startup(platform, errback)`** - Registers the script as a process that will start on machine boot. Platform can currently be: "ubuntu", "centos", "redhat", "gentoo", "systemd", "darwin", or "amazon". The current process list will be dumped and saved for resurrection on reboot.

* `errback(err, result)`

## Send message to process

Available in PM2 0.15.11>

pm2-call.js:

```javascript
pm2.connect(function() {
  pm2.sendDataToProcessId({
    type : 'process:msg',
    data : {
      some : 'data',
      hello : true
    },
    id   : 0, // id of procces from "pm2 list" command or from pm2.list(errback) method
    topic: 'some topic'
  }, function(err, res) {
  });
});

pm2.launchBus(function(err, bus) {
  pm2_bus.on('process:msg', function(packet) {
    packet.data.success.should.eql(true);
    packet.process.pm_id.should.eql(proc1.pm2_env.pm_id);
    done();
  });
});
```

pm2-app.js:

```javascript
process.on('message', function(packet) {
  process.send({
    type : 'process:msg',
    data : {
     success : true
    }
 });
});
```


PM2 comes with a handy development tool that allow you to start an application and restart it on file change:

```bash
# Start your application in development mode
# it print the logs and restart on file change too

# Two way of running your application :
pm2-dev start my-app.js

# or

pm2-dev my-app.js
```


## Process Actions

By plugging process actions onto your code, you will be able to trigger them via the PM2 CLI.

First make sure you added the library pmx to your code:

```bash
npm install @pm2/io
```

Then in your code:

```javascript
var pmx = require('@pm2/io');

pmx.action('hello', function(reply) {
  reply({ answer : 'world' });
});

setInterval(function() {
  // Keep application online
}, 100);
```

Start the application with PM2. To trigger process actions, use the command:

```bash
pm2 trigger <application-name> <action-name>
```

![process actions](/images/processactions-trigger.png)

You can also list all available process actions:

```bash
pm2 show <application-name>
```

![process actions](/images/processactions.png)

### Passing a parameter

To pass a parameter to the remote function, just add the `param` attribute to the callback:

```javascript
var pmx = require('@pm2/io');

pmx.action('world', function(param, reply) {
  console.log(param);
  reply({success : param});
});
```

Restart your application and call this process function with PM2:

```bash
pm2 trigger <application-name> <action-name> [parameter]
```


## Managing applications states

PM2 is a process manager. It manages your applications states, so you can start, stop, restart and *delete* processes.

Start a process:

```bash
pm2 start app.js --name "my-api"
pm2 start web.js --name "web-interface"
```

Now let's say you need to stop the web-interface:

```bash
pm2 stop web-interface
```

As you can see **the process hasn't disappeared**. It's still there but in `stopped` status.

To restart it just do:

```bash
pm2 restart web-interface
```

**NB: starting PM2 2.1.x, restarts are immutable, meaning that environment changes will not change your process, see [--update-env](http://pm2.keymetrics.io/docs/usage/environment/#while-restarting-reloading-a-process)**

Now you want to **delete** the app from the PM2 process list.
You just have to enter the following commands:

```bash
pm2 delete web-interface
```

Since PM2 `2.4.0`, you can also restart/delete/stop/reload applications via regex (this one will only restart `http-1` and `http-2` but not `http-3`):

```bash
pm2 restart /http-[1,2]/
```

*Note : Regex are defined by leading and ending '/' and they are tested against applications name only (not the process id).*

[You can declare options via configuration file too](/docs/usage/application-declaration/).

## Process listing

To list all running processes:

```bash
pm2 list
# Or
pm2 [list|ls|l|status]
```

To get more details about a specific process:

```bash
pm2 show 0
```

### Process sorting

To sort all running processes:

```bash
pm2 list --sort name:desc
# Or
pm2 list --sort [name|id|pid|memory|cpu|status|uptime][:asc|desc]
```
By default sorting field is "name" and order is "asc".

## Start any process type

For scripts in other languages:

```bash
pm2 start echo.pl --interpreter=perl

pm2 start echo.coffee
pm2 start echo.php
pm2 start echo.py
pm2 start echo.sh
pm2 start echo.rb
```

The interpreter is set by default with this equivalence:

```json
{
  ".sh": "bash",
  ".py": "python",
  ".rb": "ruby",
  ".coffee" : "coffee",
  ".php": "php",
  ".pl" : "perl",
  ".js" : "node"
}
```

### Binary code execution

```bash
pm2 start ./binary-app
```

### Process configuration

To run a non-JS interpreter you must set `exec_mode` to `fork_mode` and `exec_interpreter` to your interpreter of choice.
For example:

```json
{
  "apps" : [{
    "name"       : "bash-worker",
    "script"     : "./a-bash-script",
    "exec_interpreter": "bash",
    "exec_mode"  : "fork_mode"
  }, {
    "name"       : "ruby-worker",
    "script"     : "./some-ruby-script",
    "exec_interpreter": "ruby",
    "exec_mode"  : "fork_mode"
  }]
}
```

## Max Memory Restart

PM2 allows to restart an application based on a memory limit.

Note that the max memory restart options are graceful (if your application supports graceful actions of course).

### CLI

```bash
pm2 start big-array.js --max-memory-restart 20M
```

### JSON

```json
{
  "name"   : "max_mem",
  "script" : "big-array.js",
  "max_memory_restart" : "20M"
}
```

### Programmatic

```
pm2.start({
  name               : "max_mem",
  script             : "big-array.js",
  max_memory_restart : "20M"
}, function(err, proc) {
  // Processing
});
```

### Units

Units can be K(ilobyte), M(egabyte), G(igabyte).

```
50M
50K
1G
```


## Process Metrics

By plugging process metrics onto your code, you will be able to monitor in-code values, in realtime.

## Install

Install the `@pm2/io` library to your application with:

```bash
npm install @pm2/io --save
```

For more information about the `@pm2/io` module checkout [the repo documentation](https://github.com/keymetrics/pm2-io-apm#table-of-contents)

## Using @pm2/io for metrics

Here is a basic example on how to use the @pm2/io library to create a *requests per minute* metric:

```javascript
var io = require('@pm2/io')
var http = require('http')

var meter = io.meter({
  name      : 'req/min',
  samples   : 1,
  timeframe : 60
})

http.createServer(function (req, res) {
  meter.mark()
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('Hello World!')
  res.end()
}).listen(6001)
```

## Monitoring metrics

Once you have started the application with `pm2 start app.js`, to display the `req/min` metric you can use:

```
pm2 monit
```

And check the box called "Custom Metrics":

<img src="https://i.imgur.com/WHDEvHg.png" title="custom metrics" width="300"/>

**Or** you can check the metrics with the:

```bash
pm2 show <application-name>
```

![process metrics](/images/processmetrics.png)

## Metrics helper available

Then you can program your very own metrics to track important informations. 4 differents probes are available:

- **Simple metrics**: Values that can be read instantly
    - eg. Monitor variable value
- **Counter**: Things that increment or decrement
    - eg. Downloads being processed, user connected
- **Meter**: Things that are measured as events / interval
    - eg. Request per minute for a http server
- **Histogram**: Keeps a resevoir of statistically relevant values biased towards the last 5 minutes to explore their distribution
    - eg. Monitor the mean of execution of a query into database

### Simple Metric: Simple value reporting

This allows to expose values that can be read instantly.

```javascript
var io = require('@pm2/io')

// Here the value function will be called each second to get the value
var metric = io.metric({
  name    : 'Realtime user',
  value   : function() {
    return Object.keys(users).length
  }
})

// Here we are going to call valvar.set() to set the new value
var valvar = io.metric({
  name    : 'Realtime Value'
})

valvar.set(23)
```

### Counter: Sequential value change

Values that increment or decrement.

Exemple to count Active Http Requests:

```javascript
var io = require('@pm2/io')
var http = require('http')

var counter = io.counter({
  name : 'Active requests'
})

http.createServer(function (req, res) {
  counter.inc()

  req.on('end', function() {
    // Decrement the counter, counter will eq 0                                                                                                                                                                      
    counter.dec()
  })
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('Hello World!')
  res.end()
}).listen(6001)
```

### Meter: Average calculated values

Values that are measured as events / interval.

Exemple to count number of queries per minute:

```javascript
var io = require('@pm2/io')
var http = require('http')

var meter = io.meter({
  name      : 'req/min',
  samples   : 1,
  timeframe : 60
})

http.createServer(function (req, res) {
  meter.mark()
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('Hello World!')
  res.end()
}).listen(6001)
```

#### Options

**samples** option is the rate unit. Defaults to **1** sec.
**timeframe** option is the timeframe over which events will be analyzed. Defaults to **60** sec.

### Histogram

Keeps a resevoir of statistically relevant values biased towards the last 5 minutes to explore their distribution.

```javascript
var io = require('@pm2/io')

var histogram = io.histogram({
  name        : 'latency',
  measurement : 'mean'
})

var latency = 0

setInterval(function() {
  latency = Math.round(Math.random() * 100)
  histogram.update(latency)
}, 100)
```


## Exponential Backoff Restart Delay

*Available in PM2 >= 3.2*

A new restart mode has been implemented on PM2 Runtime, making your application restarts in a smarter way. Instead of restarting your application like crazy when exceptions happens (e.g. database is down), the *exponential backoff restart* will increase incrementaly the time between restarts, reducing the pressure on your DB or your external provider... Pretty easy to use:

CLI:
```bash
$ pm2 start app.js --exp-backoff-restart-delay=100
```

Or via ecosystem.config.js file:
```javascript
module.exports = [{
  script: 'app.js',
  exp_backoff_restart_delay: 100
}]
```

When an application crash unexpectedly and the option `--exp-backoff-restart-delay` is activated, you will be able to see a new application status **waiting restart**.

By running `pm2 logs` you will also see the restart delay being incremented:
```
PM2      | App [throw:0] will restart in 100ms
PM2      | App [throw:0] exited with code [1] via signal [SIGINT]
PM2      | App [throw:0] will restart in 150ms
PM2      | App [throw:0] exited with code [1] via signal [SIGINT]
PM2      | App [throw:0] will restart in 225ms
```

As you can see the restart delay between restarts will increase in an exponential moving average, till reaching the maximum of 15000ms between restarts.

When the application will then get back to a stable mode (uptime without restarts of more than 30 seconds), the restart delay will automatically reset to 0ms.

## Fixed Restart Delay

*Available in PM2 >= 0.9*

You can also use the `restart_delay` to set a fixed timing between restarts:

CLI:
```bash
$ pm2 start app.js --restart-delay=3000
```

Or via ecosystem.config.js file:
```javascript
module.exports = [{
  script: 'app.js',
  restart_delay: 3000
}]
```

## Memory based reload strategy

Checkout [https://pm2.io/doc/en/runtime/features/memory-limit/](https://pm2.io/doc/en/runtime/features/memory-limit/)

## 0 second Downtime Reload

Checkout the cluster mode to get [this behavior](/doc/en/runtime/guide/load-balancing/#0-seconds-downtime-reload)

## No Auto Restart

This is useful in case we wish to run 1-time scripts and don't want the process manager to restart our script in case it's completed running.

Simply running these scripts from bash would terminate the script in case the ssh-session is terminated and the script should not get restarted when it completes execution.

PM2 is perfect for such cases, providing robust monitoring and logging

CLI:

```bash
$ pm2 start app.js --no-autorestart
```


## Serve static file over http

PM2 can serve static file very easily with the `pm2 serve` feature.

## CLI

Serve your static files (like a frontend app) over http with a simple command :

```bash
pm2 serve <path> <port>
```

The current folder will be used if you don't precise `<path>`, for the port the default one is `8080`.
You can use the same options as a normal application like `--name` or `--watch`.

## Process file

You can declare in a process file that you want a special dir to be served, to do so :

```javascript
module.exports = {
  script: "serve",
  env: {
    PM2_SERVE_PATH: '.',
    PM2_SERVE_PORT: 8080
  }
}
```

You just need to add `PM2_SERVE_PATH` and `PM2_SERVE_PORT` to env variables to specify the path and the port, the default are the same as the CLI.

## Serving SPA: redirect all to index.html

To automatically redirect all queries to the index.html use the `--spa` option:

```bash
pm2 serve --spa
```

### Protect access with password

To basic protect the access to the exposed files you can use the `--basic-auth-username` and `--basic-auth-password`:

```bash
pm2 serve --basic-auth-username <username> --basic-auth-password <password>
```


## CLI completion

Tab-completion for PM2:

```bash
pm2 completion install
```

Or manually append completion script to your ~/.bashrc or ~/.zshrc file:

```bash
pm2 completion >> ~/.bashrc # or ~/.zshrc
```

Then source your .bashrc or .zshrc file for current session:

```bash
source ~/.bashrc # or ~/.zshrc
```

You can add pm2 completion to your current session this way:

```bash
. <(pm2 completion)
```


## Graceful Stop

To allow graceful restart/reload/stop processes, make sure you intercept the **SIGINT** signal and clear everything needed (like database connections, processing jobs...) before letting your application exit.

```javascript
process.on('SIGINT', function() {
   db.stop(function(err) {
     process.exit(err ? 1 : 0);
   });
});
```

Now `pm2 reload` will become a gracefulReload.

### Configure the kill timeout

Via CLI, this will lengthen the timeout to 3000ms:

```bash
pm2 start app.js --kill-timeout 3000
```

Via [Ecosystem File](http://pm2.keymetrics.io/docs/usage/application-declaration/):

```javascript
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    kill_timeout : 3000
  }]
}
```

## Graceful start

Sometimes you might need to wait for your application to have etablished connections with your DBs/caches/workers/whatever. PM2 needs to wait before considering your application as `online`. To do this, you need to provide `--wait-ready` to the CLI or provide `wait_ready: true` in a process file. This will make PM2 listen for that event. In your application you will need to add `process.send('ready');` when you want your application to be considered as ready.

```javascript
var http = require('http');
var app = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('hey');
})
var listener = app.listen(0, function() {
  console.log('Listening on port ' + listener.address().port);
  // Here we send the ready signal to PM2
  process.send('ready');
});
```

Then start the application:

```bash
pm2 start app.js --wait-ready
```

### Configure the ready timeout

By default, PM2 wait 3000ms for the `ready` signal.

Via CLI, this will lengthen the timeout to 3000ms:

```bash
pm2 start app.js --wait-ready --listen-timeout 3000
```

Via [JSON declaration](http://pm2.keymetrics.io/docs/usage/application-declaration/):

```json
{
  "apps" : [{
    "name"         : "api",
    "script"       : "app.js",
    "listen_timeout" : 3000
  }]
}
```

### Graceful start using `http.Server.listen`

There is still the default system that hooks into `http.Server.listen` method. When your http server accepts a connection, it will automaticaly state your application as ready. You can increase the PM2 waiting time the listen using the same variable as `--wait-ready` graceful start : `listen_timeout` entry in process file or `--listen-timeout=XXXX` via CLI.

## Explanation: Signals flow

When a process is stopped/restarted by PM2, some system signals are sent to your process in a given order.

First a **SIGINT** a signal is sent to your processes, signal you can catch to know that your process is going to be stopped. If your application does not exit by itself before 1.6s *([customizable](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/#customize-exit-delay))* it will receive a **SIGKILL** signal to force the process exit.

## Windows graceful stop

When signals are not available your process gets killed. In that case, you need to listen for `shutdown` events:

```javascript
process.on('message', function(msg) {
  if (msg == 'shutdown') {
    console.log('Closing all connections...');
    setTimeout(function() {
      console.log('Finished closing connections');
      process.exit(0);
    }, 1500);
  }
});
```


If you use [BabelJS](https://babeljs.io/), [Typescript](http://www.typescriptlang.org/) or any other Javascript superset you may have noticed that when an exception occurs, the stacktrace is not meaningful at all. To get interesting informations you need to generate [source map files](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

Once these source map files are generated, PM2 will automatically detects them and will help you inspect errors.

## Source map

Since the version 1.0.2, PM2 embeds a mecanism to support javascript source map.

**PM2 automatically detects javascript source map files** if the file you start (let's say app.js) has his map equivalence (e.g app.js.map).

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


## Listening on port 80 w/o root

It’s a general rule that you should not run node as root. However only root can bind to ports less than 1024. This is where authbind comes in. Authbind allows non-root users to bind to ports less than 1024. Replace `%user%` with the user that will be running `pm2`.

```bash
sudo apt-get install authbind
sudo touch /etc/authbind/byport/80
sudo chown %user% /etc/authbind/byport/80
sudo chmod 755 /etc/authbind/byport/80
```

You should also add an alias to the user that runs `pm2` profile, e.g. `~/.bashrc` or `~/.zshrc` (note you will need to run `source ~/.bashrc` or `source ~/.zshrc` immediately after):

```diff
+alias pm2='authbind --deep pm2'
```

Finally ensure that `pm2` is updated with `authbind`:

```sh
authbind --deep pm2 update
```

Or simply `pm2 update` if you added the alias to your user's profile.

Now you can start applications using PM2 that can bind to port 80 without being root!

## Multiple PM2 on the same server

The client and daemon communicate via socket files available in $HOME/.pm2/pub.sock and $HOME/.pm2/rpc.sock.

You can start multiple PM2 instances by changing the `PM2_HOME` environment variable.

```bash
PM2_HOME='.pm2' pm2 start echo.js --name="echo-node-1"
PM2_HOME='.pm3' pm2 start echo.js --name="echo-node-2"
```

This will start two different PM2 instances. To list processes managed by each different instances do:

```bash
PM2_HOME='.pm2' pm2 list
PM2_HOME='.pm3' pm2 list
```

## Launch PM2 in no deamon

Make sure you kill any PM2 instance before starting PM2 in no deamon mode (`pm2 kill`).

Launching PM2 without daemonizing itself:

```bash
pm2 start app.js --no-daemon
```

There is also the CLI `pm2-runtime` installed by default at PM2 installation, that is a drop-in replacement of the Node.js binary.

## Stateless apps

It is a general rule that your production application should be stateless. Every data, states, websocket session, session data, must be shared via any kind of database or PUB/SUB system.

If not, your application will be painfull to scale on the same server and accross multiple servers.

For example you could use [connect-redis](https://github.com/visionmedia/connect-redis) to share sessions.

We also recommend you to follow the 12 factor convention: [http://12factor.net/](http://12factor.net/)

## Setup pm2 on a server

[How To Use pm2 to Setup a Node.js Production Environment On An Ubuntu VPS](https://www.digitalocean.com/community/articles/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps).

## Log and PID files

By default, logs (error and output), pid files, dumps, and PM2 logs are located in `~/.pm2/`:

```
.pm2/
├── dump.pm2
├── custom_options.sh
├── pm2.log
├── pm2.pid
├── logs
└── pids
```

## Enabling Harmony ES6

The `--node-args` option allows the addition of arguments to the node interpreter. To enable harmony for a process type the following command:

```bash
pm2 start my_app.js --node-args="--harmony"
```

And within a JSON declaration:

```json
[{
  "name" : "ES6",
  "script" : "es6.js",
  "node_args" : "--harmony"
}]
```

## CoffeeScript

### CoffeeScript v1

```bash
pm2 install coffee-script 
pm2 start app.coffee
```

### CoffeeScript v2
```bash
pm2 install coffeescript
pm2 start app.coffee
```

That's all!

## Piping JSON

Pull-requests:
- [#273](https://github.com/Unitech/pm2/pull/273)
- [#279](https://github.com/Unitech/pm2/pull/279)

```bash
#!/bin/bash

read -d '' my_json <<_EOF_
[{
    "name"       : "app1",
    "script"     : "/home/projects/pm2_nodetest/app.js",
    "instances"  : "4",
    "error_file" : "./logz/child-err.log",
    "out_file"   : "./logz/child-out.log",
    "pid_file"   : "./logz/child.pid",
    "exec_mode"  : "cluster_mode",
    "port"       : 4200
}]
_EOF_

echo $my_json | pm2 start -
```

## Process title

You can specify the env variable `PROCESS_FILE` when start an application with PM2, it will be set a process title. It pretty useful when trying to get specific data from the process, for example you can use `ps -fC name`.

## Transpilers

Refer to [Using transpilers with PM2](http://pm2.keymetrics.io/docs/tutorials/using-transpilers-with-pm2) tutorial.

## User tips from issues

- [Vagrant and pm2 #289](https://github.com/Unitech/pm2/issues/289#issuecomment-42900019)
- [Start the same application on different ports #322](https://github.com/Unitech/pm2/issues/322#issuecomment-46792733)
- [Using ansible with pm2](https://github.com/Unitech/pm2/issues/88#issuecomment-49106686)
- [Cron string as argument](https://github.com/Unitech/pm2/issues/496#issuecomment-49323861)
- [Restart when process reaches a specific memory amount](https://github.com/Unitech/pm2/issues/141)
- [Sticky sessions and socket.io discussion](https://github.com/Unitech/PM2/issues/637)
- [EACCESS - understanding pm2 user/root rights](https://github.com/Unitech/PM2/issues/837)

## External resources and articles

- [PM2 — Utility Overview & Installation](https://futurestud.io/tutorials/pm2-utility-overview-installation)
- [How To Set Up a Node.js Application for Production on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)
- [Tutorial: Creating and managing a Node.js server on AWS, part 2](https://hackernoon.com/tutorial-creating-and-managing-a-node-js-server-on-aws-part-2-5fbdea95f8a1)
- [Goodbye node-forever, hello pm2](http://devo.ps/blog/goodbye-node-forever-hello-pm2/)
- [https://www.howtoforge.com/tutorial/how-to-deploy-nodejs-applications-with-pm2-and-nginx-on-ubuntu/](https://www.howtoforge.com/tutorial/how-to-deploy-nodejs-applications-with-pm2-and-nginx-on-ubuntu/)
- [https://serversforhackers.com/editions/2014/11/04/pm2/](https://serversforhackers.com/editions/2014/11/04/pm2/)
- [http://www.allaboutghost.com/keep-ghost-running-with-pm2/](http://www.allaboutghost.com/keep-ghost-running-with-pm2/)
- http://blog.ponyfoo.com/2013/09/19/deploying-node-apps-to-aws-using-grunt
- http://www.allaboutghost.com/keep-ghost-running-with-pm2/
- http://bioselemental.com/keeping-ghost-alive-with-pm2/
- http://blog.chyld.net/installing-ghost-on-ubuntu-13-10-aws-ec2-instance-with-pm2/
- http://blog.marvinroger.fr/gerer-ses-applications-node-en-production-pm2/
- https://www.codersgrid.com/2013/06/29/pm2-process-manager-for-node-js/
- http://www.z-car.com/blog/programming/how-to-rotate-logs-using-pm2-process-manager-for-node-js
- http://yosoftware.com/blog/7-tips-for-a-node-js/
- https://www.exponential.io/blog/nodeday-2014-moving-a-large-developer-workforce-to-nodejs
- http://blog.rapsli.ch/posts/2013/2013-10-17-node-monitor-pm2.html
- https://coderwall.com/p/igdqyw
- http://revdancatt.com/2013/09/17/node-day-1-getting-the-server-installing-node-and-pm2/
- https://medium.com/tech-talk/e7c0b0e5ce3c


## Startup Script Generator

PM2 can generate startup scripts and configure them in order to keep your process list intact across expected or unexpected machine restarts.

## Init systems supported

- **systemd**: Ubuntu >= 16, CentOS >= 7, Arch, Debian >= 7
- **upstart**: Ubuntu <= 14
- **launchd**: Darwin, MacOSx
- **openrc**: Gentoo Linux, Arch Linux
- **rcd**: FreeBSD
- **systemv**: Centos 6, Amazon Linux

These init systems are automatically detected by PM2 with the `pm2 startup` command.

## Generating a startup script

To get the automatically-configured startup script for your machine you need to type this command:

```bash
# Detect available init system, generate configuration and enable startup system
pm2 startup
```

**Do not pass sudo to this command! It will print the exact right command you will have to copy/paste into your terminal**

Example:
```bash
$ pm2 startup
[PM2] You have to run this command as root. Execute the following command:
      sudo su -c "env PATH=$PATH:/home/unitech/.nvm/versions/node/v4.3/bin pm2 startup <distribution> -u <user> --hp <home-path>
```

You simply have to copy/paste the line PM2 gives you and the startup script will be configured for your OS.


**NOTE 1** : When upgrading to newer Node.js version, update the PM2 startup script! Use `pm2 unstartup` first then `pm2 startup` again

**NOTE 2**: You can customize the service name via the `--service-name <name>` option ([#3213](https://github.com/Unitech/pm2/pull/3213))

## Saving current process list

**Important**

Once you started all the applications you want to manage, you have to save the list you wanna respawn at machine reboot with:

```bash
pm2 save
```

It will save the process list with the corresponding environments into the dump file `$PM2_HOME/.pm2/dump.pm2`.

### Manually resurrect processes

This brings back previously saved processes (via pm2 save):

```bash
pm2 resurrect
```

## Disabling startup system

```bash
pm2 unstartup
```

The previous line code let PM2 detect your platform. Alternatively you can use another specified init system youself using:

```bash
pm2 unstartup
```

## Updating Startup Script

```bash
pm2 unstartup
```

Then

```bash
pm2 startup
```

## User permissions

Let's say you want the startup script to be executed under another user.

Just change the `-u <username>` option and the `--hp <user_home>`:

```bash
pm2 startup ubuntu -u www --hp /home/ubuntu
```

## Specifying the init system

You can specify the platform you use by yourself if you want to (where platform can be either one of the cited above): 
```
pm2 startup [ubuntu | ubuntu14 | ubuntu12 | centos | centos6 | arch | oracle | amazon | macos | darwin | freebsd | systemd | systemv | upstart | launchd | rcd | openrc]
```

## SystemD installation checking

```bash
# Check if pm2-<USER> service has been added
$ systemctl list-units
# Check logs
$ journalctl -u pm2-<USER>
# Cat systemd configuration file
$ systemctl cat pm2-<USER>
# Analyze startup
$ systemd-analyze plot > output.svg
```

To wait efficiently that machine is online for PM2 to run:

```
[Unit]
Wants=network-online.target
After=network.target network-online.target

[....]

[Install]
WantedBy=multi-user.target network-online.target
```

## Windows consideration

There are some external libraries to generate a Windows compatible startup script, please checkout [pm2-windows-service](https://www.npmjs.com/package/pm2-windows-service) or [pm2-windows-startup](https://www.npmjs.com/package/pm2-windows-startup).




To get the most out of PM2 and [PM2.io](https://pm2.io), please make sure your PM2 version is up-to-date.

You can find the changelog here: [https://github.com/Unitech/pm2/releases](https://github.com/Unitech/pm2/releases).

## Updating PM2

Updating PM2 is extremely fast (less than few seconds) and seamless.

First make sure that you saved correctly all your processes:

```bash
pm2 save
```

Then install the latest PM2 version from NPM:

```bash
npm install pm2 -g
```

And finally update the in-memory PM2 process:

```bash
pm2 update
```

That's all, you now have a fresh and up-to-date PM2 system!

## Updating Startup Script

When you upgrade your Node.js version, the node binary path will change. To update the PM2 startup script run:

```bash
$ pm2 unstartup
$ pm2 startup
```




## Using PM2/Keymetrics in AWS Elastic Beanstalk

This page will guide you step by step through the PM2/Keymetrics integration in a Beanstalk environment. We recommend using the [eb cli](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html) for easier deployment.

We created a repository for easy testing: [pm2-ebs-demo](https://github.com/keymetrics/pm2-ebs-demo).

## Setup Beanstalk

Go to your application directory and use `eb init` to setup Beanstalk.

We need to make sure Beanstalk will try to launch your application by using `npm start`. To do so, add a configuration file that sets the Node Command to "npm start" int the .ebextension folder:

./.ebextensions/nodecommand.config

```
option_settings:
  - namespace: aws:elasticbeanstalk:container:nodejs
    option_name: NodeCommand
    value: "npm start"
```

## Integrate PM2

The easiest and less invasive way to monitor your application using PM2 is by requiring it as a npm module. We will simply change the `package.json` structure to let pm2 start the application.
Just add pm2 to your app dependencies: 
`npm install pm2 --save`

Then we will need to change the startup scripts. We call PM2 from the node_modules folder:

```json
"scripts": {
  "start": "./node_modules/pm2/bin/pm2-runtime app.js",
  "poststart":  "node ./node_modules/pm2/bin/pm2 logs"
}
```

 * Customize the `"start"` script to fit your needs.
 * The `"poststart"` script is optionnal, but allows simple log checking directly on the AWS dashboard.

That's all! Run `eb deploy` to get a PM2 instance on your ElasticBeanstalk instances with minimal overhead.

## Integrate PM2 with Keymetrics
We need to pass two variables to PM2 from the environment to link it with Keymetrics: `KEYMETRICS_PUBLIC` and `KEYMETRICS_SECRET`.

* When creating the environment from the cli:
`eb create --envvars KEYMETRICS_PUBLIC=XXXXX,KEYMETRICS_SECRET=XXXXXX
`
* You can also add those variables in the AWS dashboard in the Software Configuration options.

Then follow-up the pm2 integration procedure, and pm2 will auto-link the application at start.


## Using PM2 on Cloud Providers

You might find yourself in a situation in which you do not have access to the CLI to start your Node.js applications.

In such a situation, pm2 must be added as a dependency and must be called with the start script.

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

### Start script in package.json

In your `package.json`, modify your `start` script like the following:

```json
{
  "scripts": {
    "start": "pm2-runtime start ecosystem.config.js --env production"
  }
}
```

## Deploy your app

You can now deploy your application in your cloud providers like you would have done for a regular node.js app.


## Auto restart apps on file change

PM2 can automatically restart your application when a file is modified in the current directory or its subdirectories:

```bash
pm2 start app.js --watch
```

If `--watch` is enabled, stopping it won't stop watching:

- `pm2 stop 0` will not stop watching
- `pm2 stop 0 --watch` will stop watching

Restart with `--watch` will toggle the `watch` parameter.

To watch specific paths, please use a [Ecosystem File](/doc/en/runtime/guide/ecosystem-file/), `watch` can take a string or an array of paths. Default is `true`:

```javascript
module.exports = {
  apps: [{
    script: "app.js",
    watch: ["server", "client"],
    // Delay between restart
    watch_delay: 1000,
    ignore_watch : ["node_modules", "client/img"],
    watch_options: {
      "followSymlinks": false
    }
  }]
}
```

Notes:

`watch_options` is an object that will replace options given to chokidar. Please refer to [chokidar documentation](https://github.com/paulmillr/chokidar#api) for the definition.

PM2 is giving chokidar these Default options:

```
var watch_options = {
  persistent    : true,
  ignoreInitial : true
}
```
