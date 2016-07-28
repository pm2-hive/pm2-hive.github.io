---
layout: docs
title: Startup Script
description: Auto restart PM2 and processes at server reboot
permalink: /docs/usage/startup/
---

PM2 can generate startup scripts and configure them in order to keep your process list intact across expected or unexpected machine restarts.

## Command

To get the automatically-configured startup script for your machine you need to type this command:

```bash
# Auto-detect platform
$ pm2 startup

# OR
# Render startup-script for a specific platform, the [platform] could be one of:
#   ubuntu|centos|redhat|gentoo|systemd|darwin|amazon
$ pm2 startup [platform] -
```

The output of this command may be a recommendation of the line to copy/paste with all environment variables and options configured for you.

E.G:

```bash
[PM2] You have to run this command as root. Execute the following command:
      sudo su -c "env PATH=$PATH:/home/unitech/.nvm/versions/node/v4.3/bin pm2 startup <distribution> -u <user> --hp <home-path>
```

Just copy/paste this line and the startup script will be configured for your OS.

### Windows consideration

There are some external libraries to generate a Windows compatible startup script, please checkout [pm2-windows-service](https://www.npmjs.com/package/pm2-windows-service) or [pm2-windows-startup](https://www.npmjs.com/package/pm2-windows-startup).

### Saving current processes

Once you started all the applications you want to manage, to keep this list across expected/unexpected server restart, just type the command:

```bash
$ pm2 save
```

Doing this will save the process list with their current environment into the dump file `$PM2_HOME/.pm2/dump.pm2`

**Warning** We recommend you to double check that everything is working correctly by restarting your server. 

## Startup Systems support

Multiple types of startup scripts are available:

- SystemV init script (with the option `ubuntu` or `centos`)
- OpenRC init script (with the option `gentoo`)
- SystemD init script (with the `systemd` option)

The distribution option after doing `pm2 startup <distribution>` will use:

- **ubuntu** will use `updaterc.d` and the script `lib/scripts/pm2-init.sh`
- **centos**/**redhat** will use `chkconfig` and the script `lib/scripts/pm2-init-centos.sh`
- **gentoo** will use `rc-update` and the script `lib/scripts/pm2`
- **systemd** will use `systemctl` and the script `lib/scripts/pm2.service`
- **darwin** will use `launchd` to load a specific `plist` to resurrect processes after reboot

## User permissions

Let's say you want the startup script to be executed under another user.

Just use the `-u <username>` option!

```bash
$ pm2 startup ubuntu -u www
```

## Override max open fd

The environment variable `MAX_OPEN_FILE` allows to change the maximum open file descriptor.
Add the `MAX_OPEN_FILE` variable in /etc/default/pm2 

## Related commands

### Verify startup apps

Tool to verify startup applications (available on Ubuntu):

```bash
$ sudo apt-get install rcconf
# Check for pm2 script related
$ sudo rcconf
```

### Remove init scripts

```
# Ubuntu
$ sudo update-rc.d -f pm2-init.sh remove
```

### Bring back dump

Bring back previously saved processes (via pm2 save):

```bash
$ pm2 resurrect
```
