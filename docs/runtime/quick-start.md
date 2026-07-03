---
layout: none
title: Quick Start | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/quick-start/"
sitemap: false
redirect_to: "/docs/usage/quick-start/"
description: "In seconds, this Quick Start tutorial will show you how to set up to production a Node.js application with PM2."
---

# Quick Start

In seconds, this Quick Start tutorial will show you how to set up to production a Node.js application with PM2.

## Installation

With npm:
```bash
npm install pm2 -g
```

With yarn:
```bash
yarn global add pm2
```

With debian, use the install script:

```bash
apt update && apt install sudo curl && curl -sL https://raw.githubusercontent.com/Unitech/pm2/master/packager/setup.deb.sh | sudo -E bash -
```

With docker, follow this [tutorial]({{ site.baseurl }}{% link docs/runtime/integration/docker.md %}).

### CLI autocompletion

Complete your installation with the CLI autocompletion:

```bash
pm2 completion install
```

## Manage multiple processes

PM2 keeps a list of your processes to be able to start, restart and stop them easily.

All your apps are started in the background, letting you access to the command line. Use the PM2 CLI to interact with your apps.

### Process list

Add processes to your process list with the start and delete commands.

```bash
# start and add a process to your list
pm2 start app.js

# show your list
pm2 ls

# stop and delete a process from the list
pm2 delete app
```

 Default process name is the filename without `.js` (eg: `app` for `app.js`). Use `--name`or `-n` to change.
{: .tip}

### Routine

Once in your process list, use the process name to interact with your application.

```bash
# stop the process (kill the process but keep it in the process list)
pm2 stop app

# start the process
pm2 start app

# both stop and start
pm2 restart app
```

You can then setup a [startup script]({{ site.baseurl }}{% link docs/runtime/guide/startup-hook.md %}), to automatically start your process list across machine restarts.

## Access your logs

Access your logs in **realtime** with `pm2 logs app`.

Consult your logs **history** files in the `~/.pm2/logs` folder.

## Clusterize

The cluster mode scales your app accross all CPUs available, without any code modifications.

 Before using the load balancer, make sure your application is stateless, meaning that no local data is stored in the process (sessions/websocket connections, session-memory and related).
{: .tip}

To start in cluster mode, pass the -i option followed by the number of clusters that you want:

```bash
pm2 start app.js -i 4
```

or, to automatically detect number of CPUs available:

```bash
pm2 start app.js -i max
```

Use reload instead of restart for 0-seconds downtime reloads:

```bash
pm2 reload app
```

## Next Steps

[Ecosystem File]({{ site.baseurl }}{% link docs/runtime/guide/ecosystem-file.md %})
{: .btn-stylized}
