---
layout: docs
title: FAQ
description: Frequently Asked Questions and Answers
permalink: /docs/faq/
---

## 1. I can't connect my local PM2 to the PM2.io dashboard

If you are in this situation, it might be for several reasons.

- You are behind a company proxy or firewall. 

Make sure the 443 port is opened and/or set the proxy config:
`PM2_PROXY=<proxy-address> pm2 link <secret> <public>`

- You are using a old PM2 version. Update PM2 to latest: `npm install pm2@latest -g`

- You have concurrent PM2 sending data to the same bucket with an identical server name.
Make sure you have only one PM2 instance launched `ps -aux | grep PM2`

- Refresh your connection to Keymetrics. `pm2 link stop` then `pm2 link start`. Also don't forget to refresh the dashboard itself, it might help sometimes.

## 2. The versioning buttons (Rollback/Pull/Upgrade) aren't working

- If the buttons are disabled, make sure that the `Local changes` and `Local commit` indicators are green.

- If you get a warning `Not authorized` when trying to perform such actions, it means you have not the admin privileges in this bucket.

- If none of the above happens, but the procedure just hangs, make sure you have a recent version of Node.js as well as the latest version of PM2.

- Also, your repository should not ask for a password input (it means you must clone it via ssh), try typing `git remote update` manually in the folder and see if it asks for a password or not.
