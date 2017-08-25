---
layout: docs
title: One page documentation
description: One page documentation
permalink: /docs/usage/pm2-doc-single-page/
---

<div align="center">
  <a href="http://pm2.keymetrics.io">
    <img width=710px src="https://github.com/unitech/pm2/raw/master/pres/pm2.20d3ef.png">
  </a>

<br/>
<b>P</b>(rocess) <b>M</b>(anager) <b>2</b>
<br/><br/>

 <a href="https://www.bithound.io/github/Unitech/pm2">
 <img src="https://www.bithound.io/github/Unitech/pm2/badges/score.svg" alt="bitHound Score">
</a>

<a href="https://www.npmjs.com/package/pm2">
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/pm2.svg?style=flat-square"/>
</a>

<a href="https://travis-ci.org/Unitech/pm2">
  <img src="https://travis-ci.org/Unitech/pm2.svg?branch=master" alt="Build Status"/>
</a>


<br/>
<br/>
</div>

PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks.

Starting an application in production mode is as easy as:

```bash
pm2 start app.js
```

PM2 is constantly assailed by [more than 700 tests](https://travis-ci.org/Unitech/pm2).

Official website: [http://pm2.keymetrics.io](http://pm2.keymetrics.io)

Works on Linux (stable) & MacOSx (stable) & Windows (bêta).

[![NPM](https://nodei.co/npm/pm2.png?downloads=true&downloadRank=true)](https://nodei.co/npm/pm2/)

## Install PM2

```bash
npm install pm2 -g
```

*npm is a builtin CLI when you install Node.js - [Installing Node.js with NVM](https://keymetrics.io/2015/02/03/installing-node-js-and-io-js-with-nvm/)*

## Start an application

```bash
pm2 start app.js
```

Your app is now put in background, monitored and kept alive forever.

[More about Process Management](http://pm2.keymetrics.io/docs/usage/quick-start/#cheat-sheet)

## Module system

PM2 embeds a simple and powerful module system. Installing a module is straightforward:

```bash
pm2 install <module_name>
```

Here are some PM2 compatible modules (standalone Node.js applications managed by PM2):

[**pm2-logrotate**](https://github.com/pm2-hive/pm2-logrotate) auto rotate logs of PM2 and applications managed<br/>
[**pm2-webshell**](https://github.com/pm2-hive/pm2-webshell) expose a fully capable terminal in browsers<br/>
[**pm2-autopull**](https://github.com/pm2-hive/pm2-auto-pull) auto pull all applications managed by PM2<br/>

[How to write a module](http://pm2.keymetrics.io/docs/advanced/pm2-module-system/)
