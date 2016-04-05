---
layout: docs
title: Quick Start
description: Getting started with PM2
permalink: /docs/usage/quick-start/
---

<center><img src="/images/logo_pm2.png" name="logo pm2"/></center>

Welcome to this PM2 Quick Start! Getting started with PM2 is straightforward, it is offered as a simple and intuitive CLI, installable via NPM. Just start your application with PM2 and you're application is ready to handle ton of traffic!

## Installation

The latest PM2 stable version is installable via NPM:

```bash
$ npm install pm2@latest -g
```

## Usage

The simplest way to start, daemonize and monitor your application is this:

```bash
$ pm2 start app.js
```

## Application declaration

You can also create a configuration file manage multiple applications:

process.yml:

```yaml
apps:
  - script   : app.js
    instances: 4
    exec_mode: cluster
  - script : worker.js
    watch  : true
    env    :
      NODE_ENV: development
    env_production:
      NODE_ENV: production
```

And start it easily:

```bash
$ pm2 start process.yml
```

Read more about application declaration [here](/docs/usage/application-declaration/)

## Convenient setup

### Setup Auto Completion

It will help you autocompleting commands, application name and related:

```bash
$ pm2 completion install
```

[More information](/docs/usage/auto-completion/)

### Setup startup script

Restarting PM2 with the processes you manage on server boot/reboot is critical. To solve this just run this command to generate an active startup script:

```bash
$ pm2 startup
```

[More information](/docs/usage/startup/)

## Folder structure

Once PM2 is started, it will automatically create these folders:

- `$HOME/.pm2` will contain all PM2 related files
- `$HOME/.pm2/logs` will contain all applications logs
- `$HOME/.pm2/pids` will contain all applications pids
- `$HOME/.pm2/pm2.log` PM2 logs
- `$HOME/.pm2/pm2.pid` PM2 pid
- `$HOME/.pm2/rpc.sock` Socket file for remote commands
- `$HOME/.pm2/pub.sock` Socket file for publishable events
- `$HOME/.pm2/conf.js` PM2 Configuration

In Windows the $HOME environmenet variable may be $HOMEDRIVE + $HOMEPATH ([link](https://github.com/Unitech/pm2/blob/master/constants.js#L16))

## CheatSheet

Here are some commands that worth to know. Just try them with a sample application or your current web application on your development machine:

```bash
# Fork mode
$ pm2 start app.js --name my-api # Name process

# Cluster mode
$ pm2 start app.js -i 0        # Will start maximum processes with LB depending on available CPUs
$ pm2 start app.js -i max      # Same as above, but deprecated yet.

# Listing

$ pm2 list               # Display all processes status
$ pm2 jlist              # Print process list in raw JSON
$ pm2 prettylist         # Print process list in beautified JSON

$ pm2 describe 0         # Display all informations about a specific process

$ pm2 monit              # Monitor all processes

# Logs

$ pm2 logs [--raw]       # Display all processes logs in streaming
$ pm2 flush              # Empty all log file
$ pm2 reloadLogs         # Reload all logs

# Actions

$ pm2 stop all           # Stop all processes
$ pm2 restart all        # Restart all processes

$ pm2 reload all         # Will 0s downtime reload (for NETWORKED apps)
$ pm2 gracefulReload all # Send exit message then reload (for networked apps)

$ pm2 stop 0             # Stop specific process id
$ pm2 restart 0          # Restart specific process id

$ pm2 delete 0           # Will remove process from pm2 list
$ pm2 delete all         # Will remove all processes from pm2 list

# Misc

$ pm2 reset <process>    # Reset meta data (restarted time...)
$ pm2 update             # Update in memory pm2
$ pm2 ping               # Ensure pm2 daemon has been launched
$ pm2 sendSignal SIGUSR2 my-app # Send system signal to script
$ pm2 start app.js --no-daemon
$ pm2 start app.js --no-vizion
$ pm2 start app.js --no-autorestart
```

## *42 starts*

*ndlr;* 42 is the answer to life the universe and everything

```bash
$ pm2 start app.js           # Start app.js

$ pm2 start app.js -- -a 23  # Pass arguments '-a 23' argument to app.js script

$ pm2 start app.js --name serverone # Start a process and name it as serverone
                                    # you can now stop the process by doing
                                    # pm2 stop serverone

$ pm2 start app.js --node-args="--debug=7001" # --node-args to pass options to node V8

$ pm2 start app.js -i 0             # Start maximum processes depending on available CPUs (cluster mode)

$ pm2 start app.js --log-date-format "YYYY-MM-DD HH:mm Z"    # Log will be prefixed with custom time format

$ pm2 start app.json                # Start processes with options declared in app.json
                                    # Go to chapter Multi process JSON declaration for more

$ pm2 start app.js -e err.log -o out.log  # Start and specify error and out log

```

For scripts in other languages:

```bash
$ pm2 start echo.pl --interpreter=perl

$ pm2 start echo.coffee
$ pm2 start echo.php
$ pm2 start echo.py
$ pm2 start echo.sh
$ pm2 start echo.rb
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

## Options

```
Options:

   -h, --help                           output usage information
   -V, --version                        output the version number
   -v --version                         get version
   -s --silent                          hide all messages
   -m --mini-list                       display a compacted list without formatting
   -f --force                           force actions
   -n --name <name>                     set a <name> for script
   -i --instances <number>              launch [number] instances (for networked app)(load balanced)
   -l --log [path]                      specify entire log file (error and out are both included)
   -o --output <path>                   specify out log file
   -e --error <path>                    specify error log file
   -p --pid <pid>                       specify pid file
   --max-memory-restart <memory>        specify max memory amount used to autorestart (in megaoctets)
   --env <environment_name>             specify environment to get specific env variables (for JSON declaration)
   -x --execute-command                 execute a program using fork system
   -u --user <username>                 define user when generating startup script
   -c --cron <cron_pattern>             restart a running process based on a cron pattern
   -w --write                           write configuration in local folder
   --interpreter <interpreter>          the interpreter pm2 should use for executing app (bash, python...)
   --log-date-format <momentjs format>  add custom prefix timestamp to logs
   --no-daemon                          run pm2 daemon in the foreground if it doesn't exist already
   --merge-logs                         merge logs from different instances but keep error and out separated
   --watch                              watch application folder for changes
   --ignore-watch <folders|files>       folder/files to be ignored watching, chould be a specific name or regex - e.g. --ignore-watch="test node_modules "some scripts""
   --node-args <node_args>              space delimited arguments to pass to node in cluster mode - e.g. --node-args="--debug=7001 --trace-deprecation"
   --no-color                           skip colors
   --no-vizion                          skip vizion features (versioning control)
   --no-autorestart                     do not automatically restart apps
```

## What's next?

Learn how to declare all your applications behavior options into a [JSON configuration file](http://pm2.keymetrics.io/docs/usage/application-declaration/)

Learn how to do [clean stop and restart](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/) to increase reliability

Learn how to [deploy and update production applications easily](http://pm2.keymetrics.io/docs/usage/deployment/)

Monitor your production applications with [Keymetrics](https://keymetrics.io/)

## How to update PM2

Install the latest pm2 version :

```bash
$ npm install pm2@latest -g
```

Then update the in-memory PM2 :

```bash
$ pm2 update
```
