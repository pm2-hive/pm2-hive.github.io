---
layout: docs
title: Logs
description: Log management with PM2
permalink: /docs/usage/log-management/
---

## Application Logs

Once an application is started with PM2 you can consult and manage logs easily.
Log files are located in the folder `$HOME/.pm2/logs`.

### Log Views

To display application's log you can use the command `pm2 logs`

```bash
❯ pm2 logs -h

  Usage: logs [options] [id|name|namespace]

  stream logs file. Default stream all logs

  Options:

    --json                json log output
    --format              formated log output
    --raw                 raw output
    --err                 only shows error output
    --out                 only shows standard output
    --lines <n>           output the last N lines, instead of the last 15 by default
    --timestamp [format]  add timestamps (default format YYYY-MM-DD-HH:mm:ss)
    --nostream            print logs without lauching the log stream
    --highlight [value]   highlights the given value
    -h, --help            output usage information
```

Some important commands:

```bash
# Display all apps logs in realtime
pm2 logs

# Display only `api` application logs
pm2 logs api

# Display new logs in json
pm2 logs --json

# Display 1000 lines of api log file
pm2 logs big-api --lines 1000
```

You can also check logs with the CLI dashboard:

```bash
pm2 monit
```

## Log size limit

The module [pm2-logrotate](https://github.com/keymetrics/pm2-logrotate) automatically rotate and keep all the logs file using a limited space on disk.

To install it:

```bash
pm2 install pm2-logrotate
```

Read more about pm2-logrotate [here](https://github.com/pm2-hive/pm2-logrotate#configure)

## Flushing logs

This will empty the current application logs managed by PM2:

```bash
pm2 flush

pm2 flush <api> # Clear the logs for the app with name/id matching <api>
```

## Application log options

When starting an application you can specify many options on how 

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

### Configuration file

Via configuration file you can pass the options:

|    Field |   Type  |  Example |  Description|
|:----------|:-------:|:------------------------------:|:-------------------------|
|error_file| (string)| | error file path (default to $HOME/.pm2/logs/XXXerr.log)|
|out_file| (string) | | output file path (default to $HOME/.pm2/logs/XXXout.log)|
|pid_file| (string) | | pid file path (default to $HOME/.pm2/pid/app-pm_id.pid)|
|merge_logs| boolean | true | if set to true, avoid to suffix logs file with the process id  |
|log_date_format| (string) | "YYYY-MM-DD HH:mm Z" | log date format (see log section)|

### Disabling log suffix
 
For app in cluster mode (node.js) only;
If you want that all instances of a clustered process logs into the same file you can use the option `--merge-logs` or `merge_logs: true` 

### Disable logging

To disable all logs to be written in disk you can set the option `out_file` and `error_file` to `/dev/null`

```js
module.exports = {
  apps : [{
    name: 'Business News Watcher',
    script: 'app.js',
    instances: 1,
    out_file: "/dev/null",
    error_file: "/dev/null"
    cron_restart: '0 0 * * *'
    [...]
  }]
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
