---
layout: docs
title: Deployment on Google Cloud Plateform | On-Premise | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
permalink: "/docs/enterprise/gcp/"
description: "Documentation about how to deploy the keymetrics on-premise version on GCP"
---

## Deployment on Google Cloud Plateform

Documentation about how to deploy the keymetrics on-premise version on GCP

### Requirements

In the following examples, we assume that you already have a fully working Terraform project. You can follow the [`Getting Started`](https://www.terraform.io/intro/getting-started/install.html) guide on the official website [here](https://www.terraform.io/intro/getting-started/install.html).

## Setup steps

### 1. Adding the module to your terraform project

There's two options available in order to use our terraform module in your project. 
- Link the module's git repository address in your terraform module definition
- Clone the repository and set the source variable of your module definiton to the correct path on your drive.

##### Without cloning the repository

When defining your module definition, use the following `source` value:
- `git@github.com:keymetrics/on-premise.git//terraform/keymetrics_aio_gcp`

Example: 

```
module "keymetrics" {
  source  = "git@github.com:keymetrics/on-premise.git//terraform/keymetrics_aio_gcp"
  ...
}
```

##### By cloning the repository

Start by cloning the repository in your project directory using the git command:
- `git clone git@github.com:keymetrics/on-premise.git keymetrics-on-premise`

Define the `kemetrics` module using the relative path.
Example:

```
module "keymetrics" {
  source  = "keymetrics-on-premise/terraform/keymetrics_aio_gcp"
  ...
}
```

### 2. Set the module variables

The variables are set inside the module definition and allow you to chose how the module is going to setup your infrastructe and which external services are going to be used.

Example of module with variables:

```
module "example_keymetrics_setup" {
  source  = "keymetrics_aio_gcp"

  keymetrics_key = "...

  environment = "example"

  smtp_host = "smtp.mailgun.org"
  smtp_username = "postmaster@example.com"
  smtp_password = "XXX"
  smtp_sender = "keymetrics@example.com"
  
  public_host_address = "our-keymetrics-public-subdomain.example.com"
  
  network_name = "default"
}
```

The following variables are available:
- **keymetrics_key**: [*Required*] PM2 Plus License Key.
- **environment**: [*Required*] The name of your environment (ex: `qa`, `prod`, `prod-1`, etc.).
- **smtp_username**: [*Required*] Username used to connect to the SMTP server.
- **smtp_password**: [*Required*] Password used to connect to the SMTP server.
- **smtp_host**: [*Required*] Hostname of the SMTP server.
- **smtp_sender**: [*Required*] Email address used to send emails.
- **network_name**: [*Required*] Name of the GCP Network to use.
- **public_host_address**: Public domain pointing to PM2 Plus HTTP Server (if empty, the public IP will be used), need to be formatted with http or https, not just the host.
- **mongodb_instance_type**: GCP Instance type to use for MongoDB Instance.
- **elasticsearch_instance_type**: GCP Instance type to use for ElasticSearch Instance.
- **redis_instance_type**: GCP Instance type to use for Redis Instance.
- **backend_instance_type**: GCP Instance type to use for Backend Instance.


For more informations, please check the [`variables.tf`](https://github.com/keymetrics/on-premise/blob/master/terraform/keymetrics_aio_gcp/variables.tf) file in the module

### 3. `Plan` and `Apply` your changes using the `terraform` command

Run `terraform plan -target=module.example_keymetrics_setup -out tfout` and make sure no error shows up in the logs.

You can then run `terraform apply tfout` in order to make terraform created the infrastructure on your GCP Project.

## Extra configuration depending of your own existing infrastructure

### Add a sub-domain pointing to PM2 Plus instance

By default, PM2 Plus instance is using an External IP addresses to be publicly available to its users. If you want to use it with a domain, you __first__ need to set `public_host_address` variable to the domain to use and then create a `A` record pointing to its public External IP addresses.

*__Warning: Once deployed with either the public IP or a domain, it's not possible to change it without fully dropping the mongodb database.__*

### Allow your apps to connect to PM2 Plus APIs

By default, PM2 Plus instance only accept connection on port `80/tcp` from `0.0.0.0/32`. In order to let your applications talk with the PM2 Plus backend, you need to allow their security groups to connected to PM2 Plus instance on port `3900/tcp`, `3010/tcp`, `4010/tcp` and `43554/tcp`.

To do so, you can use the module output values as target or source of new [Firewall rules](https://www.terraform.io/docs/providers/google/r/compute_firewall.html) :
- `redis_fw_tag_name`
- `mongodb_fw_tag_name`
- `elasticsearch_fw_tag_name`
- `backend_fw_tag_name`

Example: 
```
module "example_keymetrics_setup" {
  source  = "keymetrics_aio_gcp"
  ...
}

resource "google_compute_firewall" "allow_all_connections_to_km" {
  name    = "allow_all_connections_to_km"
  network = "default"

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["80", "3900", "3010", "4010", "43554"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags = ["${module.example_keymetrics_setup.backend_fw_tag_name}"]
}

...
```
