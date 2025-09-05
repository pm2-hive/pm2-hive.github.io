---
layout: docs
title: FAQ
description: Frequently Asked Questions and Answers
permalink: /docs/faq/
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
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
    }
  ]
}
</script>

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
