---
layout: docs
title: Deployment on Kubernetes with Helm | On-Premise | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
permalink: "/docs/enterprise/helm/"
description: "Documentation about how to deploy the keymetrics on-premise version on Kubernetes using Helm"
---

## Deployment on Kubernetes with Helm

Documentation about how to deploy the keymetrics on-premise version on Kubernetes using Helm

### Requirements

In the following examples, we assume that you already have a fully working Kubernetes cluster with a working installation of Helm.
To install and learn how to use Helm, you can follow the [Helm Quick Start Guide](https://docs.helm.sh/using_helm/#quickstart).

### Setup steps

#### 1. Clone this repository

The first step is to locally clone this git repository:

`git clone https://github.com/keymetrics/on-premise.git km-on-premise`

`cd km-on-premise/helm/`

#### 2. Add the "incubator" repository needed for ElasticSearch chart

Because the ElasticSearch chart isn't a stable chart yet, we need to add its repository to the list of allowed ones.

`helm repo index incubator --url http://storage.googleapis.com/kubernetes-charts-incubator`

#### 3. Install the chart

The automatic installation is done using:

```
helm install keymetrics-aio --set km_license=<YOUR_LICENSE> \
                            --set km_public_dns=<YOUR_SUBDOMAIN> \
                            --set km_smtp_host=<SMTP_ADDRESS> \
                            --set km_smtp_user=<SMTP_USERNAME> \
                            --set km_smtp_pass=<SMTP_PASSWORD> \
                            --set km_smtp_sender=<SMTP_SENDER_ADDRESS>
```

This will install PM2 Plus and its requirements: 
 - [Redis](https://github.com/kubernetes/charts/tree/master/stable/redis
)
 - [ElasticSearch](https://github.com/kubernetes/charts/tree/master/incubator/elasticsearch)
 - [MongoDB](https://github.com/kubernetes/charts/tree/master/stable/mongodb)

These settings are required:

- `km_license`: You PM2 Plus license key.
- `km_public_dns`: The public dns record that will be pointing to your PM2 Plus instance (needed for requirections).
- `km_smtp_host`: SMTP Server address.
- `km_smtp_user`: SMTP Server username.
- `km_smtp_pass`: SMTP Server password.
- `km_smtp_sender`: Emails used in "From" field of emails.

Once the installation is done, Helm is going to print a summary of the resources that it created. Make sure to follow the `NOTES` in order to set you DNS correctly and the connect to the web interface.