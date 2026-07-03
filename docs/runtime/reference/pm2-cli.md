---
layout: docs-io
title: CLI | Reference | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/reference/pm2-cli/"
description: "Flag name|Description ---|--- -V, --version|output the version number -v --version|get version -s --silent|hide all messages -m --mini-list|display a…"
---

# CLI reference

## pm2 Flags

Flag name|Description
---|---
-V, --version|output the version number
-v --version|get version
-s --silent|hide all messages
-m --mini-list|display a compacted list without formatting
-f --force|force actions
--disable-logs|do not write logs
-n --name &lt;name&gt;|set a &lt;name&gt; for script
-i --instances &lt;number&gt;|launch [number] instances (for networked app)(load balanced)
--parallel &lt;number&gt;|number of parallel actions (for restart/reload)
-l --log [path]|specify entire log file (error and out are both included)
-o --output &lt;path&gt;|specify out log file
-e --error &lt;path&gt;|specify error log file
-p --pid &lt;pid&gt;|specify pid file
-k --kill-timeout &lt;delay&gt;|delay before sending final SIGKILL signal to process
--listen-timeout &lt;delay&gt;|listen timeout on application reload
--max-memory-restart &lt;memory&gt;|specify max memory amount used to autorestart (in octet or use syntax like 100M)
--restart-delay &lt;delay&gt;|specify a delay between restarts (in milliseconds)
--env &lt;environment_name&gt;|specify environment to get specific env variables (for JSON declaration)
--log-type &lt;type&gt;|specify log output style (raw by default, json optional)
-x --execute-command|execute a program using fork system
--max-restarts [count]|only restart the script COUNT times
-u --user &lt;username&gt;|define user when generating startup script
--uid &lt;uid&gt;|run target script with &lt;uid&gt; rights
--gid &lt;gid&gt;|run target script with &lt;gid&gt; rights
--cwd &lt;path&gt;|run target script as &lt;username&gt;
--hp &lt;home path&gt;|define home path when generating startup script
--wait-ip|override systemd script to wait for full internet connectivity to launch pm2
--service-name &lt;name&gt;|define service name when generating startup script
-c --cron &lt;cron_pattern&gt;|restart a running process based on a cron pattern
-w --write|write configuration in local folder
--interpreter &lt;interpreter&gt;|the interpreter pm2 should use for executing app (bash, python...)
--interpreter-args &lt;arguments&gt;|interpret options (alias of --node-args)
--log-date-format &lt;date format&gt;|add custom prefix timestamp to logs
--no-daemon|run pm2 daemon in the foreground if it doesn't exist already
-a --update-env|update environment on restart/reload (-a &lt;=&gt; apply)
--source-map-support|force source map support
--only &lt;application-name&gt;|with json declaration, allow to only act on one application
--disable-source-map-support|force source map support
--wait-ready|ask pm2 to wait for ready event from your app
--merge-logs|merge logs from different instances but keep error and out separated
--watch [paths]|watch application folder for changes (default: )
--ignore-watch &lt;folders&#124;files&gt;|folder/files to be ignored watching, should be a specific name or regex - e.g. --ignore-watch="test node_modules "some scripts""
--node-args &lt;node_args&gt;|space delimited arguments to pass to node in cluster mode - e.g. --node-args="--debug=7001 --trace-deprecation"
--no-color|skip colors
--no-vizion|start an app without vizion feature (versioning control)
--no-autorestart|start an app without automatic restart
--no-treekill|Only kill the main process, not detached children
--no-pmx|start an app without apm
--no-automation|start an app without apm
--trace|enable transaction tracing with km
--disable-trace|disable transaction tracing with km
--attach|attach logging after your start/restart/stop/reload
--sort &lt;field_name:sort&gt;|sort process according to field's name
--v8|enable v8 data collecting
--event-loop-inspector|enable event-loop-inspector dump in apm
--deep-monitoring|enable all monitoring tools (equivalent to --v8 --event-loop-inspector --trace)
-h, --help|output usage information

## pm2 Commands

Command name|Description
---|---
start [options] &lt;file&#124;json&#124;stdin&#124;app_name&#124;pm_id...&gt;|start and daemonize an app
trigger &lt;proc_name&gt; &lt;action_name&gt; [params]|deploy your json
deploy &lt;file&#124;environment&gt;|deploy your json
startOrRestart &lt;json&gt;|start or restart JSON file
startOrReload &lt;json&gt;|start or gracefully reload JSON file
pid [app_name]|return pid of [app_name] or all
startOrGracefulReload &lt;json&gt;|start or gracefully reload JSON file
stop [options] &lt;id&#124;name&#124;all&#124;json&#124;stdin...&gt;|stop a process (to start it again, do pm2 restart &lt;app&gt;)
restart [options] &lt;id&#124;name&#124;all&#124;json&#124;stdin...&gt;|restart a process
scale &lt;app_name&gt; &lt;number&gt;|scale up/down a process in cluster mode depending on total_number param
snapshot|snapshot PM2 memory
profile &lt;command&gt;|profile CPU
reload &lt;name&#124;all&gt;|reload processes (note that its for app using HTTP/HTTPS)
gracefulReload &lt;name&#124;all&gt;|gracefully reload a process. Send a "shutdown" message to close all connections.
id &lt;name&gt;|get process id by name
delete &lt;name&#124;id&#124;script&#124;all&#124;json&#124;stdin...&gt;|stop and delete a process from pm2 process list
sendSignal &lt;signal&gt; &lt;pm2_id&#124;name&gt;|send a system signal to the target process
ping|ping pm2 daemon - if not up it will launch it
updatePM2|update in-memory PM2 with local PM2
update|(alias) update in-memory PM2 with local PM2
install&#124;module:install [options] [module&#124;git:/]|install or update a module (or a set of modules) and run it forever
module:update &lt;module&#124;git:/&gt;|update a module and run it forever
module:generate [app_name]|Generate a sample module in current folder
uninstall&#124;module:uninstall &lt;module&gt;|stop and uninstall a module
publish&#124;module:publish|Publish the module you are currently on
set [key] [value]|sets the specified config &lt;key&gt; &lt;value&gt;
multiset &lt;value&gt;|multiset eg "key1 val1 key2 val2
get [key]|get value for &lt;key&gt;
conf [key] [value]|get / set module config values
config &lt;key&gt; [value]|get / set module config values
unset &lt;key&gt;|clears the specified config &lt;key&gt;
report|give a full pm2 report for https://github.com/Unitech/pm2/issues
link&#124;interact [options] [secret] [public] [name]|linking action to keymetrics.io - command can be stop&#124;info&#124;delete&#124;restart
unlink|linking action to keymetrics.io - command can be stop&#124;info&#124;delete&#124;restart
unmonitor [name]|unmonitor target process
monitor [name]|monitor target process
open|open dashboard in browser
register|create an account on keymetrics
login|login to keymetrics and link current PM2
web|launch a health API on 0.0.0.0:9615
dump&#124;save|dump all processes for resurrecting them later
send &lt;pm_id&gt; &lt;line&gt;|send stdin to &lt;pm_id&gt;
attach &lt;pm_id&gt; [comman]|attach stdin/stdout to application identified by &lt;pm_id&gt;
resurrect|resurrect previously dumped processes
unstartup [platform]|disable and clear auto startup - [platform]=systemd,upstart,launchd,rcd
startup [platform]|setup script for pm2 at boot - [platform]=systemd,upstart,launchd,rcd
logrotate|copy default logrotate configuration
ecosystem&#124;init [mode]|generate a process conf file. (mode = null or simple)
reset &lt;name&#124;id&#124;all&gt;|reset counters for process
describe &lt;id&gt;|describe all parameters of a process id
desc &lt;id&gt;|(alias) describe all parameters of a process id
info &lt;id&gt;|(alias) describe all parameters of a process id
show &lt;id&gt;|(alias) describe all parameters of a process id
list&#124;ls|list all processes
l|(alias) list all processes
ps|(alias) list all processes
status|(alias) list all processes
jlist|list all processes in JSON format
prettylist|print json in a prettified JSON
monit|launch termcaps monitoring
imonit|launch legacy termcaps monitoring
dashboard&#124;dash|launch dashboard with monitoring and logs
flush|flush logs
reloadLogs|reload all logs
logs [options] [id&#124;name]|stream logs file. Default stream all logs
kill|kill daemon
pull &lt;name&gt; [commit_id]|updates repository for a given app
forward &lt;name&gt;|updates repository to the next commit for a given app
backward &lt;name&gt;|downgrades repository to the previous commit for a given app
gc|force PM2 to trigger garbage collection
deepUpdate|performs a deep update of PM2
serve&#124;expose [path] [port]|serve a directory over http via port
