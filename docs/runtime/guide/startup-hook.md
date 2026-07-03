---
layout: docs-io
title: Startup Hook | Guide | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/guide/startup-hook/"
description: "The purpose of a startup hook is to save your process list and bring it back at machine restarts, even unexpected ones."
---

# Startup Hook

The purpose of a startup hook is to save your process list and bring it back at machine restarts, even unexpected ones.

Each OS has a specific tool to handle startup hooks: PM2 provides an easy way to generate and configure them.

## Installation

To detect available init systems on your machine and generate a configuration, use:

```bash
pm2 startup
$ [PM2] You have to run this command as root. Execute the following command:
$ sudo su -c env PATH=$PATH:/home/unitech/.nvm/versions/node/v4.3/bin pm2 startup <distribution> -u <user> --hp <home-path>
```

Copy and paste in the CLI the ouput of this command to set up your startup hook.

 With NVM, the `pm2` path change when updating Node.js. You need to run the `startup` command after every update.
{: .warn}

 You can customize the service name via the `--service-name <name>` option ([#3213](https://github.com/Unitech/pm2/pull/3213))
{: .tip}

## Save your process list

The startup hook auto load the process list that you have previously saved.

Save your process list with:

```bash
pm2 save
```

**Warning**: if you delete all processes then reboot your system (or use pm2 update) it will ressurect all your processes (previously stored in dump file). It's to prevent "empty dump file" bug.

If you want to create an empty dump file you should use:

```bash
pm2 cleardump
```

## Disabling startup system

```bash
pm2 unstartup
```

## User permissions

If you want the startup hook to be executed under another user, use the `-u <username>` option and the `--hp <user_home>`:

```bash
pm2 startup ubuntu -u www --hp /home/ubuntu
```

## Update startup hook

To update the startup hook run the following commands:

```bash
pm2 unstartup
pm2 startup
```

## Compatibility

Init systems supported are:

- **systemd**: Ubuntu >= 16, CentOS >= 7, Arch, Debian >= 7
- **upstart**: Ubuntu <= 14
- **launchd**: Darwin, MacOSx
- **openrc**: Gentoo Linux, Arch Linux
- **rcd**: FreeBSD
- **systemv**: Centos 6, Amazon Linux

You can specify the platform you use if you want to:

```bash
pm2 [startup | unstartup] [platform]
```

Platform can be either one of the cited below:

ubuntu, ubuntu14, ubuntu12, centos, centos6, arch, oracle, amazon, macos, darwin, freebsd, systemd, systemv, upstart, launchd, rcd, openrc

## Under the hood

- **ubuntu** use `updaterc.d` and the script `lib/scripts/pm2-init.sh`
- **centos**/**redhat** use `chkconfig` and the script `lib/scripts/pm2-init-centos.sh`
- **gentoo** use `rc-update` and the script `lib/scripts/pm2`
- **systemd** use `systemctl` and the script `lib/scripts/pm2.service`
- **darwin** use `launchd` to load a specific `plist` to resurrect processes after reboot.

## Windows consideration

There are some external libraries to generate a Windows compatible startup script, please checkout [pm2-windows-service](https://www.npmjs.com/package/pm2-windows-service) or [pm2-windows-startup](https://www.npmjs.com/package/pm2-windows-startup).

## Next Steps

[Load-Balancing (cluster mode)]({{ site.baseurl }}{% link docs/runtime/guide/load-balancing.md %})
{: .btn-stylized}
