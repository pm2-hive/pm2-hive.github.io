---
layout: docs
title: Log Management
description: Log management with PM2
permalink: /docs/usage/log-management/
---

## Log management

PM2 allows you to easily manage your application's logs. You can display the logs coming from all your applications in real-time, flush them, and reload them.
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

Starting with PM2 2.x, you can see logs in JSON format with the `--json` option:

```bash
$ pm2 logs --json
```

Starting with PM2 2.x, you can see logs with a special date format, just use the `--format` option:

```bash
$ pm2 logs --format
```

## Directly output json logs

Starting PM2 `2.4.0`, you can directly ask pm2 to output logs in json using :
  - CLI : `--log-type json`
  - Process file : `"log_type": "json"`
  
This will output logs as json object into `err` and `out` files, see an example of json object:
```json
{
   "message": "echo\n",                     // the actual message that has been `console.log`
   "timestamp": "2017-02-06T14:51:38.896Z", // timestamp of the message, can be formated
   "type": "out",                           // the type of logs, can be `err`, `out` or `PM2`
   "process_id": 0,                         // the process id used by PM2
   "app_name": "one-echo"                   // the application name
}
```

Note: Timestamp can be formatted using `--format` in CLI and `"date_format": "JJ-MM-YYYY"` in process file, the formatting is done with `moment` so you can use every format that are accepted by it.

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

Reloading logs is especially useful for Logrotate or any other rotating log system.
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

To combine all logs into the same file, set the same value for `error_file`, `out_file` or use an additional `log_file`.

For example, this keeps `out` and `err` separated but adds a combined file:

```
{
  "log_file": "combined.outerr.log",
  "out_file": "out.log",
  "error_file": "err.log"
}
```

If you want out and err combined without using any other file, just use the same log file:

```
{
  "out_file": "combined.log",
  "error_file": "combined.log"
}
```

Note that relative logs paths will be based unpon `cwd`.

### Disabling log suffix

Use the `--merge-logs` option to disable automatic log file suffixing.

### Disable logging

```
{
  "out_file": "/dev/null",
  "error_file": "/dev/null"
}
```

Starting PM2 `2.4.0`, you can provide `/dev/null` or `NULL` as output of logs (not depending on the platform, they are harcoded string).
**NOTE:** Take care that the merged log file will be still active, these values are only used for `error` and `out` files.

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
