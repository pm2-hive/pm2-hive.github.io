---
layout: docs
title: Backend | On-Premise | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
permalink: "/docs/enterprise/backend/"
description: "To deploy keymetrics you first need to get access to one of the images that contains it, see the readme for this."
---


## PM2 Enterprise Core Documentation

To deploy keymetrics you first need to get access to one of the images that contains it, see the readme for this.

You might get access to a docker image, a AMI or something else depending on the installation method you choose.

In all the case, the procedure to setup it is always the same, you need to inject to it some environement variables, **they are all mandatory**: 

- `KM_DEDICATED_KEY`: the license key given on https://enterprise.keymetrics.io
- `KM_ELASTICSEARCH_URL`: the url to the elasticsearch server (always need to have the port in the URI), example: 
    - `{elasticsearch_ip}:9200` or `elasticsearch1:9200 elasticsearch2:9200` (it will split by space then give an array to the elasticsearch client) [exact format defined in **hosts** property](https://www.elastic.co/guide/docs/elasticsearch/client/javascript-api/current/configuration.html#config-options)
- `KM_MONGO_URL`: the URI used to connect to mongodb, example:
    - `mongodb://{mongodb_ip}/keymetrics` [docs](https://docs.mongodb.com/manual/reference/connection-string/)
- `KM_REDIS_URL`: the URI used to connect to redis, example: 
    - `redis://{redis_ip}:6379` [exact format defined in **url** property](https://github.com/NodeRedis/node_redis#options-object-properties)
- `KM_SITE_URL`: the hostname that will be used to connect to the PM2 Plus instance, it need to be known for the frontend and PM2 to work correctly. Example: 
    - `http://backend.production.keymetrics`, can be a IP however it **absolutly need** to `http://` at the begining
- `SMTP_USER`: the username used to send email notifications via 3rd party email provider
- `SMTP_PASSWORD`: the password used to send email notifications via 3rd party email provider
- `SMTP_SENDER`:: the sender used to send email notifications via 3rd party email provider
- `SMTP_HOST`: the host used to send email notifications via 3rd party email provider


If you are injecting those variables at runtime (for example in EC2), you will need to reload PM2 so he pickup the variables: 
```bash
pm2 flush                         # remove olds logs
pm2 restart all --update-env      # restart all processes with new env
pm2 reset all                     # reset stats of processes
pm2 save                          # save the current state so all applications can be restarted when the server is restarted
```

You can find [an example](https://github.com/keymetrics/on-premise/blob/master/terraform/keymetrics_aio_aws/user_data_backend.tpl) with the user_data script already configured for EC2


## Databases

You'll need three different databases for the backend to run: 

- **Elasticsearch v5.5**: We use it to store the majority of data that PM2 push to the backend, we have a configuration where we create 1 index per day, no replica, if you need to configure it contact us
- **MongoDB**: We use it to store users/buckets, no configuration is recommended on our end (Max version supported is **3.4**).
- **Redis**: Tested with Redis 3 and 4, no configuration needed too

You are most likely to have problem with Elasticsearch which is the most heavy used datastores, you might wamt to monitor your cluster (depending on how much you push data into it).

### What is a provider?

A 'provider' is simply the place from where you are retrieving the keymetrics software. For example if you are deploying our AMIs inside AWS, you'll retrieve them from AWS. You can also deploy them with docker and in this case you will get them from the docker hub.

### What do I need to give to get access to the keymetrics software from a provider?

- AWS: you will need to provide your Amazon Account ID (so you can access the AMIs) and your Amazon Region
- docker: you will need to provide the username of the hub.docker.com account that you'll use to pull the docker images