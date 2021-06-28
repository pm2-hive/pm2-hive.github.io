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

![image](https://user-images.githubusercontent.com/757747/123512784-b0341900-d689-11eb-93d4-69510ee2be27.png)

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
#### Configuration File

When managing multiple application at the same time or having to specify multiple options, you can use a configuration file.
Example with this ecosystem.config.js file:

```javascript
module.exports = {
  apps : [{
    name   : "limit worker",
    script : "./worker.js",
    args   : "limit"
  },{
    name   : "rotate worker",
    script : "./worker.js",
    args   : "rotate"
  }]
}
```

Then to start both apps:

```bash
$ pm2 start ecosystem.config.js
```

Read more about [configuration file](/docs/usage/application-declaration/).

### Restart

To restart an application:

```bash
$ pm2 restart api
```

To restart all applications:

```bash
$ pm2 restart all
```

#### Updating environment variables and options

To update environment variables or PM2 options, specify the `--update-env` CLI option:

```bash
$ NODE_ENV=production pm2 restart web-interface --update-env
```

### Stop

To stop a specified application:

```bash
$ pm2 stop api
$ pm2 stop [process_id]
```

To stop them all:

```bash
$ pm2 stop all
```

Note: this will not delete the application from PM2 application list. See next section to delete an application.

### Delete

To stop and delete an application:

```bash
$ pm2 delete api
```

To delete them all:

```bash
$ pm2 delete all
```

## Listing Applications

To list all running applications:

```bash
$ pm2 list
# Or
$ pm2 [list|ls|l|status]
```

![image](https://user-images.githubusercontent.com/757747/123511260-a3f78e00-d680-11eb-8907-3f1017ef7dc8.png)


To specify which order you want the application to be listed:

```bash
$ pm2 list --sort name:desc
# Or
$ pm2 list --sort [name|id|pid|memory|cpu|status|uptime][:asc|desc]
```

### Terminal Dashboard

PM2 gives you a simple way to monitor the resource usage of your application.
You can monitor memory and CPU easily and straight from your terminal with:

```bash
pm2 monit
```

<center>
<img src="/images/pm2-monit.png" title="PM2 Monit"/>
</center>


### Showing application metadata

To display metadata about an application:

```bash
$ pm2 show api
```

<img src="https://user-images.githubusercontent.com/757747/123510635-fafb6400-d67c-11eb-8534-0ce6106979b2.png" alt="drawing" width="600"/>

### Reset restart count

To reset the restart counter:

```bash
$ pm2 reset all
```
