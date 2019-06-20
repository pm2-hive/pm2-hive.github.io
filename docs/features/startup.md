---
layout: docs
title: Startup Script
description: Auto restart PM2 and processes at server reboot
permalink: /docs/usage/startup/
---

## Startup Script Generator

PM2 can generate startup scripts and configure them in order to keep your process list intact across expected or unexpected machine restarts.

## Init systems supported

- **systemd**: Ubuntu >= 16, CentOS >= 7, Arch, Debian >= 7
- **upstart**: Ubuntu <= 14
- **launchd**: Darwin, MacOSx
- **openrc**: Gentoo Linux, Arch Linux
- **rcd**: FreeBSD
- **systemv**: Centos 6, Amazon Linux

These init systems are automatically detected by PM2 with the `pm2 startup` command.

## Generating a startup script

To get the automatically-configured startup script for your machine you need to type this command:

```bash
# Detect available init system, generate configuration and enable startup system
pm2 startup
```

**Do not pass sudo to this command! It will print the exact right command you will have to copy/paste into your terminal**

Example:
```bash
$ pm2 startup
[PM2] You have to run this command as root. Execute the following command:
      sudo su -c "env PATH=$PATH:/home/unitech/.nvm/versions/node/v4.3/bin pm2 startup <distribution> -u <user> --hp <home-path>
```

You simply have to copy/paste the line PM2 gives you and the startup script will be configured for your OS.


**NOTE 1** : When upgrading to newer Node.js version, update the PM2 startup script! Use `pm2 unstartup` first then `pm2 startup` again

**NOTE 2**: You can customize the service name via the `--service-name <name>` option ([#3213](https://github.com/Unitech/pm2/pull/3213))

## Saving current process list

**Important**

Once you started all the applications you want to manage, you have to save the list you wanna respawn at machine reboot with:

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
pm2 unstartup
```

## Updating Startup Script

```bash
pm2 unstartup
```

Then

```bash
pm2 startup
```

## User permissions

Let's say you want the startup script to be executed under another user.

Just change the `-u <username>` option and the `--hp <user_home>`:

```bash
pm2 startup ubuntu -u www --hp /home/ubuntu
```

## Specifying the init system

You can specify the platform you use by yourself if you want to (where platform can be either one of the cited above): 
```
pm2 startup [ubuntu | ubuntu14 | ubuntu12 | centos | centos6 | arch | oracle | amazon | macos | darwin | freebsd | systemd | systemv | upstart | launchd | rcd | openrc]
```

## SystemD installation checking

```bash
# Check if pm2-<USER> service has been added
$ systemctl list-units
# Check logs
$ journalctl -u pm2-<USER>
# Cat systemd configuration file
$ systemctl cat pm2-<USER>
# Analyze startup
$ systemd-analyze plot > output.svg
```

To wait efficiently that machine is online for PM2 to run:

```
[Unit]
Wants=network-online.target
After=network.target network-online.target

[....]

[Install]
WantedBy=multi-user.target network-online.target
```

## Windows consideration

There are some external libraries to generate a Windows compatible startup script, please checkout [pm2-windows-service](https://www.npmjs.com/package/pm2-windows-service) or [pm2-windows-startup](https://www.npmjs.com/package/pm2-windows-startup).


