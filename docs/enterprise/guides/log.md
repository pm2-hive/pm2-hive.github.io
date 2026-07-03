---
layout: docs
title: Log Storage | Guides | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
hide_comments: true
permalink: "/docs/enterprise/guides/log/"
description: "This feature allow to store all of your application logs directly in PM2 Enterprise so you can retrieve them later to inspect them. It take the standard…"
---

# Overview

This feature allow to store all of your application logs directly in PM2 Enterprise so you can retrieve them later to inspect them.
It take the standard output / standard error and forward them to our backend to be stored.

To use the feature, you need to configure that you want the logs of the application, **by default the logs aren't sended to our backend**

## Use cases

This feature is actually specific to your case, we don't currently offer a lot of value for your logs because most people prefer to handle logs in their end, with a ELK stack for exemple.

We advise mostly to use the log feature if you don't have a lot of requirements like parsing and extracting data from them. We only offer them to view them as string currently.

## Requirements

In the following documention, we assume that you already have connected your application to PM2 Enterprise (either on-premise and cloud).

## Configuration

#### Using an ecosystem

When using an ecosystem, you can tell to our Agent to forward all the logs using this configuration:

```js
{
  "apps": [
    {
      "name": "my-application",
      "script": "index.js",
      "broadcast_logs": true // set it to true
    }
  ]
}
```

#### Using an environment variable

When launching your app with the CLI, you can add an environment variable to tell our agent to forward the logs: 

```bash
BROADCAST_LOGS=1 pm2 reload app --update-env
```

You can also set it directly inside your dockerfile with the `ENV` instruction: 

```docker
FROM node:10-alpine

# add pm2
RUN npm install -g pm2 2> /dev/null

# broadcast all the logs
ENV BROADCAST_LOGS 1

# ....
# copy the files and install all the dependencies
# ....

CMD [ "pm2-runtime", "app.js" ]
```

#### Using the standalone agent

You only need to init `@pm2/io` with the `sendLogs` option set to `true` like this: 

```js
const io = require('@pm2/io').init({
  standalone: true,
  apmOptions: {
    publicKey: process.env.KM_PUBLIC_KEY,
    secretKey: process.env.KM_SECRET_KEY,
    appName: process.env.KM_APP_NAME,
    sendLogs: true
  }
})
```

#### Using the Golang agent

```go
pm2io.Notifier.Log("something about my application")
```

You may want to integrate with your logger framework, it's actually pretty easy, here is a exemple with Logrus: 

```go
package main

import (
  pm2io "github.com/keymetrics/pm2-io-apm-go"
  "github.com/sirupsdocs/logrus"
)

// HookLog will send logs to PM2 Plus
type HookLog struct {
  Pm2 *pm2io.Pm2Io
}

// HookErr will send all errors to PM2 Plus
type HookErr struct {
  Pm2 *pm2io.Pm2Io
}

// Fire event
func (hook *HookLog) Fire(e *logrus.Entry) error {
  str, err := e.String()
  if err == nil {
    hook.Pm2.Notifier.Log(str)
  }
  return err
}

// Levels for all possible logs
func (*HookLog) Levels() []logrus.Level {
  return logrus.AllLevels
}

// Fire an error and notify it as exception
func (hook *HookErr) Fire(e *logrus.Entry) error {
  if err, ok := e.Data["error"].(error); ok {
    hook.Pm2.Notifier.Error(err)
  }
  return nil
}

// Levels only for errors
func (*HookErr) Levels() []logrus.Level {
  return []logrus.Level{logrus.ErrorLevel}
}

func main() {
  pm2 := pm2io.Pm2Io{
    Config: &structures.Config{
      PublicKey: "myPublic",
      PrivateKey: "myPrivate",
      Name: "Golang app",
    },
  }

  logrus.AddHook(&HookLog{
    Pm2: pm2,
  })
  logrus.AddHook(&HookErr{
    Pm2: pm2,
  })
}
```

## Best practices

There not a lot of best practices for your logs since the feature is pretty basic, you cannot configure anything more than sending the logs or not.

## Questions / Answers

* Can i forward my logger to PM2 Enterprise? (in the case of winston in Node.js for example)
  
  No, we currently only support sending the `stdout` and `stderr` of the process, in the winston case just tell him to output to the console

* Do all agent support sending logs?
  
  We advise to check direclty in the documentation of each agent to verify if the logs are available or not.

* Can i search in those logs?
    
  You cannot search in all your logs for a specific string for now.
  The only search possible is when you already fetched the logs in the frontend, you can search **ONLY** in them (those in your browser).

## Common Issues

* I can't see any logs in PM2 Enterprise!

  You need to check if the connection is working between the agent and PM2 Enterprise, we advise to check the documentation of the agent you are using.
