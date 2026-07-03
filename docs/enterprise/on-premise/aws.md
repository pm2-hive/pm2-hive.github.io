---
layout: docs
title: Deployment on Amazon Web Service | On-Premise | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
permalink: "/docs/enterprise/aws/"
description: "Documentation about how to deploy the PM2 Enterprise on-premise version on AWS"
---

# Deployment on Amazon Web Service

Documentation about how to deploy the PM2 Enterprise on-premise version on AWS

## Before Starting

## Requirements

In the following examples, we assume that you already have a fully working Terraform project. You can follow the [`Getting Started`](https://www.terraform.io/intro/getting-started/install.html) guide.

## Reference Architecture

By [default](https://github.com/keymetrics/on-premise/blob/master/terraform/keymetrics_aio_aws/variables.tf) the Terraform script will provision the following instances type:

- c4.xlarge for the PM2 Plus Backend
- r3.xlarge for the Elasticsearch Database
- t2.micro for the Redis Database
- t2.micro for the MongoDB Database

These instances type can be changed via the [custom terraform variable file](https://github.com/keymetrics/on-premise/blob/master/docs/AWS.md#2-set-the-module-variables)

## Setup steps

### 1. Adding the module to your terraform project

There's two options available in order to use our terraform module in your project.
- Link the module's git repository address in your terraform module definition
- Clone the repository and set the source variable of your module definiton to the correct path on your drive.

#### Without cloning the repository

When defining your module definition, use the following `source` value:
- `git@github.com:keymetrics/on-premise.git/terraform/keymetrics_aio_aws`

Example:

```
module "keymetrics" {
  source  = "git@github.com:keymetrics/on-premise.git/terraform/keymetrics_aio_aws"
  ...
}
```

#### By cloning the repository

Start by cloning the repository in your project directory using the git command:
- `git clone git@github.com:keymetrics/on-premise.git keymetrics-on-premise`

Define the `kemetrics` module using the relative path.
Example:

```
module "keymetrics" {
  source  = "keymetrics-on-premise/terraform/keymetrics_aio_aws"
  ...
}
```

### 2. Set the module variables

The variables are set inside the module definition and allow you to chose how the module is going to setup your infrastructe and which external services are going to be used.

Example of module with variables:

```
module "example_keymetrics_setup" {
  source  = "keymetrics_aio_aws"

  key_name = "admin"
  vpc_id = "vpc-xxxxxxxx"
  keymetrics_key = "...

  environment = "example"

  smtp_host = "smtp.mailgun.org"
  smtp_username = "postmaster@example.com"
  smtp_password = "XXX"
  smtp_sender = "keymetrics@example.com"

  public_host_address = "our-keymetrics-public-subdomain.example.com"
}
```

The following variables are available:
- **key_name**: [*Required*] The name of the SSH Public key to use.
- **vpc_id**: [*Required*] The id of the VPC hosting the EC2 Instances.
- **keymetrics_key**: [*Required*] PM2 Plus License Key.
- **environment**: [*Required*] The name of your environment (ex: `qa`, `prod`, `prod-1`, etc.).
- **smtp_username**: [*Required*] Username used to connect to the SMTP server.
- **smtp_password**: [*Required*] Password used to connect to the SMTP server.
- **smtp_host**: [*Required*] Hostname of the SMTP server.
- **smtp_sender**: [*Required*] Email address used to send emails.
- **internal_tld**: TLD used for internal DNS zone (ex: `lan`, `local`, `km`, etc)
- **public_host_address**: Public domain pointing to PM2 Plus HTTP Server (if empty, the public IP will be used).
- **mongodb_instance_type**: EC2 Instance type to use for MongoDB Instance.
- **elasticsearch_instance_type**: EC2 Instance type to use for ElasticSearch Instance.
- **redis_instance_type**: EC2 Instance type to use for Redis Instance.
- **backend_instance_type**: EC2 Instance type to use for Backend Instance.
- **make_backend_web_public**: If set to false, prevent the creation of a security group rule opening the port 80/tcp of the backend instance.

For more informations, please check the [`variables.tf`](https://github.com/keymetrics/on-premise/blob/master/terraform/keymetrics_aio_aws/variables.tf) file in the module

### 3. `Plan` and `Apply` your changes using the `terraform` command

Run `terraform plan -target=module.example_keymetrics_setup -out tfout` and make sure no error shows up in the logs.

You can then run `terraform apply tfout` in order to make terraform created the infrastructure on your AWS Account.

## Extra configuration depending of your own existing infrastructure

### Add a sub-domain pointing to PM2 Plus instance

By default, PM2 Plus instance is using an ElasticIP to be publicly available to its users. If you want to use it with a domain, you __first__ need to set `public_host_address` variable to the domain to use and then create a `A` record pointing to its public ElasticIP.

*__Warning: Once deployed with either the public IP or a domain, it's not possible to change it without fully dropping the mongodb database.__*

### Allow your apps to connect to PM2 Plus APIs

By default, PM2 Plus instance only accept connection on port `80/tcp` from `0.0.0.0/32`. In order to let your applications talk with the PM2 Plus backend, you need to allow their security groups to connected to PM2 Plus instance on port `3900/tcp`, `3010/tcp`, `4010/tcp` and `43554/tcp`.

To do so, you can use the module output value named `backend_securitygroup_name` as `security_group_id` of a Terraform [aws_security_group_rule](https://www.terraform.io/docs/providers/aws/r/security_group_rule.html)

Example:
```
module "example_keymetrics_setup" {
  source  = "keymetrics_aio_aws"
  ...
}

# Allow connection from
resource "aws_security_group_rule" "allow_port_3900" {
  type                     = "ingress"
  from_port                = 3900
  to_port                  = 3900
  protocol                 = "tcp"

  # Your application security group
  source_security_group_id = "sg-123456"

  # PM2 Plus Backend Security Group
  security_group_id = "${module.example_keymetrics_setup.backend_securitygroup_name}"
}

...
```
