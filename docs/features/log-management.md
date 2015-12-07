---
layout: docs
title: Log Management
description: Log management with PM2
permalink: /docs/usage/log-management/
---

PM2 allows you to manage logs easily. You can display all application logs in real-time, flush them, and reload them.
There are also different ways to configure how PM2 will handle your logs (separated in different files, merged, with timestamp...) without modifying anything in your code.

## Displaying logs in real-time

Displaying logs of a specified process or of all processes in real-time:

```bash
$ pm2 logs
$ pm2 logs big-api
```

## Flushing logs

This will empty all current application logs managed by PM2:

```bash
$ pm2 flush # Clear all the logs
```

Or you can install Log rotate to handle the log rotation.

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
  "error_file"        : "err.log",
  "out_file"        : "out.log",
  "merge_logs"      : true,
  "log_date_format" : "YYYY-MM-DD HH:mm Z"
}
```

**Note**: To merge all logs into the same file set the same value for `error_file`, `out_file`.

### Settings up a native logrotate

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

## pm2-logrotate Module

[**pm2-logrotate**](https://github.com/pm2-hive/pm2-logrotate) auto rotate logs of PM2 and applications managed<br/>

```bash
$ pm2 install pm2-logrotate
```
