---
layout: docs
title: Startup Script
description: Auto restart PM2 and processes at server reboot
permalink: /docs/usage/startup/
---

PM2 can generate startup scripts and configure them in order to keep your process list intact across expected or unexpected machine restarts.

*Make sure you upgrade to PM2 > 2.2.x*

## Init systems supported

- **SystemD**: Ubuntu >= 16, CentOS, Arch, Debian >= 7
- **Upstart**: Ubuntu <= 14
- **Launchd**: Darwin, MacOSx
- **rc.d**: FreeBSD

## Command

To get the automatically-configured startup script for your machine you need to type this command:

```bash
# Detect available init system, generate configuration and enable startup system
$ pm2 startup

# Or Render startup-script for a specific init system
#   upstart|systemd|launchd|rcd|ubuntu|centos|redhat|gentoo|systemd|darwin|amazon
$ pm2 startup [platform]
```

The output of this command may be a recommendation of the line to copy/paste with all environment variables and options configured for you.

E.G:

```bash
[PM2] You have to run this command as root. Execute the following command:
      sudo su -c "env PATH=$PATH:/home/unitech/.nvm/versions/node/v4.3/bin pm2 startup <distribution> -u <user> --hp <home-path>
```

Just copy/paste this line and the startup script will be configured for your OS.

### Saving current processes

Once you started all the applications you want to manage, to keep this list across expected/unexpected server restart, just type the command:

```bash
$ pm2 save
```

Doing this will save the process list with their current environment into the dump file `$PM2_HOME/.pm2/dump.pm2`

## Disabling startup system

```bash
$ pm2 unstartup
```

Or if you specified yourself the init system:

```bash
$ pm2 unstartup [platform] 
```

### Windows consideration

There are some external libraries to generate a Windows compatible startup script, please checkout [pm2-windows-service](https://www.npmjs.com/package/pm2-windows-service) or [pm2-windows-startup](https://www.npmjs.com/package/pm2-windows-startup).

## User permissions

Let's say you want the startup script to be executed under another user.

Just use the `-u <username>` option and the `--hp <user_home>`:

```bash
$ pm2 startup ubuntu -u www --hp /home/ubuntu
```

### Manually resurect processes

Bring back previously saved processes (via pm2 save):

```bash
$ pm2 resurrect
```
