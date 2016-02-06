---
layout: docs
title: Startup Script
description: Auto restart PM2 and processes at server reboot
permalink: /docs/usage/startup/
---

PM2 can **generates startup scripts and configure them** and is also smart enough to **save all your process list** and to **bring back all your processes at machine restart**.

## Command

```bash
$ pm2 startup
# auto-detect platform
$ pm2 startup [platform]
# render startup-script for a specific platform, the [platform] could be one of:
#   ubuntu|centos|redhat|gentoo|systemd|darwin|amazon
```

Once you have started the apps and want to keep them on server reboot do:

```bash
$ pm2 save
```

**Warning** It's tricky to make this feature work generically, so once PM2 has setup your startup script, reboot your server to make sure that PM2 has launched your apps!

**Note** If you need to change some environment

## Startup Systems support

Three types of startup scripts are available:

- SystemV init script (with the option `ubuntu` or `centos`)
- OpenRC init script (with the option `gentoo`)
- SystemD init script (with the `systemd` option)

The startup options are using:

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

## Override maximum open file descriptor

The environment variable `MAX_OPEN_FILE` allows to change the maximum open file descriptor.
Add the `MAX_OPEN_FILE` variable in /etc/default/pm2 

## Related commands

Dump all processes status and environment managed by PM2:

```bash
$ pm2 [dump|save]
```

It populates the file `~/.pm2/dump.pm2` by default.

To bring back the latest dump:

```bash
$ pm2 resurrect
```
