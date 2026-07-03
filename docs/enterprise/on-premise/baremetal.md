---
layout: docs
title: Deployment on Baremetal Servers | On-Premise | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
permalink: "/docs/enterprise/on-premise/baremetal/"
description: "Note that this tutorial is only made if you decided to deploy PM2 Enterprise On-Premise. If you use the Cloud based one you can just use it straight from…"
---

# Deployment on Baremetal Servers

Note that this tutorial is only made if you decided to deploy PM2 Enterprise On-Premise. If you use the Cloud based one you can just use it straight from https://app.pm2.io

## Requirements

Install Docker & Docker compose (minimum required version is 1.19.0) in your host machine:

```bash
$ sudo wget -qO- https://get.docker.com/ | sh
$ sudo curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
```

Then make sure you have logged-in on the hub to be able to pull the private images:

```bash
$ docker login
```

## Steps to Install

1. Get the docker-compose.yml file corresponding to your version:

```bash
$ wget https://raw.githubusercontent.com/keymetrics/on-premise/master/docker/docker-compose.yml
```

Once you have configured the `docker-compose.yml` file start it:

```bash
$ docker-compose up -d
```

Now connect to:

```bash
$ google-chrome http://server-ip/wizard
```

Set your License Key and configuration and youre done

## Update Procedure

Just run docker-compose up again and it will pull the latest backend image:

```bash
$ docker-compose pull km-api km-front
$ docker-compose restart km-api km-front
```

A downtime of around 30 seconds maximum will happen.

## FAQ

- *Backend cannot connect to Elasticsearch*: make sure you have a clean docker installation and there are no conflicting networks (docker networks)

- *Everything is started as expected but I cannot access the interface / I cannot link PM2*: Make sure you have set the right `KM_SITE_URL` because without a proper value PM2 agent will not be able to connect to the Backend

- *Do I loose the ES/Mongo data on restart?* No, by default, there are local volumes bound to the

- *I want to use specific version of mongodb/redis/elasticsearch, is this possible?* No, we currently support mongodb up to 3.4, redis 2/3/4 and elasticsearch 5.5.
