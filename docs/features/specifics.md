---
layout: docs
title: "Advanced Topics"
description: "Advanced PM2 topics: binding to port 80 without root, running multiple PM2 daemons, no-daemon mode, stateless apps and Node.js interpreter flags."
permalink: /docs/usage/specifics/
last_modified_at: 2026-07-03
---

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

## Launch PM2 in no daemon

Make sure you kill any PM2 instance before starting PM2 in no daemon mode (`pm2 kill`).

Launching PM2 without daemonizing itself:

```bash
pm2 start app.js --no-daemon
```

There is also the CLI `pm2-runtime` installed by default at PM2 installation, that is a drop-in replacement of the Node.js binary.

## Stateless apps

It is a general rule that your production application should be stateless. Every data, states, websocket session, session data, must be shared via any kind of database or PUB/SUB system.

If not, your application will be painful to scale on the same server and across multiple servers.

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

## Passing Node.js flags

The `--node-args` option allows the addition of arguments to the node interpreter (`--interpreter-args` is an alias). For example to increase the memory limit or enable inspection:

```bash
pm2 start my_app.js --node-args="--max-old-space-size=4096"
```

And within a JSON declaration:

```json
[{
  "name" : "my-app",
  "script" : "app.js",
  "node_args" : "--max-old-space-size=4096"
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

You can specify the env variable `PROCESS_TITLE` when start an application with PM2, it will be set a process title. It pretty useful when trying to get specific data from the process, for example you can use `ps -fC name`.

## Transpilers

Refer to [Using transpilers with PM2](https://pm2.keymetrics.io/docs/tutorials/using-transpilers-with-pm2) tutorial.

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
- [How To Set Up a Node.js Application for Production on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04)
- [How to deploy Node.js applications with PM2 and Nginx on Ubuntu](https://www.howtoforge.com/tutorial/how-to-deploy-nodejs-applications-with-pm2-and-nginx-on-ubuntu/)
