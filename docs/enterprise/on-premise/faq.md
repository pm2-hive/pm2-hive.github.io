---
layout: docs
title: FAQ | On-Premise | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
permalink: "/docs/enterprise/on-premise/faq/"
description: "You need to verify that the KMSITEURL you configured is the endpoint you use to connect to the frontend. If you modify it, you need to delete the mongodb…"
---

# FAQ

## The register hang or don't redirect me to the application

You need to verify that the `KM_SITE_URL` you configured is the endpoint you use to connect to the frontend. If you modify it, you need to delete the mongodb database afterwards because all the endpoints configurations are stored inside it.

## What are the services that are used?

- http API on port 3010 (access the data, configure bucket etc)
- auth service on port 3100 (register/login etc)
- websocket service on port 4010 (so the frontend can receive update in realtime)
- interaction on port 3900 (listen for PM2 data)
- reverse interaction on port 43554 (listen for a specific connection from PM2, used to send command to it like restart etc)

## What is exposed by default?

Depending on how you deployed the keymetrics enterprise product, there are different answers:

- **Docker**
  - nginx is used to load balance depending on the path, to either the frontend or backend services
  - km-front expose the frontend on the port 80
  - km-api expose all the backend services
- **AWS**
  - Everything is running inside the km-core AMI
- **GCP**
  - Same as AWS, everything is running inside the km-core API


## I get a error about `Unknown modifier: $pushAll`, what did i miss?

We only support mongodb up to version 3.4 for now, you need to downgrade.

## How do i configure my pm2 to connect to it?

When you first register, you should have a bucket created automatically, then you will have connection data in the middle in this format:

```bash
> KEYMETRICS_NODE=<your KM_SITE_URL> pm2 link <identifier_one> <identifier_two>
```

You have two way to link your pm2:

- Connect to the instance where pm2 is and run the command.
- If you have container, just add these environements variables:
  - `KEYMETRICS_PUBLIC`: replace with `identifier_two>`
  - `KEYMETRICS_SECRET`: replace with `<identifier_one>`
  - `KEYMETRICS_NODE`: replace with `<your KM_SITE_URL>`
  - `INSTANCE_NAME`: (optional) replace it if you want your server in keymetrics to have a fixed name

Then it should all the instances in the keymetrics frontend in realtime.

## How should i run pm2 inside my containers to connect to it?

We advise you to use `pm2-runtime`, it should be a dropin replacement for node inside your images:

```docker
FROM node:8-alpine

RUN npm install -g pm2 2> /dev/null
[ ... ]
CMD [ "pm2-runtime", "app.js" ] # note that you can use an ecosystem here too
```

You can find the flags that you can use [here](https://github.com/Unitech/pm2/blob/master/lib/binaries/Runtime4Docker.js#L17)
