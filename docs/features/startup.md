---
layout: docs
title: Startup Script
description: Auto restart PM2 and processes at server reboot
permalink: /docs/usage/startup/
---

## Persistent applications: Startup Script Generator

PM2 can generate startup scripts and configure them in order to keep your process list intact across expected or unexpected machine restarts.

- **systemd**: Ubuntu >= 16, CentOS >= 7, Arch, Debian >= 7
- **upstart**: Ubuntu ==> 14
- **launchd**: Darwin, MacOSx
- **openrc**: Gentoo Linux, Arch Linux
- **rcd**: FreeBSD
- **systemv**: Centos 6, Amazon Linux

These init systems are automatically detected by PM2 with the `pm2 startup` command.

### Generating a Startup Script

To automatically generate and configuration a startup script just type the command (without sudo) `pm2 startup`:

```bash
$ pm2 startup
[PM2] You have to run this command as root. Execute the following command:
      sudo su -c "env PATH=$PATH:/home/unitech/.nvm/versions/node/v14.3/bin pm2 startup <distribution> -u <user> --hp <home-path>
```

Then copy/paste the displayed command onto the terminal:

```bash
sudo su -c "env PATH=$PATH:/home/unitech/.nvm/versions/node/v14.3/bin pm2 startup <distribution> -u <user> --hp <home-path>
```

Now PM2 will automatically restart at boot.

**Note**: You can customize the service name via the `--service-name <name>` option ([#3213](https://github.com/Unitech/pm2/pull/3213))

### Saving the app list to be restored at reboot

Once you have started all desired apps, save the app list so it will respawn after reboot:

```bash
pm2 save
```

### Manually resurrect processes

To manually bring back previously saved processes (via pm2 save):

```bash
pm2 resurrect
```

### Disabling startup system

To disable and remove the current startup configuration:

```bash
pm2 unstartup
```

The previous line code let PM2 detect your platform. Alternatively you can use another specified init system yourself using:

#### Updating startup script after Node.js version upgrade

When you upgrade the local Node.js version, be sure to update the PM2 startup script, so it runs the latest Node.js binary you have installed.

First disable and remove the current startup configuration (copy/paste the output of that command): 

```bash
$ pm2 unstartup
```

Then restore a fresh startup script:

```bash
$ pm2 startup
```

#### User permissions

Let's say you want the startup script to be executed under another user.

Just change the `-u <username>` option and the `--hp <user_home>`:

```bash
pm2 startup ubuntu -u www --hp /home/ubuntu
```

#### Specifying the init system

You can specify the platform you use by yourself if you want to (where platform can be either one of the cited above): 
```
pm2 startup [ubuntu | ubuntu14 | ubuntu16 | ubuntu18 | ubuntu20 | ubuntu12 | centos | centos6 | arch | oracle | amazon | macos | darwin | freebsd | systemd | systemv | upstart | launchd | rcd | openrc]
```

#### SystemD installation checking

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

#### Windows startup script

To generate a Windows compatible startup script have a look to the excellent [pm2-installer](https://github.com/jessety/pm2-installer)

#### Init systems supported

- **systemd**: Ubuntu >= 16, CentOS >= 7, Arch, Debian >= 7
- **upstart**: Ubuntu <= 14
- **launchd**: Darwin, MacOSx
- **openrc**: Gentoo Linux, Arch Linux
- **rcd**: FreeBSD
- **systemv**: Centos 6, Amazon Linux

These init systems are automatically detected by PM2 with the `pm2 startup` command.



