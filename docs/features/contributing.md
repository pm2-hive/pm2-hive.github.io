---
layout: docs
title: Contributing
description: Contributing to PM2
permalink: /docs/usage/contributing/
---

## Contributing/Development mode

It's very simple to play with PM2:

```bash
pm2 kill   # kill the current pm2
git clone my_pm2_fork.git
cd pm2/
DEBUG=* ./bin/pm2 --no-daemon
```

Each time you edit the code, be sure to kill and restart PM2 to make changes taking effect.


**DEBUG="*"** Allows to display all possible debug logs in ~/.pm2/pm2.log

## Install PM2 development

```bash
npm install https://github.com/Unitech/pm2#development -g
```

## Launch the tests

Master: [![Build Status](https://img.shields.io/travis/Unitech/pm2/master.svg?style=flat-square)](https://travis-ci.org/Unitech/pm2)

Dev   : [![Build Status](https://img.shields.io/travis/Unitech/pm2/development.svg?style=flat-square)](https://travis-ci.org/Unitech/pm2)

Just try the tests before using PM2 on your production server:

```bash
git clone https://github.com/Unitech/pm2.git
cd pm2
npm install  # Or do NODE_ENV=development npm install if some packages are missing
npm test
```

If a test is not correctly working, please report issues [here](https://github.com/Unitech/pm2/issues?state=open).
You should also make sure that you have all dependencies needed. 
For Ubuntu:

```bash
sudo apt-get install build-essential
# nvm is a Node.js version manager - https://github.com/creationix/nvm
wget -qO- https://raw.github.com/creationix/nvm/master/install.sh | sh
nvm install 4
nvm use 4
```
