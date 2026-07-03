---
layout: post
title: JSON Micro-Service configuration with PM2
description: As you already know, PM2 is a production process manager. In this post I will show you how and why PM2 is best fit to deploy microservices-oriented applications.
tags: tutorial performance
---

As you already know, [PM2](http://github.com/Unitech/PM2) is a production process manager. In this post I will show you how and why PM2 is best fit to deploy microservices-oriented applications.

## Micro-Service architecture

_What is it ?_

There is a [lot to say](http://martinfowler.com/articles/microservices.html) about the microservices architecture. Basically, it is a design pattern in which an application is the sum of many smaller independently deployable applications (services).

Each one of these smaller apps is designed to do a specific task [and do it well](http://onethingwell.org/post/457050307/about-one-thing-well).

_When to use it ?_

Instead of having one big monolithic software, you will separate it into different logical and independant services that will interact between them. To make these services interact between themselves you can use a PUB/SUB system like the one provided by [Redis](http://redis.io) for example.

The micro-service pattern allows you to :

* make re-usable components
* stop/start different elements
* scale the application easily
* make it easier for new developers in the team to understand the code

_How do we use it at Keymetrics?_

Every Keymetrics-node has 6 services running separately communicating between one another:

* **API**, expose the data via HTTP
* **Interactor**, listens to PM2 connections
* **Reverse Interactor**, handles interactions from the dashboard
* **Notification**, send emails and save notifications
* **Limit Worker**, applies limit depending on the plan
* **Reporter**, generate and send reports of your infra

## PM2 & JSON process declaration

PM2 comes in quite handy when you have to manage several applications at once. It allows you to declare the behavior of each application with a simple JSON.

**JSON declaration**

Here is a simple example with two services running, an API and a Worker.

Here is the content of my `processes.json`:

```json
[
  {
    "script": "api.js",
    "name": "web-api",
    "exec_mode": "cluster",
    "instances": -1  // number of CPUs -1
  },
  {
    "script": "worker.js",
    "name": "worker",
    "exec_mode": "fork",
    "watch": true,  // auto restart app on change,
    "env": {  // common env variables
      "INTERVAL" : 1000
    },
    "env_production": {  // Used if --env prod
      "INTERVAL" : 60000
    }
  }
]
```

There is a [wide range of options](https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#list-of-all-json-declaration-fields-avaibles) that can be passed to each process.

Now it's easy to manage these processes:

```bash
$ pm2 start  processes.json
$ pm2 start  processes.json --env production
$ pm2 stop   processes.json
$ pm2 delete processes.json
$ pm2 reload processes.json

# Manage single process
$ pm2 stop   web-api
$ pm2 reload web-api
```

**Programmatic**

PM2 also offers a simple programmatic API which allows you to start JSON straight from your code:

```js
const pm2 = require('pm2')

pm2.connect(() => {
  pm2.start(
    [
      {
        "script": "api.js",
        "name": "web-api",
        "exec_mode": "cluster",
        "instances": -1  // number of CPUs -1
      }, {
        "script": "worker.js",
        "name": "worker",
        "exec_mode": "fork"
      }
    ], (err, processes) => {
      if (err) throw new Error(err)
      pm2.disconnect(;  // Close connections to PM2
    }
  )
})
```

**List of all JSON-declaration fields**

| Field | Type | Example | Description |
| :---: | :---: | :---: | :---: |
| name | string |  "myAPI" | name your app will have in PM2 |
| script | string |  "bin/app.js" | path of your app |
| args | list | ["--enable-logs", "-n", "15"] | arguments given to your app when it is launched |
| node_args | list | ["--harmony", "--max-stack-size=1024"] | arguments given to node when it is launched |
| cwd | string |  "/var/www/app/prod" | the directory from which your app will be launched |
| exec_mode | string |  "cluster" |  "fork" mode is used by default, "cluster" mode can be configured with `instances` field |
| instances | number | 4 | number of instances for your clustered app, `0` means as much instances as you have CPU cores. a negative value means CPU cores - value (e.g -1 on a 4 cores machine will spawn 3 instances) |
| exec_interpreter | string |  "node" | defaults to "node". can be "python", "ruby", "bash" or whatever interpreter you wish to use. "none" will execute your app as a binary executable |
| log_date_format | string |  "YYYY-MM-DD HH:mm Z" | format in which timestamps will be displayed in the logs |
| error_file | string |  "/var/log/node-app/node-app.stderr.log" | path to the specified error log file. PM2 generates one by default if not specified and you can find it by typing `pm2 desc <app id>` |
| out_file | string |  "/var/log/node-app/node-app.stdout.log" | path to the specified output log file. PM2 generates one by default if not specified and you can find it by typing `pm2 desc <app id>` |
| pid_file | string |  "pids/node-geo-api.pid" | path to the specified pid file. PM2 generates one by default if not specified and you can find it by typing `pm2 desc <app id>` |
| merge_logs | boolean | false | defaults to false. if true, it will merge stdout and stderr logs into the same file |
| cron_restart | string |  `"1 0 * * *"` | a cron pattern to restart your app. only works in "cluster" mode for now. soon to be avaible in "fork" mode as well |
| watch | boolean | true | enables the watch feature, defaults to "false". if true, it will restart your app everytime a file change is detected on the folder or subfolder of your app. |
| ignore_watch | list | ["[\/\\]\./", "node_modules"] | list of regex to ignore some file or folder names by the watch feature |
| max_restarts | number | 10 | number of consecutive unstable restarts (less than 1sec interval) before your app is considered errored and stop being restarted by PM2. defaults to 15. |
| max_memory_restart | string |  "150M" | your app will be restarted by PM2 if it exceeds the amount of memory specified. human-friendly format : it can be "10M", "100K", "2G" and so on... |
| env | object | {"NODE_ENV": "production", "ID": "42"} | env variables which will appear in your app |
| autorestart | boolean | false | true by default. if false, PM2 will not restart your app if it crashes or ends peacefully |
| vizion | boolean | false | true by default. if false, PM2 will start without vizion features (versioning control metadatas) |
| post_update | list | ["npm install", "echo launching the app"] | a list of commands which will be executed after you perform a Pull/Upgrade operation from Keymetrics dashboard |
| force | boolean | true | defaults to false. if true, you can start the same script several times which usually is not allowed by PM2 |
| next_gen_js | boolean | true | defaults to false. if true, PM2 will launch your app using embedded BabelJS features which means you can run ES6/ES7 javascript code |

**Binding multiple process to different ports**

When you start an app in cluster mode with PM2, let's say `pm2 start app.js -i 8`, each of the instances will have an env variable named `NODE_APP_INSTANCE` which in this case goes from 0 to 7.

It allows you to identify each instance and for example do something like `server.listen(8000 + process.env.NODE_APP_INSTANCE);`

## Conclusion

Learn more about JSON application declaration [here](https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#json-app-declaration).

PM2 makes it easy to manage processes. These processes can be Node.js applications, PHP and even ASM! :)
