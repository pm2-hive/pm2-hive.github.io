---
layout: docs-io
title: FAQ | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/faq/"
description: "What is a process? A process represent one Node.js application instance. For example let's say you have one API application that is scaled across 4…"
---

# FAQ & Troubleshooting

## Process-based pricing

<details>
<summary markdown="span">What is a process?</summary>
A process represent one Node.js application instance. For example let's say you have one API application that is scaled across 4 servers, if there is only one instance running on each server it will count as 4 servers * 1 process = 4 processes.
</details>

<details>
<summary markdown="span">What is a server?</summary>
A server represents one linked PM2 instance. You can have as much server as you want, only the total number of processes is taken into account for the pricing.
</details>

<details>
<summary markdown="span">How does the pricing works?</summary>
If you have a pro_8 plan, you can have 8 processes monitored.

You can have 8 servers with 1 process on each or 1 server with 8 processes. Only the sum of all processes monitored is taken into account.
</details>

<details>
<summary markdown="span">How does a clustered application get priced?</summary>
When you use the cluster mode (with `pm2 start -i max`) each instance is counted as a process and the same rule is applied. If you start 4 instances of the same application, 4 processes are counted.
</details>

<details>
<summary markdown="span">How to disable monitoring for a specific process?</summary>
You can then use the command `pm2 unmonitor [APP_NAME|ID]` to stop monitoring a process with PM2 Plus.
`pm2 ls` will display a red dot indicating the application will not be monitored by PM2 Plus.
If you want to monitor the process again use `pm2 monitor [APP_NAME|ID]`.
</details>

<details>
<summary markdown="span">Do pm2-logrotate and pm2-auto-pull count has paying processes?</summary>
No, these two modules are free and are not counted has paying processes.
</details>

## Connectivity Issues

<details>
<summary markdown="span">Re link your PM2</summary>
Re-Run `pm2 link` on your server and refresh your browser.
</details>

<details>
<summary markdown="span">How to pass through firewall? (IP whitelisting & Ports)</summary>
  
Starting from PM2 3.2, we changed the networking connection by using a direct Websocket connection to our server on the port 443, so you only need OUTBOUND on port 443 TCP open. If you are using an older version, we of course advise to update but the ports that you need to open are 3900 (TCP outbound), 443 (HTTPS outbound) and 43554 (TCP outbound), so verify everything is allowed on your firewall.

You also may need to whitelist IPs, please allow those listed here: [https://ips.cloud.pm2.io](https://ips.cloud.pm2.io)
</details>

<details>
<summary markdown="span">Have you upgraded to the lastest PM2 available?</summary>
[Updating PM2](/docs/runtime/guide/installation/#update)
</details>

## Dashboard Issues

<details>
<summary markdown="span">Servers are blinking/flickering?</summary>
Make sure that each PM2 runtime has a different name when linking to PM2 plus via:

```
$ pm2 plus xxxx yyyy [SERVER_NAME]
````

Also make sure you have only one PM2 instance launched `ps -ax | grep PM2`
</details>

## Security & Data Transfer

<details>
<summary markdown="span">What information is sent from PM2 runtime to PM2 plus?</summary>
- **Process**: pm_id, pid, app name, restart_time, created_at, watch mode, uptime, cpu, memory, NODE_ENV, versioning informations, custom actions, custom metrics
- **Server**: Hostname, internal ip, server_name, load average, free mem, used mem, cpu infos, username, platform, pm2_version, pm2_agent_version, node version
</details>

<details>
<summary markdown="span">How is the data transfered from PM2 runtime to PM2 plus?</summary>
Data is ciphered while transfered into network (HTTPS and AES256). Data stored in database is normalized but each bucket has his own database (with database name ciphered).
</details>

<details>
<summary markdown="span">What is the PM2 plus credit card processor?</summary>
We use Stripe as our payment system, we never store any informations about credit cards used on PM2 plus.
</details>

## Billing and settings Issues

<details>
<summary markdown="span">How to transfer ownership of a bucket?</summary>
To Transfer ownership, you must create a free account with the next owner email and add credit card details.

Then with the current owner email, you must connect to the concerned bucket and in the Settings menu, in General, you must click on the Action TRANSFER OWNERSHIP and enter the next owner email.

The new owner will be notified by email and the bucket will be from now on locked to his email and credit card details as the owner.
To fix this:

```
# Server 1
$ pm2 link <private_id> <public_id> server1

# Server 2
$ pm2 link <private_id> <public_id> server2
```
</details>
