---
layout: none
title: Docker | Integration | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/integration/docker/"
description: "Production ready Node.js Docker image including PM2."
sitemap: false
redirect_to: "/docs/usage/docker-pm2-nodejs/"
---

# Using PM2 with Docker

Production ready Node.js Docker image including PM2.

The goal of pm2-runtime is to wrap your applications into a proper Node.js production environment. It solves major issues when running Node.js applications inside a container like:

- Second Process Fallback for High Application Reliability
- Process Flow Control
- Automatic Application Monitoring to keep it always sane and high performing
- Automatic Source Map Discovery and Resolving Support

Further than that, using PM2 as a layer between the container and the application brings PM2 powerful features like ecosystem file, custom log system and other features of pm2.

## Prepare your app

### Tags available

**Image Name** | **Operating system** | **Dockerfile**
---|---|---
keymetrics/pm2:`latest-alpine`|[Alpine](https://www.alpinelinux.org/about/)|[latest-alpine](https://github.com/keymetrics/docker-pm2/blob/master/tags/latest/alpine/Dockerfile)
keymetrics/pm2:`8-alpine`|[Alpine](https://www.alpinelinux.org/about/)|[8-alpine](https://github.com/keymetrics/docker-pm2/blob/master/tags/8/alpine/Dockerfile)
keymetrics/pm2:`6-alpine`|[Alpine](https://www.alpinelinux.org/about/)|[6-alpine](https://github.com/keymetrics/docker-pm2/blob/master/tags/6/alpine/Dockerfile)
keymetrics/pm2:`4-alpine`|[Alpine](https://www.alpinelinux.org/about/)|[4-alpine](https://github.com/keymetrics/docker-pm2/blob/master/tags/4/alpine/Dockerfile)
**Image Name** | **Operating system** | **Dockerfile**
keymetrics/pm2:`latest-stretch`|[Debian Stretch](https://wiki.debian.org/DebianStretch)|[latest-stretch](https://github.com/keymetrics/docker-pm2/blob/master/tags/latest/stretch/Dockerfile)
keymetrics/pm2:`8-stretch`|[Debian Stretch](https://wiki.debian.org/DebianStretch)|[8-stretch](https://github.com/keymetrics/docker-pm2/blob/master/tags/8/stretch/Dockerfile)
keymetrics/pm2:`6-stretch`|[Debian Stretch](https://wiki.debian.org/DebianStretch)|[6-stretch](https://github.com/keymetrics/docker-pm2/blob/master/tags/6/stretch/Dockerfile)
keymetrics/pm2:`4-stretch`|[Debian Stretch](https://wiki.debian.org/DebianStretch)|[4-stretch](https://github.com/keymetrics/docker-pm2/blob/master/tags/4/stretch/Dockerfile)
**Image Name** | **Operating system** | **Dockerfile**
keymetrics/pm2:`latest-jessie`|[Debian Jessie](https://wiki.debian.org/DebianJessie)|[latest-jessie](https://github.com/keymetrics/docker-pm2/blob/master/tags/latest/jessie/Dockerfile)
keymetrics/pm2:`8-jessie`|[Debian Jessie](https://wiki.debian.org/DebianJessie)|[8-jessie](https://github.com/keymetrics/docker-pm2/blob/master/tags/8/jessie/Dockerfile)
keymetrics/pm2:`6-jessie`|[Debian Jessie](https://wiki.debian.org/DebianJessie)|[6-jessie](https://github.com/keymetrics/docker-pm2/blob/master/tags/6/jessie/Dockerfile)
keymetrics/pm2:`4-jessie`|[Debian Jessie](https://wiki.debian.org/DebianJessie)|[4-jessie](https://github.com/keymetrics/docker-pm2/blob/master/tags/4/jessie/Dockerfile)
**Image Name** | **Operating system** | **Dockerfile**
keymetrics/pm2:`latest-slim`|[Debian Jessie](https://wiki.debian.org/DebianJessie) (minimal packages)|[latest-slim](https://github.com/keymetrics/docker-pm2/blob/master/tags/latest/slim/Dockerfile)
keymetrics/pm2:`8-slim`|[Debian Jessie](https://wiki.debian.org/DebianJessie) (minimal packages)|[8-slim](https://github.com/keymetrics/docker-pm2/blob/master/tags/8/slim/Dockerfile)
keymetrics/pm2:`6-slim`|[Debian Jessie](https://wiki.debian.org/DebianJessie) (minimal packages)|[6-slim](https://github.com/keymetrics/docker-pm2/blob/master/tags/6/slim/Dockerfile)
keymetrics/pm2:`4-slim`|[Debian Jessie](https://wiki.debian.org/DebianJessie) (minimal packages)|[4-slim](https://github.com/keymetrics/docker-pm2/blob/master/tags/4/slim/Dockerfile)
**Image Name** | **Operating system** | **Dockerfile**
keymetrics/pm2:`latest-wheezy`|[Debian Wheezy](https://wiki.debian.org/DebianWheezy)|[latest-wheezy](https://github.com/keymetrics/docker-pm2/blob/master/tags/latest/wheezy/Dockerfile)
keymetrics/pm2:`8-wheezy`|[Debian Wheezy](https://wiki.debian.org/DebianWheezy)|[8-wheezy](https://github.com/keymetrics/docker-pm2/blob/master/tags/8/wheezy/Dockerfile)
keymetrics/pm2:`6-wheezy`|[Debian Wheezy](https://wiki.debian.org/DebianWheezy)|[6-wheezy](https://github.com/keymetrics/docker-pm2/blob/master/tags/6/wheezy/Dockerfile)
keymetrics/pm2:`4-wheezy`|[Debian Wheezy](https://wiki.debian.org/DebianWheezy)|[4-wheezy](https://github.com/keymetrics/docker-pm2/blob/master/tags/4/wheezy/Dockerfile)

You can find more information about the image variants [here](https://github.com/Node.js/docker-node#image-variants).

> The build process of these images is automatically triggered each time [Node.js's Docker images](https://hub.docker.com/r/library/node/tags/) are built.  
The build process of these images is automatically triggered each time [Docker PM2's GitHub repo](https://github.com/keymetrics/docker-pm2) master branch is pushed.  
The build process of these images is automatically triggered each time [PM2's GitHub repo](https://github.com/Unitech/pm2) master branch is pushed.  

### Usage

Let's assume the following folder structure for your project.

```
`-- your-app-name/
    |-- src/
        `-- app.js
    |-- package.json
    |-- ecosystem.config.js    (we will create this in the following steps)
    `-- Dockerfile             (we will create this in the following steps)
```

### Set your ecosystem file

Generate an `ecosystem.config.js` template with:

```bash
pm2 init
```

Modify the ecosystem file to match your needs:

```javascript
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```

 Learn more about ecosystem file [here]({{ site.baseurl }}{% link docs/runtime/guide/ecosystem-file.md %}).
{: .tip}

### Set a Dockerfile

Create a new file called `Dockerfile` with the following content:

```dockerfile
FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY src src/
COPY package.json .
COPY ecosystem.config.js .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

# Expose the listening port of your app
EXPOSE 8000

# Show current folder structure in logs
RUN ls -al -R

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
```

### Build your image

From your Node.js app project folder launch those commands:

```bash
docker build -t your-app-name .
```

### Run your image

```bash
docker run -p 80:8000 your-app-name
```

 `-p 80:8000` binds the port 8000 of your app to the port 80 of the localhost
{: .tip}

### pm2 commands

pm2 commands can still be used inside a container with the `docker exec` command:

```bash
# Monitoring CPU/Usage of each process
docker exec -it <container-id> pm2 monit
# Listing managed processes
docker exec -it <container-id> pm2 list
# Get more information about a process
docker exec -it <container-id> pm2 show
# 0sec downtime reload all applications
docker exec -it <container-id> pm2 reload all
```

### Expose health endpoint

```Dockerfile
CMD ["pm2-runtime", "ecosystem.config.js", "--web"]
```

The `--web [port]` option allows to expose all vital signs (docker instance + application) via a JSON API.

 After installing pm2 in your shell, run `pm2-runtime -h` to get all options available
{: .tip}

### You are ready

That's all! Your container is ready to be deployed.

## Next Steps

Complete your configuration with the [Ecosystem File]({{ site.baseurl }}{% link docs/runtime/guide/ecosystem-file.md %}).

Monitor your app on a web dashboard, with [PM2 Plus]({{ site.baseurl }}{% link docs/plus/integration/docker.md %}).
