---
layout: docs
title: Logs
description: Log management with PM2
permalink: /docs/usage/log-management/
---

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

This will empty the current application logs managed by PM2:

```bash
pm2 flush

pm2 flush <api> # Clear the logs for the app with name/id matching <api>
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
