---
layout: docs
title: Startup Script
description: Auto restart PM2 and processes at server reboot
permalink: /docs/usage/startup/
---

PM2 can generate startup scripts and configure them in order to keep your process list intact across expected or unexpected machine restarts.

*Make sure you upgrade to PM2 > 2.2.x*


## Init systems supported

- **systemd**: Ubuntu >= 16, CentOS >= 7, Arch, Debian >= 7
- **upstart**: Ubuntu <= 14
- **launchd**: Darwin, MacOSx
- **openrc**: Gentoo Linux, Arch Linux
- **rcd**: FreeBSD
- **systemv**: Centos 6, Amazon Linux

## Generating a startup script

To get the automatically-configured startup script for your machine you need to type this command:

```bash
# Detect available init system, generate configuration and enable startup system
pm2 startup
```

You can specify the platform you use by yourself if you want to (where platform can be either one of the cited above): 
```
pm2 startup [ubuntu | ubuntu14 | ubuntu12 | centos | centos6 | arch | oracle | amazon | macos | darwin | freesd | systemd | systemv | upstart | launchd | rcd | openrc]
```

The output of this command can be a recommendation of the line to copy/paste with all environment variables and options configured for you.

Example:
```bash
[PM2] You have to run this command as root. Execute the following command:
      sudo su -c "env PATH=$PATH:/home/unitech/.nvm/versions/node/v4.3/bin pm2 startup <distribution> -u <user> --hp <home-path>
```

You simply have to copy/paste the line PM2 give you and the startup script will be configured for your OS.

**NOTE** : When updating nodejs, the `pm2` binary path might change (it will necessarily change if you are using nvm). Therefore, we would advise you to run the `startup` command after any update.

## Saving current process list

Once you started all the applications you want to manage, you can save the list across expected/unexpected server restart by typing this command:

```bash
pm2 save
```

It will save the process list with the corresponding environments into the dump file `$PM2_HOME/.pm2/dump.pm2`.

### Manually resurrect processes

This brings back previously saved processes (via pm2 save):

```bash
pm2 resurrect
```

## Disabling startup system

```bash
pm2 unstartup
```

The previous line code let PM2 detect your platform. Alternatively you can use another specified init system youself using:

```bash
pm2 unstartup [ubuntu | ubuntu14 | ubuntu12 | centos | centos6 | arch | oracle | amazon | macos | darwin | freesd | systemd | systemv | upstart | launchd | rcd | openrc] 
```

## User permissions

Let's say you want the startup script to be executed under another user.

Just use the `-u <username>` option and the `--hp <user_home>`:

```bash
pm2 startup ubuntu -u www --hp /home/ubuntu
```

## Update startup script

To update the startup script (in case you changed the Node.js version via NVM for example) run the following commands:

```bash
pm2 unstartup
pm2 startup
```

## Windows consideration

There are some external libraries to generate a Windows compatible startup script, please checkout [pm2-windows-service](https://www.npmjs.com/package/pm2-windows-service) or [pm2-windows-startup](https://www.npmjs.com/package/pm2-windows-startup).


