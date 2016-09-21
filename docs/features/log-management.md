---
layout: docs
title: Log Management
description: Log management with PM2
permalink: /docs/usage/log-management/
---

## Log management

PM2 allows you to manage logs easily. You can display all application logs in real-time, flush them, and reload them.
There are also different ways to configure how PM2 will handle your logs (separated in different files, merged, with timestamp...) without modifying anything in your code.

## Displaying logs in real-time

Displaying logs of a specified process or of all processes in real-time:

```bash
# Display option for pm2 logs command
$ pm2 logs -h

# Display all apps logs
$ pm2 logs

# Display only api app logs
$ pm2 logs api

# Display X lines of api log file
$ pm2 logs big-api --lines 1000
```

## JSON output

Starting PM2 2.x, you can now output logs in JSON format with the `--json` option:

```bash
$ pm2 logs --json
```

## Formated output

Starting PM2 2.x, you can now output logs in FORMAT with the `--format` option:

```bash
$ pm2 logs --format
```

## Flushing logs

This will empty all current application logs managed by PM2:

```bash
$ pm2 flush # Clear all the logs
```

Or you can install [pm2-logrotate](http://pm2.keymetrics.io/docs/usage/log-management/#pm2-logrotate-module) or [enable the log rotate](http://pm2.keymetrics.io/docs/usage/log-management/#setting-up-a-native-logrotate) script to handle the log rotation.

## Rotating Logs

[**pm2-logrotate**](https://github.com/pm2-hive/pm2-logrotate) auto rotate logs of PM2 and applications managed:

```bash
$ pm2 install pm2-logrotate
```

[Options](https://github.com/pm2-hive/pm2-logrotate#configure)

## Reloading all logs

Reloading logs is specially usefull for Logrotate or any other rotating log system.
You can reload logs by sending `SIGUSR2` to the PM2 process.
You can also reload all logs via the command line with:

```bash
$ pm2 reloadLogs
```

## Log configuration

### CLI

Example:

```bash
$ pm2 start echo.js --merge-logs --log-date-format="YYYY-MM-DD HH:mm Z"
```

Options:

```bash
--merge-logs                 do not postfix log file with process id
--log-date-format <format>   prefix logs with formated timestamp
-l --log [path]              specify entire log file (error and out are both included)
-o --output <path>           specify out log file
-e --error <path>            specify error log file
```

### JSON way

```
{
  "script"          : "echo.js",
  "error_file"      : "err.log",
  "out_file"        : "out.log",
  "merge_logs"      : true,
  "log_date_format" : "YYYY-MM-DD HH:mm Z"
}
```

### Combine out and err logs

To combine all logs into the same file set the same value for `error_file`, `out_file` or use an additional `log_file`.

For example, this keeps `out` and `err` separated but adds a combined file:

```
{
  "log_file": "combined.outerr.log",
  "out_file": "out.log",
  "err_file": "err.log"
}
```

Or if you want out and err combined without any other file, just use the same log file:

```
{
  "out_file": "combined.log",
  "err_file": "combined.log"
}
```

Note that relatives logs paths will usually be written in the `PM2_HOME` (`~/.pm2/logs`).

### Disabling log suffix

Use the `--merge-logs` option to disable automatic log file suffixing.

### Setting up a native logrotate

```bash
$ sudo pm2 logrotate -u user
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
