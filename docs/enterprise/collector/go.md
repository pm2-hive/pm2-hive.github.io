---
layout: docs
title: Golang Agent | Guides | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
permalink: "/docs/enterprise/collector/go/"
description: "All PM2 tools are mostly written to suit Node.js applications, but sometimes you want to monitor other languages in your production environment."
---

# Overview

All PM2 tools are mostly written to suit Node.js applications, but sometimes you want to monitor other languages in your production environment.

That's why we build a agent for Golang, which is currently in **BETA**, that you can embed in your golang application, without installing anything else in your container.
Exactly the same as other monitoring providers, you just add a library, give it some secrets and everything is working !

**Disclamer**: This collector is in **BETA** which means there might still have some issues/bugs, so we strongly advise to test everything in a staging/development environment before pushing it into your production.

**Disclamer**: The golang runtime is of course different that Node.js so we didn't implement all the features availables for Node.js in the Golang agent, here are the list of the missing features:
  - Transaction tracing
  - Memory Profiling (you should use Memory snapshot for Golang)

## Requirements

We only tested our agent with Golang version above `1.10`, we might still be able to use with older versions but we will not support it.

## Installation

You need to import our library, called `pm2-io-apm-go`, that we use to add metrics into your code and enable other features.

```go
package main

import (
  "github.com/keymetrics/pm2-io-apm-go/services"
  "github.com/keymetrics/pm2-io-apm-go/structures"
)

func main() {
  // Create PM2 connector
  pm2 := pm2io.Pm2Io{
    Config: &structures.Config{
      PublicKey: "myPublic",    // define the public key given in the dashboard
      PrivateKey: "myPrivate",  // define the private key given in the dashboard
      Name: "Golang app",       // define an application name
    },
  }

  // Start the connection to PM2 Enterprise backend
  pm2.Start()
}
```

And that's it, your application will automatically connect to PM2 Enterprise when started.

## Best Practices

As said above, we are not heavy user of Golang ourselves so we don't have specific best practices to have in those cases, but we will happily add them if you have any.

## Configuration

You might want to tweaks the configuration of `pm2-io-apm-go` to add some metrics/actions or even broadcast the logs of your application.
Here are some examples of what you can do :

### Report an error
```go
pm2io.Notifier.Error(err)
```

If you want to panic, you can use `pm2io.Panic(err)` which will panic after sending the error to PM2 Enterprise.

### Send a log

```go
pm2io.Notifier.Log("something about my application")
```

You may want to integrate with your logger framework, it's actually pretty easy, here is a exemple with Logrus :

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

### Add a metrics

```go
// arguments are (in order): the name, the category and the unit
nbreq := structures.CreateMetric("Uptime", "process.uptime", "")
services.AddMetric(&nbreq)

// Goroutine who increment the value each second
go func() {
  ticker := time.NewTicker(1 * time.Second)
  for {
    <-ticker.C
    // change the value
    nbreq.Value++
  }
}()
```

### Add custom actions

An quick example would be to create an action, which when triggered, return the environment of the process:
```go
services.AddAction(&structures.Action{
  ActionName: "Get env",
  Callback: func() string {
    return strings.Join(os.Environ(), "\n")
  },
})
```

## Questions / Answers

* What are the performance cost of using this agent?

  Apart from the cpu/memory usage of the agent iself (sending data to our backend), there are no specific overhead (in javascript, you have overhead because of the way we implement the transaction tracing or some metrics)

* When will you support the transaction tracing in Golang?

  Yes. We started some research to implement that, the main goal would be to be able to trace both golang and Node.js together.

* Do you support routing the traffic from the agent thought a network gateway (or proxy)?

  Currently it's not the case but we plan to implement it. . Ask our sales team if you really need it.

## Common Issues

* I doesn't work when i launch my application !

  You might have some networking problem, first we of course advise to retry from a different environment to pinpoint where the problem come from.
  Next you should verify that you allow traffic to our servers, we only use the port 443 in OUTBOUND (which is simply a secure websocket connection).
