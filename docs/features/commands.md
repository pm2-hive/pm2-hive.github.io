---
layout: docs
title: CLI Reference
description: "Complete PM2 command reference: every pm2 command grouped by theme — process control, status, logs, monitoring, startup, deployment, modules and PM2 Plus."
permalink: /docs/usage/commands/
last_modified_at: 2026-07-03
---

## PM2 CLI Command Reference

Every PM2 command, one line each, grouped by theme. Run `pm2 <command> -h` to list the options of a specific command, or `pm2 examples` to display common usage examples.

### Process Control

| Command | Description |
|:--------|:------------|
| `pm2 start <script/name/id/ecosystem>` | Start and daemonize an app, or start apps declared in a [configuration file](/docs/usage/application-declaration/) |
| `pm2 start <app> --container` | Start the app inside a Docker container based on `keymetrics/pm2:<node>-trixie` — `--node-version <major>` to pick the Node.js version, `--fresh` to rebuild the Dockerfile, `--dist --image-name <name>` to build a distributable image |
| `pm2 create` | Pick a sample app boilerplate, copy it to the current folder and start it |
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
| `pm2 monit` | Terminal-based dashboard with CPU/memory, [custom metrics](/docs/usage/process-metrics/) and logs — `--lines <n>` log lines kept per process (default 200) |
| `pm2 dashboard` (alias `dash`) | Same terminal dashboard as `pm2 monit` — `--lines <n>` (default 200) |
| `pm2 imonit` | Legacy terminal monitoring interface |
| `pm2 slist` (alias `sysinfos`) | Print system (host) information in JSON — `--tree` to display it as a tree |
| `pm2 trigger <name/id/namespace/all> <action> [params]` | Trigger a [custom process action](/docs/usage/process-actions/), optionally with a parameter |

In `pm2 monit` / `pm2 dash`, Ctrl+Up / Ctrl+Down (or PageUp / PageDown) scroll the focused log pane page by page.

Host metrics (CPU, memory, disk, network) are collected by the PM2 daemon by default. To disable the collection: `pm2 set pm2:sysmonit false` then `pm2 update`.

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
| `pm2 save` (alias `dump`) | Save the current process list so it can be resurrected at boot — `--force` to overwrite the dump even when the list is empty |
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
| `pm2 install <module>` (alias `module:install`) | Install and run a [PM2 module](/docs/advanced/pm2-module-system/) (e.g. `pm2 install pm2-logrotate`) — `--tarball` install a local tarball (`--install` to run `yarn install` before starting it), `--safe [time]` restore the previous version if the new one keeps restarting |
| `pm2 uninstall <module>` (alias `module:uninstall`) | Stop and uninstall a module |
| `pm2 module:update <module>` | Update a module (`--tarball` for a local tarball) |
| `pm2 module:generate [name]` | Generate a sample module boilerplate |
| `pm2 package [target]` | Check and package a TAR-type module |
| `pm2 publish` (alias `module:publish`) | Publish the module in the current folder |
| `pm2 set <key> <value>` | Set a configuration value (e.g. `pm2 set pm2-logrotate:max_size 10M`) |
| `pm2 get [key]` | Read a configuration value |
| `pm2 unset <key>` | Clear a configuration value |
| `pm2 multiset "k1 v1 k2 v2"` | Set several configuration values at once |
| `pm2 conf` | Print all configuration values (same as `pm2 get`) |
| `pm2 config <key> [value]` | Get a configuration value, or set it when `[value]` is given |

### PM2 Plus

| Command | Description |
|:--------|:------------|
| `pm2 plus` (alias `register`) | Connect to [PM2 Plus](/docs/usage/monitoring/) web monitoring |
| `pm2 login` / `pm2 logout` | Log in to / out of PM2 Plus |
| `pm2 link [secret] [public] [name]` | Link this PM2 instance to the PM2 Plus dashboard (`--info-node <url>` for on-premise); without arguments, relaunch the agent with the saved keys |
| `pm2 link stop` / `pm2 link info` / `pm2 link delete` | Stop the agent / print agent information / stop the agent and delete its saved keys |
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
| `pm2 serve [path] [port]` (alias `expose`) | Serve a directory over HTTP ([static server](/docs/usage/expose/)) — `--spa` for single-page apps, `--ftp` for directory listing |

### Options

Global options, usable with `pm2 start` and the other commands they apply to. `pm2 -h` prints the full list.

#### Start & runtime

| Option | Description |
|:-------|:------------|
| `-n --name <name>` | Set a name for the process in the process list |
| `-i --instances <number>` | Launch `<number>` instances in [cluster mode](/docs/usage/cluster-mode/) (`max` or `0` = number of CPUs) |
| `--namespace <ns>` | Start the application within the specified namespace |
| `--cwd <path>` | Run the script from path `<cwd>` |
| `--env <environment_name>` | Inject the `env_<environment_name>` set of the ecosystem file ([environment](/docs/usage/environment/)) |
| `-a --update-env` | Update the environment on restart/reload |
| `--filter-env [envs]` | Do not pass global variables containing the given strings to the app (alone: drop all but `PATH`, `HOME`...) |
| `--only <app-name>` | With an ecosystem file, act on one application only |
| `--interpreter <interpreter>` | Interpreter used to run the app (default `node`) |
| `--interpreter-args <arguments>` / `--node-args <node_args>` | Arguments passed to the interpreter |
| `-x --execute-command` | Execute a program using fork mode |
| `--uid <uid>` / `--gid <gid>` | Run the app with `<uid>` / `<gid>` rights |
| `--no-autostart` | Add the app to the list without starting it |
| `--no-daemon` | Run the PM2 daemon in the foreground if it is not already running |
| `--source-map-support` / `--disable-source-map-support` | Force or disable source map support |
| `--parallel <number>` | Number of parallel actions (for restart/reload) |
| `-f --force` | Force actions (e.g. start a script already running) |

#### Restart & shutdown

| Option | Description |
|:-------|:------------|
| `--watch [paths]` | Restart on file changes in the app folder, or in `[paths]` (repeatable) ([watch & restart](/docs/usage/watch-and-restart/)) |
| `--ignore-watch <folders/files>` | Paths to ignore (name or regex) |
| `--watch-delay <delay>` | Delay before restarting after a file change (`4` = 4 seconds, `4000ms`) |
| `--ext <extensions>` | Watch only these file extensions |
| `--max-memory-restart <memory>` | Restart the app when it exceeds this amount of memory (e.g. `200M`, `1G`) |
| `--max-restarts [count]` | Number of unstable restarts before the app is marked as errored |
| `--restart-delay <delay>` | Delay between restarts (ms) |
| `--exp-backoff-restart-delay <delay>` | Initial exponential backoff restart delay (ms) |
| `--no-autorestart` | Do not restart the app automatically |
| `--stop-exit-codes <exit_codes...>` | Exit codes that skip automatic restart |
| `-c --cron <cron_pattern>` (alias `--cron-restart`) | Restart the app on a cron pattern |
| `-k --kill-timeout <delay>` | Delay before sending the final `SIGKILL` |
| `--listen-timeout <delay>` | Listen timeout on reload |
| `--wait-ready` | Wait for `process.send('ready')` from the app |
| `--shutdown-with-message` | Shutdown with `process.send('shutdown')` instead of `SIGINT` |
| `--no-treekill` | Only kill the main process, not detached children |

#### Logs

| Option | Description |
|:-------|:------------|
| `-o --output <path>` / `-e --error <path>` | stdout / stderr log file |
| `-l --log [path]` | Log file gathering both stdout and stderr |
| `--log-type <type>` | Log output style (`raw` by default, `json` optional) |
| `--log-date-format <format>` | Prefix logs with a custom timestamp |
| `--time` | Prefix logs with a timestamp |
| `--merge-logs` | Merge logs of all instances (out and err kept separate) |
| `--disable-logs` | Do not store any logs |
| `--attach` | Attach to logs after start/restart/stop/reload |
| `-p --pid <pid>` | PID file path |

#### Monitoring

| Option | Description |
|:-------|:------------|
| `--no-pmx` (alias `--no-automation`) | Do not inject the monitoring agent in the app |
| `--trace` / `--disable-trace` | Enable or disable transaction tracing |
| `--v8` | Enable V8 data collection |
| `--event-loop-inspector` | Enable event-loop inspector dumps |
| `--deep-monitoring` | Same as `--v8 --event-loop-inspector --trace` |
| `--no-vizion` | Disable versioning metadata (git parsing is only done when `PM2_ENABLE_GIT_PARSING=true`) |

#### Startup script

| Option | Description |
|:-------|:------------|
| `-u --user <username>` | User for the startup script |
| `--hp <home path>` | Home path for the startup script |
| `--service-name <name>` | Service name for the startup script |
| `--wait-ip` | systemd only: wait for full internet connectivity before launching PM2 |

#### Display

| Option | Description |
|:-------|:------------|
| `-m --mini-list` | Compact process list without formatting |
| `--sort <field_name:sort>` | Sort the process list by field (e.g. `name:desc`) |
| `-s --silent` | Hide all messages |
| `--no-color` | Disable colors |
| `-v --version` | Print the PM2 version |
