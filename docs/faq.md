---
layout: docs
title: FAQ
description: "Answers to frequently asked questions about PM2: cluster mode, log locations, startup scripts, zero-downtime reloads and memory management."
permalink: /docs/faq/
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between fork mode and cluster mode?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Fork mode runs your application as a single process, like running it with node directly. Cluster mode spawns multiple instances of your Node.js application and load-balances incoming HTTP/TCP connections between them using the Node.js cluster module, using all available CPU cores. Enable it with 'pm2 start app.js -i max'. Cluster mode only works for Node.js applications; other languages must use fork mode."
      }
    },
    {
      "@type": "Question",
      "name": "How do I make PM2 restart my apps automatically after a server reboot?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Run 'pm2 startup' to generate an init script for your platform (systemd, upstart, launchd...), execute the printed command, then run 'pm2 save' to freeze your current process list. PM2 and your applications will be resurrected automatically at boot."
      }
    },
    {
      "@type": "Question",
      "name": "Where are the PM2 log files located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "By default application logs are stored in $HOME/.pm2/logs, one output and one error file per process. Stream them in realtime with 'pm2 logs', empty them with 'pm2 flush', and rotate them with the pm2-logrotate module ('pm2 install pm2-logrotate')."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between pm2 restart and pm2 reload?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "'pm2 restart' kills and restarts the process, causing a short downtime. 'pm2 reload' performs a zero-downtime reload for cluster-mode applications: new workers are started and old ones are killed only once the new ones are ready to accept connections."
      }
    },
    {
      "@type": "Question",
      "name": "How do I limit the memory used by an application?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use the max-memory-restart option: 'pm2 start app.js --max-memory-restart 300M' or set max_memory_restart in your ecosystem file. PM2 checks memory usage every 30 seconds and reloads the process when it exceeds the threshold. Units K, M and G are supported."
      }
    },
    {
      "@type": "Question",
      "name": "How do I update PM2 to the latest version?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Install the latest package with 'npm install pm2@latest -g', then run 'pm2 update' to replace the in-memory PM2 daemon without losing your process list."
      }
    },
    {
      "@type": "Question",
      "name": "Can PM2 run applications written in other languages than Node.js?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. PM2 can start any script or binary: Python, Ruby, Bash, PHP or compiled binaries, e.g. 'pm2 start app.py' or 'pm2 start ./binary-file'. The interpreter is selected from the file extension and can be overridden with the --interpreter option. Cluster mode however is only available for Node.js applications."
      }
    },
    {
      "@type": "Question",
      "name": "How do I run PM2 inside a Docker container?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use pm2-runtime, a drop-in replacement for the node binary designed for containers: install PM2 in your image with 'RUN npm install pm2 -g' and use 'CMD [\"pm2-runtime\", \"app.js\"]' as the entrypoint. It keeps PM2 in the foreground so the container stays alive."
      }
    },
    {
      "@type": "Question",
      "name": "I can't connect my local PM2 to the PM2.io dashboard",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This can happen for several reasons: 1) You are behind a company proxy or firewall - make sure port 443 is open or set proxy config with PM2_PROXY. 2) You are using an old PM2 version - update with 'npm install pm2@latest -g'. 3) You have concurrent PM2 instances - check with 'ps -aux | grep PM2'. 4) Try refreshing connection with 'pm2 link stop' then 'pm2 link start'."
      }
    },
    {
      "@type": "Question", 
      "name": "The versioning buttons (Rollback/Pull/Upgrade) aren't working",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Check these solutions: 1) If buttons are disabled, ensure 'Local changes' and 'Local commit' indicators are green. 2) 'Not authorized' warning means you lack admin privileges in the bucket. 3) If the procedure hangs, update Node.js and PM2 to latest versions. 4) Ensure your repository doesn't require password input - clone via SSH and test with 'git remote update'."
      }
    },
    {
      "@type": "Question",
      "name": "How do I group processes together with namespaces?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start processes with a namespace using 'pm2 start app.js --namespace backend' or the namespace attribute in the ecosystem file. Every command accepting a process name also accepts a namespace, so 'pm2 restart backend', 'pm2 stop backend' or 'pm2 logs backend' act on all processes of the namespace at once."
      }
    },
    {
      "@type": "Question",
      "name": "How do I get a diagnostic report about my PM2 installation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Run 'pm2 report'. It prints a full report: PM2, Node.js and OS versions, daemon state and the process list. Attach it when opening an issue on the PM2 GitHub repository."
      }
    },
    {
      "@type": "Question",
      "name": "How do I start or reload applications in a CI/CD pipeline?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use 'pm2 startOrReload ecosystem.config.js': it starts the applications if they are not running, and performs a zero-downtime reload if they are. This makes deployments idempotent - the same command works on the first deploy and on every update. Follow it with 'pm2 save' to persist the process list."
      }
    }
  ]
}
</script>

## What is the difference between fork mode and cluster mode?

**Fork mode** runs your application as a single process, exactly like running it with `node` directly.

**Cluster mode** spawns multiple instances of your Node.js application and load-balances incoming HTTP/TCP connections between them using the Node.js cluster module — using all available CPU cores with zero code change:

```bash
pm2 start app.js -i max
```

Cluster mode only works for Node.js applications; scripts in other languages run in fork mode. Read more in the [cluster mode documentation](/docs/usage/cluster-mode/).

## How do I make PM2 restart my apps automatically after a server reboot?

Generate an init script for your platform, run the command it prints, then freeze your process list:

```bash
pm2 startup
# run the command printed by pm2
pm2 save
```

PM2 and your applications will be resurrected at boot. See the [startup script documentation](/docs/usage/startup/).

## Where are the PM2 log files located?

Application logs live in `$HOME/.pm2/logs`, one output and one error file per process.

```bash
pm2 logs            # stream logs in realtime
pm2 flush           # empty all log files
pm2 install pm2-logrotate   # rotate logs automatically
```

More in the [log management documentation](/docs/usage/log-management/).

## What is the difference between pm2 restart and pm2 reload?

`pm2 restart` kills and restarts the process (brief downtime). `pm2 reload` performs a **zero-downtime reload** for cluster-mode applications: new workers are spawned and old ones are only killed once the new ones are ready to accept connections.

## How do I limit the memory used by an application?

```bash
pm2 start app.js --max-memory-restart 300M
```

PM2 checks memory usage every 30 seconds and reloads the process when it exceeds the threshold. Units `K`, `M` and `G` are supported. See [memory limit](/docs/usage/memory-limit/).

## How do I update PM2 to the latest version?

```bash
npm install pm2@latest -g
pm2 update
```

`pm2 update` replaces the in-memory daemon without losing your process list.

## Can PM2 run applications written in other languages than Node.js?

Yes — PM2 can start any script or binary:

```bash
pm2 start app.py
pm2 start ./binary-file -- --port 1520
```

The interpreter is picked from the file extension and can be overridden with `--interpreter`. Cluster mode, however, is Node.js only.

## How do I run PM2 inside a Docker container?

Use `pm2-runtime`, a drop-in replacement for the `node` binary designed for containers:

```dockerfile
RUN npm install pm2 -g
CMD ["pm2-runtime", "app.js"]
```

It keeps PM2 in the foreground so the container stays alive. See the [Docker integration documentation](/docs/usage/docker-pm2-nodejs/).

## I can't connect my local PM2 to the PM2.io dashboard

If you are in this situation, it might be for several reasons.

- You are behind a company proxy or firewall. 

Make sure the 443 port is opened and/or set the proxy config:
`PM2_PROXY=<proxy-address> pm2 link <secret> <public>`

- You are using a old PM2 version. Update PM2 to latest: `npm install pm2@latest -g`

- You have concurrent PM2 sending data to the same bucket with an identical server name.
Make sure you have only one PM2 instance launched `ps -aux | grep PM2`

- Refresh your connection to PM2.io. `pm2 link stop` then `pm2 link start`. Also don't forget to refresh the dashboard itself, it might help sometimes.

## The versioning buttons (Rollback/Pull/Upgrade) aren't working

- If the buttons are disabled, make sure that the `Local changes` and `Local commit` indicators are green.

- If you get a warning `Not authorized` when trying to perform such actions, it means you have not the admin privileges in this bucket.

- If none of the above happens, but the procedure just hangs, make sure you have a recent version of Node.js as well as the latest version of PM2.

- Also, your repository should not ask for a password input (it means you must clone it via ssh), try typing `git remote update` manually in the folder and see if it asks for a password or not.

## How do I group processes together with namespaces?

Start processes with a namespace, either from the CLI or with the `namespace` attribute in the [configuration file](/docs/usage/application-declaration/):

```bash
pm2 start api.js    --namespace backend
pm2 start worker.js --namespace backend
```

Every command that accepts a process name also accepts a namespace, so you can act on the whole group at once:

```bash
pm2 restart backend
pm2 stop backend
pm2 logs backend
```

## How do I get a diagnostic report about my PM2 installation?

```bash
pm2 report
```

It prints a full report — PM2, Node.js and OS versions, daemon state and the process list. Attach it when [opening an issue](https://github.com/Unitech/pm2/issues).

## How do I start or reload applications in a CI/CD pipeline?

```bash
pm2 startOrReload ecosystem.config.js
pm2 save
```

`pm2 startOrReload` starts the applications if they are not running and performs a **zero-downtime reload** if they are, making deployments idempotent: the same command works on the first deploy and on every update. `pm2 startOrRestart` does the same with a hard restart. Follow it with `pm2 save` so the new process list survives a reboot.
