---
layout: docs
title: CLI Reference
description: "Complete PM2 command reference: every pm2 command grouped by theme — process control, status, logs, monitoring, startup, deployment, modules and PM2 Plus."
permalink: /docs/usage/commands/
---

## PM2 CLI Command Reference

Every PM2 command, one line each, grouped by theme. Run `pm2 <command> -h` to list the options of a specific command, or `pm2 examples` to display common usage examples.

### Process Control

| Command | Description |
|:--------|:------------|
| `pm2 start <script/name/id/ecosystem>` | Start and daemonize an app, or start apps declared in a [configuration file](/docs/usage/application-declaration/) |
| `pm2 stop <name/id/namespace/all>` | Stop a process without removing it from the list |
| `pm2 restart <name/id/namespace/all>` | Kill then restart a process ([restart strategies](/docs/usage/restart-strategies/)) |
| `pm2 reload <name/id/namespace/all>` | Zero-downtime reload for [cluster mode](/docs/usage/cluster-mode/) applications |
| `pm2 delete <name/id/namespace/all>` (alias `del`) | Stop a process and remove it from the process list |
| `pm2 scale <name> <number>` | Scale a cluster-mode app up or down to `<number>` instances (`+3`/`-2` also work) |
| `pm2 reset <name/id/all>` | Reset restart and other counters of a process |
| `pm2 sendSignal <signal> <name/id>` | Send a system signal (e.g. `SIGUSR2`) to a process ([signals](/docs/usage/signals-clean-restart/)) |
| `pm2 send <id> <line>` | Send a line to the stdin of a process |
| `pm2 attach <id>` | Attach your terminal to the stdin/stdout of a running process |

### Configuration File

| Command | Description |
|:--------|:------------|
| `pm2 ecosystem` (alias `init`) | Generate a sample `ecosystem.config.js` [configuration file](/docs/usage/application-declaration/) |
| `pm2 startOrRestart <ecosystem>` | Start apps declared in the file, or restart them if already running |
| `pm2 startOrReload <ecosystem>` | Start apps, or zero-downtime reload them if already running — ideal for CI/CD |
| `pm2 startOrGracefulReload <ecosystem>` | Same as above with graceful reload |

### Status & Inspection

| Command | Description |
|:--------|:------------|
| `pm2 list` (aliases `ls`, `ps`, `status`, `l`) | List all processes with their status, CPU and memory |
| `pm2 describe <name/id>` (aliases `desc`, `show`, `info`) | Describe all parameters and paths of a process |
| `pm2 env <id>` | List all environment variables of a process ([environment](/docs/usage/environment/)) |
| `pm2 pid [name]` | Print the PID of a process (or of all processes) |
| `pm2 id <name>` | Get the PM2 id of a process by name |
| `pm2 inspect <name>` | Open a remote debugging/inspector session on a process |
| `pm2 jlist` | Print the process list in raw JSON format |
| `pm2 prettylist` | Print the process list in prettified JSON format |
| `pm2 report` | Print a full diagnostic report — attach it when [opening an issue](https://github.com/Unitech/pm2/issues) |
| `pm2 ping` | Ping the PM2 daemon — launches it if it is not up |

### Monitoring

| Command | Description |
|:--------|:------------|
| `pm2 monit` | Terminal-based dashboard with CPU/memory and [custom metrics](/docs/usage/process-metrics/) |
| `pm2 dashboard` (alias `dash`) | Terminal dashboard combining monitoring and logs |
| `pm2 imonit` | Legacy terminal monitoring interface |
| `pm2 sysmonit` | Start the system (host-level) monitoring daemon |
| `pm2 sysinfos` (alias `slist`) | Print system information in JSON |
| `pm2 trigger <name/id/namespace/all> <action>` | Trigger a [custom process action](/docs/usage/process-actions/) |

### Logs

| Command | Description |
|:--------|:------------|
| `pm2 logs [name/id/namespace]` | Stream logs in realtime — `--lines 200` for history, `--json` for JSON output ([logs](/docs/usage/log-management/)) |
| `pm2 flush [name]` | Empty log files |
| `pm2 reloadLogs` | Reload all log files (used by log rotation systems) |
| `pm2 logrotate` | Install the default system logrotate configuration for PM2 |

### Startup & Persistence

| Command | Description |
|:--------|:------------|
| `pm2 startup [platform]` | Generate a boot init script (systemd, launchd, ...) — see [persistent applications](/docs/usage/startup/) |
| `pm2 unstartup [platform]` | Disable and remove the boot init script |
| `pm2 save` (alias `dump`) | Save the current process list so it can be resurrected at boot |
| `pm2 resurrect` | Restore the previously saved process list |
| `pm2 cleardump` | Empty the saved process list dump file |

### Deployment & Versioning

| Command | Description |
|:--------|:------------|
| `pm2 deploy <file/environment>` | Deploy over SSH with the [deployment system](/docs/usage/deployment/) |
| `pm2 pull <name> [commit]` | `git pull` the application repository and restart |
| `pm2 forward <name>` | Update the application repository to the next commit |
| `pm2 backward <name>` | Roll the application repository back to the previous commit |

### Modules

| Command | Description |
|:--------|:------------|
| `pm2 install <module>` (alias `module:install`) | Install and run a [PM2 module](/docs/advanced/pm2-module-system/) (e.g. `pm2 install pm2-logrotate`) |
| `pm2 uninstall <module>` (alias `module:uninstall`) | Stop and uninstall a module |
| `pm2 module:update <module>` | Update a module |
| `pm2 module:generate [name]` | Generate a sample module boilerplate |
| `pm2 package [target]` | Check and package a TAR-type module |
| `pm2 publish` (alias `module:publish`) | Publish the module in the current folder |
| `pm2 set <key> <value>` | Set a configuration value (e.g. `pm2 set pm2-logrotate:max_size 10M`) |
| `pm2 get [key]` | Read a configuration value |
| `pm2 unset <key>` | Clear a configuration value |
| `pm2 multiset "k1 v1 k2 v2"` | Set several configuration values at once |
| `pm2 conf [key] [value]` (alias `config`) | Get or set module configuration values |

### PM2 Plus

| Command | Description |
|:--------|:------------|
| `pm2 plus` (alias `register`) | Connect to [PM2 Plus](/docs/usage/monitoring/) web monitoring |
| `pm2 login` / `pm2 logout` | Log in to / out of PM2 Plus |
| `pm2 link <secret> <public>` | Link this PM2 instance to the PM2 Plus dashboard |
| `pm2 unlink` | Unlink from the PM2 Plus dashboard |
| `pm2 monitor [name]` / `pm2 unmonitor [name]` | Enable or disable monitoring of a process |
| `pm2 open` | Open the PM2 Plus dashboard in the browser |
| `pm2 install-otel` / `pm2 uninstall-otel` | Install or remove the OpenTelemetry packages required by `--trace` |

### Daemon Management

| Command | Description |
|:--------|:------------|
| `pm2 update` (alias `updatePM2`) | Replace the in-memory daemon after a PM2 upgrade, without losing processes ([update PM2](/docs/usage/update-pm2/)) |
| `pm2 deepUpdate` | Perform a deep update of PM2 |
| `pm2 kill` | Kill the PM2 daemon and all managed processes |
| `pm2 profile:cpu [seconds]` | Profile the PM2 daemon CPU usage |
| `pm2 profile:mem [seconds]` | Sample the PM2 daemon heap memory |

### Static File Server

| Command | Description |
|:--------|:------------|
| `pm2 serve [path] [port]` (alias `expose`) | Serve a directory over HTTP ([static server](/docs/usage/expose/)) — `--spa` for single-page apps |
