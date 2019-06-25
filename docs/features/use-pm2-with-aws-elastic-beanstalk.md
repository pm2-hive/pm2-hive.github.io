---
layout: docs
title: PM2 in ElasticBeanstalk
description: Use PM2 in a AWS Elastic Beanstalk
permalink: /docs/tutorials/use-pm2-with-aws-elastic-beanstalk/
---

## Using PM2/Keymetrics in AWS Elastic Beanstalk

This page will guide you step by step through the PM2/Keymetrics integration in a Beanstalk environment. We recommend using the [eb cli](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html) for easier deployment.

We created a repository for easy testing: [pm2-ebs-demo](https://github.com/keymetrics/pm2-ebs-demo).

## Setup Beanstalk

Go to your application directory and use `eb init` to setup Beanstalk.

We need to make sure Beanstalk will try to launch your application by using `npm start`. To do so, add a configuration file that sets the Node Command to "npm start" int the .ebextension folder:

./.ebextensions/nodecommand.config

```
option_settings:
  - namespace: aws:elasticbeanstalk:container:nodejs
    option_name: NodeCommand
    value: "npm start"
```

## Integrate PM2

The easiest and less invasive way to monitor your application using PM2 is by requiring it as a npm module. We will simply change the `package.json` structure to let pm2 start the application.
Just add pm2 to your app dependencies: 
`npm install pm2 --save`

Then we will need to change the startup scripts. We call PM2 from the node_modules folder:

```json
"scripts": {
  "start": "./node_modules/pm2/bin/pm2-runtime app.js",
  "poststart":  "node ./node_modules/pm2/bin/pm2 logs"
}
```

 * Customize the `"start"` script to fit your needs.
 * The `"poststart"` script is optionnal, but allows simple log checking directly on the AWS dashboard.

That's all! Run `eb deploy` to get a PM2 instance on your ElasticBeanstalk instances with minimal overhead.

## Integrate PM2 with Keymetrics
We need to pass two variables to PM2 from the environment to link it with Keymetrics: `KEYMETRICS_PUBLIC` and `KEYMETRICS_SECRET`.

* When creating the environment from the cli:
`eb create --envvars KEYMETRICS_PUBLIC=XXXXX,KEYMETRICS_SECRET=XXXXXX
`
* You can also add those variables in the AWS dashboard in the Software Configuration options.

Then follow-up the pm2 integration procedure, and pm2 will auto-link the application at start.
