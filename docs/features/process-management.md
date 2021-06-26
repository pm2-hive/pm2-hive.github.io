---
layout: docs
title: Process Management
description: Process Management
permalink: /docs/usage/process-management/
---

## Managing applications states

With PM2 you can easily start/restart/reload/stop/list applications in background.

### Start
  
To start an application:

```bash
$ pm2 start api.js
```

When managing multiple application at the same time, you can use a [configuration file](/docs/usage/application-declaration/).

You can also start any kind of application like bash commands, script, binaries:

```bash
$ pm2 start "npm run start"
$ pm2 start "ls -la"
$ pm2 start app.py
```

#### Start and display log stream

To start an app and check logs stream use the `--attach` option:

```bash
$ pm2 start api.js --attach
```

When quitting via Ctrl-C, the app will still run in background.

#### Passing arguments

All option passed after `--` will be passed as argument to the app:

```bash
$ pm2 start api.js -- arg1 arg2
```

### Restart

To restart an application:

```bash
pm2 restart api
```

#### Updating environment variables and options

To update environment variables or PM2 options, specify the `--update-env` CLI option:

```bash
NODE_ENV=production pm2 restart web-interface --update-env
```

### Stop

To stop a specified application:

```bash
pm2 stop api
```

Note: this will not delete the application from PM2 application list. See next section to delete an application.

### Delete 

To stop and delete an application:

```bash
pm2 delete api
```

## Listing Applications

To list all running applications:

```bash
pm2 list
# Or
pm2 [list|ls|l|status]
```

![image](https://user-images.githubusercontent.com/757747/123511260-a3f78e00-d680-11eb-8907-3f1017ef7dc8.png)


To specify which order you want the application to be listed:

```bash
pm2 list --sort name:desc
# Or
pm2 list --sort [name|id|pid|memory|cpu|status|uptime][:asc|desc]
```

### Showing application metadata

To display metadata about an application:

```bash
pm2 show api
```

<img src="https://user-images.githubusercontent.com/757747/123510635-fafb6400-d67c-11eb-8534-0ce6106979b2.png" alt="drawing" width="600"/>

### Reset restart count

To reset the restart counter:

```bash
pm2 reset all
```
