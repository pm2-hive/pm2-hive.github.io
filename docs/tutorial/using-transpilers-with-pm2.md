---
layout: docs
title: Best practices for using transpilers with pm2
description: How to use babel, coffescript, typescript etc. with pm2
permalink: /docs/tutorials/using-transpilers-with-pm2
---

# Using transpilers with pm2

## The production way

If you want to share, bundle, pack or deploy your code base, it's often better to use plain old Javascript (VanillaJS). This means that you'll have a pre-processing of your code, and that you'll then execute a Javascript entrypoint.

For example, a usual directory structure will look like this:

```
├── src
├── dist
└── package.json
```

Where `src` contains es6 , coffescript, or whatever and `dist` is the transpiled Javascript. 
This is now easy to setup with pm2, as it'll launch Javascript without any configuration.

But, when writing code, this'll be harder to configure. Say that you want to watch and restart, you'll have to watch, transpile, restart. Pm2 is not a build system nor a task runner, so prefer the second way.

## The development way

This might work just fine on a production workflow, but I don't advise it. Bundling code is safer, this will slower the script start process and the cluster mode might not be available.

### Execution interpreter

The easiest way to use transpilers with pm2 is to override the execution interpreter (`exec_interpreter`). Note that if this is changed, your code will **only** work in `fork_mode` ([check here for differences between fork modes](http://stackoverflow.com/a/36177256/1145578)).

To do so, specify the `--interpreter` option through CLI or the `exec_interpreter` option through json configuration.

#### Coffee-script

```
#- npm install -g coffee-script
#- pm2 start --interpreter coffee index.coffee
```

Just add `--watch` and you've a daemonized coffee script that'll restart on file changes.

#### Babel

```
#- npm install -g babel-node
#- pm2 start --interpreter babel-node index.es6
```

Remember that those will only work with the `fork_mode`, if you want to run a pm2 cluster, please see the alternative below.

### Require hook

This is my favorite option, because it'll run as standard Javascript by registering the transpiler inside the code. Most of those will actually change node internal's `require`, or tweak the `module` module so that the required script is transpiled before it's interpreted (example [babel](https://github.com/babel/babel/blob/93e5c0e64b1a14f3b138a01c55082225084f47b4/packages/babel-register/src/node.js#L104) or [coffee](https://github.com/jashkenas/coffeescript/blob/master/lib/coffee-script/register.js#L16)).

*This workaround could be considered more as a hack than an actual solution because of this. Keep it mind that it will slow down the script startup*

To make it work, just prepare an entrypoint in plain Javascript which will call the require hook before including the non-transpiled source.

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
