---
layout: docs
title: Process Management
description: Process Management
permalink: /docs/usage/process-management/
---

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
