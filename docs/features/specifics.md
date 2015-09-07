---
layout: docs
title: Specifics
description: Specifics
permalink: /docs/usage/specifics/
---

## Allow PM2 to bind applications on ports 80/443 without root

It’s a general rule that you shouldn’t run node as root, but only root can bind to ports less than 1024. This is where authbind comes in. Authbind allows non-root users to bind to ports less than 1024.

```bash
$ sudo apt-get install authbind
$ sudo touch /etc/authbind/byport/80
$ sudo chown {{user}} /etc/authbind/byport/80
$ sudo chmod 755 /etc/authbind/byport/80
$ authbind --deep pm2 update
```

Now you can start applications with PM2 that can bind to port 80 without being root!

It's recommended to put an alias in your .bashrc file:

```bash
alias pm2='authbind --deep pm2'
```

## Multiple PM2 on the same server

The client and daemon communicates via socket files available in $HOME/.pm2/[pub.sock|rpc.sock]

You can start multiple PM2 instances by changing the `PM2_HOME` environmnent variable.

```bash
$ PM2_HOME='.pm2' pm2 start echo.js --name="echo-node-1"
$ PM2_HOME='.pm3' pm2 start echo.js --name="echo-node-2"
```

This will start two different PM2 instances. To list processes managed by each different instances do:

```bash
$ PM2_HOME='.pm2' pm2 list
$ PM2_HOME='.pm3' pm2 list
```

## Run Next generation Javascript

PM2 embeds [BabelJS](https://babeljs.io/) to use [next generation Javascript](http://es6-features.org/) both in development and production.

All features are supported, like watch and restart, cluster mode, reload and related.

To run an ES6/ES7 applications:

```bash
# Enable ES6/ES7 live compilation
$ pm2 start app.js --next-gen-js

# Or use the .es extension to automatically enable it
$ pm2 start app.es
```

## Launch PM2 in no deamon

Launching PM2 without daemonizing itself:

```bash
$ pm2 start app.js --no-daemon
```

Sending a system signal to a process:

```bash
$ pm2 sendSignal SIGUSR2 my-app
```

## Configuration file

You can specify the following options by editing the file `~/.pm2/custom_options.sh`:

```
PM2_RPC_PORT
PM2_PUB_PORT
PM2_BIND_ADDR
PM2_API_PORT
PM2_GRACEFUL_TIMEOUT
PM2_MODIFY_REQUIRE
PM2_KILL_TIMEOUT
```

## API health endpoint

```bash
$ pm2 web
```

## Enabling Harmony ES6

The `--node-args` option permit to launch script with V8 flags, so to enable harmony for a process just do this:
```bash
$ pm2 start my_app.js --node-args="--harmony"
```

And with JSON declaration:

```json
[{
  "name" : "ES6",
  "script" : "es6.js",
  "node_args" : "--harmony"
}]
```

## CoffeeScript

```bash
$ pm2 start server.coffee --interpreter coffee
```

That's all!

## JSON app configuration via pipe from stdout

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

## User tips from issues

- [Vagrant and pm2 #289](https://github.com/Unitech/pm2/issues/289#issuecomment-42900019)
- [Start the same app on different ports #322](https://github.com/Unitech/pm2/issues/322#issuecomment-46792733)
- [Using ansible with pm2](https://github.com/Unitech/pm2/issues/88#issuecomment-49106686)
- [Cron string as argument](https://github.com/Unitech/pm2/issues/496#issuecomment-49323861)
- [Restart when process reaches a specific memory amount](https://github.com/Unitech/pm2/issues/141)
- [Sticky sessions and socket.io discussion](https://github.com/Unitech/PM2/issues/637)
- [EACCESS - understanding pm2 user/root rights](https://github.com/Unitech/PM2/issues/837)

## External resources and articles

- [Goodbye node-forever, hello pm2](http://devo.ps/blog/goodbye-node-forever-hello-pm2/)
- [https://serversforhackers.com/editions/2014/11/04/pm2/](https://serversforhackers.com/editions/2014/11/04/pm2/)
- http://www.allaboutghost.com/keep-ghost-running-with-pm2/
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
