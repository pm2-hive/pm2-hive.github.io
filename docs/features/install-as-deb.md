---
layout: docs
title: Install as .deb
description: Install PM2 as .deb via apt-get on Ubuntu LTS
permalink: /docs/usage/install-as-deb/
---

If you just want a fresh install of PM2 without setting up Node.Js, pm2 is avalaible as a `.deb` package!

It is built to work with the lastest Long Term Support release of ubuntu.

## Installation

```bash
# 1. Add the PM2 repository signing key
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv D1EA2D4C

# 2. Add the PM2 repository
echo "deb http://apt.pm2.io/ubuntu stable main" | sudo tee /etc/apt/sources.list.d/pm2.list

# 3. Update list of available packages
sudo apt-get update

# 4. Install PM2
sudo apt-get install pm2
```
