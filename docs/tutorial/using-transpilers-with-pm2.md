---
layout: docs
title: Using transpilers with PM2
description: How to use babel, coffescript, typescript etc. with pm2
permalink: /docs/tutorials/using-transpilers-with-pm2
---

## Using transpilers with PM2

## The production way

If you want to share, bundle, pack or deploy your code base, it's often better to use plain old Javascript (VanillaJS). This means that you will have a pre-processing version of your code, and that you will then execute a Javascript entrypoint.

For example, a usual directory structure will look like this:

```
├── src
├── dist
└── package.json
```

Where `src` contains es6 , coffescript, or whatever and `dist` is the transpiled Javascript. 
This is now easy to setup with PM2, as it will launch Javascript without any configuration.

However, when writing code, it might make it harder to configure. Say that you want to watch and restart. You will have to watch, transpile, restart. PM2 is not a build system nor a task runner, so we advise you to prefer the second way.

## The development way

This might work just fine on a production workflow even though we would not recommend it. Bundling code is safer, this will make the script start process slower and the cluster mode might not be available.

### Execution interpreter

The easiest way to use transpilers with PM2 is to override the execution interpreter (`exec_interpreter`). Note that if this is changed, your code will **only** work in `fork_mode` ([check here for differences between fork modes](http://stackoverflow.com/a/36177256/1145578)).

To do so, specify the `--interpreter` option through the CLI or the `exec_interpreter` option through json configuration.

#### Coffee-script

```
#- npm install -g coffee-script
#- pm2 start --interpreter coffee index.coffee
```

Just add `--watch` to have a daemonized coffee script that will restart on file changes.

#### Babel

```
#- npm install -g babel-cli
#- pm2 start --interpreter babel-node index.es6
```

Remember that those commands will only work in `fork_mode`. If you want to run a PM2 cluster, please refer to the alternative below.

### Require hook

This is my favorite option. It will run as standard Javascript by registering the transpiler inside the code. Most of those will actually change the node internal's `require`, or tweak the `module` so that the required script gets transpiled before it is interpreted (example [babel](https://github.com/babel/babel/blob/93e5c0e64b1a14f3b138a01c55082225084f47b4/packages/babel-register/src/node.js#L104) or [coffee](https://github.com/jashkenas/coffeescript/blob/master/lib/coffee-script/register.js#L16)).

*This workaround could be considered more as a hack than an actual solution. Keep in mind that it will slow down the script startup.*

To make it work, prepare an entrypoint in plain Javascript which will call the require hook before including the non-transpiled source.

#### Coffee-script

```
# server.js
require('coffee/register');
require('./server.coffee');
```

#### Babel

```
require('babel-register');
require('./server.es6');
```

Check out the [babeljs documentation](https://babeljs.io/docs/usage/require/) for more options.

Then, all you have to do is start the script `pm2 start server.js`. As this will use the `node` interpreter, the cluster mode will work as expected.
