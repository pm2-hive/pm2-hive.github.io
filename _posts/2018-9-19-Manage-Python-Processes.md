---
layout: post
title: Manage Python Processes
description: With PM2, rolling restarts, monitoring, checking logs and even deploying application has never been that simple
tags: tutorial python
---

[PM2](https://github.com/Unitech/pm2) is a production-grade process manager that makes management of background process easy. In the Python world we could compare PM2 to Supervisord, but PM2 has some nifty features you might like.

With PM2, rolling restarts, monitoring, checking logs and even deploying application has never been that simple. We really value CLI UX, so PM2 is really simple to use and master.

[PM2 has 5 years of history](https://www.youtube.com/watch?v=tZs17VzuTCs), more than [65 million downloads](http://map.keymetrics.io/) and has become one of the preferred way to run Node.js in production servers. Checkout the [PM2 Github](https://github.com/Unitech/pm2)

In this article, you will learn how to use the process manager [PM2](https://github.com/Unitech/pm2) to manage Python application, because yes it can also manage Python application efficiently!

## Installing PM2

PM2 depends on Node.js. To install Node it's pretty straightforward:

```bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```

_To install Node.js on other platforms check [Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/)_

### Get PM2

Now to install PM2 type:

```bash
sudo npm install pm2 -g
```

To initialize PM2, just type one command:

```bash
pm2 ls
```

You should see a nice ASCII art giving you some of the PM2 key commands:

```bash
┌──────────┬────┬─────────┬──────┬─────┬────────┬─────────┬────────┬─────┬─────┬──────────┐
│ App name │ id │ version │ mode │ pid │ status │ restart │ uptime │ cpu │ mem │ watching │
└──────────┴────┴─────────┴──────┴─────┴────────┴─────────┴────────┴─────┴─────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app
```

Now that PM2 has been installed let's start a Python application.

## Starting a Python App

Starting an application with PM2 is straightforward. It will auto discover the interpreter to run your application depending on the script extension. This can be configurable via the Ecosystem config file, as I will show you later on this article.

Let's take this dumbly simple Python app and call it hello.py:

```python
#!/usr/bin/python
import time

while 1:
    print("Start: %s" % time.ctime())
    time.sleep(1)
```

Now to start it:

```bash
pm2 start hello.py
```

You will then see the process started:

```bash
[PM2] Starting /home/florian/playground-python/hello.py in fork_mode (1 instance)
[PM2] Done.
┌──────────┬────┬──────┬───────┬────────┬─────────┬────────┬─────┬──────────┬──────────┐
│ App name │ id │ mode │ pid   │ status │ restart │ uptime │ cpu │ mem      │ watching │
├──────────┼────┼──────┼───────┼────────┼─────────┼────────┼─────┼──────────┼──────────┤
│ hello    │ 0  │ fork │ 76055 │ online │ 0       │ 0s     │ 2%  │ 2.8 MB   │ disabled │
└──────────┴────┴──────┴───────┴────────┴─────────┴────────┴─────┴──────────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app
```

Great, this application will now **run forever**, meaning that if the process exit or throw an exception it will get automatically restarted. If you exit the console and connect again you will still be able to check the application state.

To list application managed by PM2 run:

```bash
pm2 ls
```

This will give you the list of managed processes.

### Checking Logs

Now we may want to check that the application is outputing the right information. To check that we just need to type the command:

```bash
pm2 logs
```

```bash
[TAILING] Tailing last 15 lines for [all] processes (change the value with --lines option)
/home/florian/.pm2/logs/hello-out.log last 15 lines:
0|hello    | Start: Thu Jan 10 16:21:54 2019
```

You can flush the logs file with `pm2 flush` or display the log of one specific process with `pm2 logs <app_name>`

To automate log rotation (without any external logrotate):

```bash
pm2 install pm2-logrotate
```

This will automatically rotate logs every day and keep the total logs space used to 10M.

To know more about log management: [PM2 Log Management](/docs/runtime/guide/log-management/)

### Managing Application State

To stop that application:

```bash
pm2 stop hello
```

To restart it:

```bash
restart hello
```

To stop & delete from the process list:

```bash
pm2 delete hello
```

To know more about log management: [PM2 Process Management](/docs/runtime/guide/process-management/)

### Keeping Processes Alive at Server Reboot

If you want to keep your application online accross unexpected (or expected) server restart, you will want to setup init script to tell your system to boot PM2 and your applications.

It's really simple with PM2, just run this command (without sudo):

```bash
pm2 startup
```

Copy/Paste the last line outputed by this command to setup the init script to automatically boot PM2.

Now that you have setup the auto initialization, you need to tell PM2 which processes to keep across server restart.

To do that it's pretty simple, once you have started the application you want, just type the command:

```bash
pm2 save
```

This will create a dump file and PM2 will automatically spawn this application at reboot.

To know more about this feature: [PM2 Startup](/docs/runtime/guide/startup-hook/)

### Monitoring CPU/Memory and Meta informations

To monitor the CPU/Memory and check some meta informations about your process, just type:

```bash
pm2 monit
```

This will open up a termcaps interface that allows to give you a realtime overview of your running applications:

_You can also use `pm2 show <app name>` to get all possible information about application_

### Using the Ecosystem File

If you have many applications to start or need to pass different parameters, options and so on, we offer the Ecosystem file as a way to declare application configuration easily.

To generate a `ecosystem.config.js` file you just need to type this command:

```bash
pm2 init
```

Once this file is generated let's edit some of the options:

```js
module.exports = {
  apps : [{
    name: 'echo-python',
    cmd: 'hello.py',
    args: 'arg1 arg2',
    autorestart: false,
    watch: true,
    pid: '/path/to/pid/file.pid',
    instances: 4,
    max_memory_restart: '1G',
    env: {
      ENV: 'development'
    },
    env_production : {
      ENV: 'production'
    }
  }, {
    name: 'echo-python-3',
    cmd: 'hello.py',
    interpreter: 'python3'
  }]
};
```

Here we have declared two applications, one running with Python 2.x and the other one running with Python 3.x.

As you can see there are some interesting features here, like the activation of the watch file & restart feature, the setting of a custom interpreter (python3), the numbers of instances/workers to start, the setup of a memory threshold and even different environment variables to pass to the script.

Then to start this ecosystem:

```bash
pm2 start ecosystem.config.js
```

Restart in "production" (env_production):

```bash
pm2 restart ecosystem.config.js --env production
```

_Note: this configuration file can also be a yaml file_

To know more about this feature: [PM2 Ecosystem file](/docs/runtime/guide/ecosystem-file/)

### Conclusion

PM2 is a great process manager, easy to use, fully featured and battle hardened that can be a great asset on your toolbox. We are looking for ideas on how to improve our support for Python, you're welcome to post ideas, feedbacks and PR one the [PM2 official repository](https://github.com/Unitech/pm2)
