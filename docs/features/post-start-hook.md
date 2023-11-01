---
layout: docs
title: Post-start hooks
description: Running a hook after an application is (re)started
permalink: /docs/usage/post-start-hooks/
---

PM2 supports running a hook after an application is (re)started. This can be useful for a variety of purposes, such as:
- Retrieving secrets from a vault system and deliver them to the application
- Registering the app instance with a service discovery registry
- Custom metrics collection

The hook is a javascript function that is executed by PM2 after the app is started.
It is executed in the PM2 daemons runtime environment and will receive information about the running app such as PID, name and environment variables.
If it needs to communicate with the app it can do so using its stdin/stdout/stderr file descriptors.

## Configuration
The hook is configured in the `ecosystem.config.js` (or equivalent) file, through the `post_start_hook` property of the app configuration object.

```javascript
module.exports = {
  name: 'app',
  script: 'app/app.js',
  post_start_hook: 'hooks/post-start-hook.js'
}
```

The property must point to a javascript file whose main export is the hook function.

## The hook function
The hook function will be invoked with two arguments: an object containing information about the app,
and a plain-old Node style callback that must be called when the hook is finished.
```javascript
/**
 * This is a post-start hook that will be called after an app started.
 * @param {object} info
 * @param {number} info.pid The apps PID
 * @param {Stream} info.stdin The apps STDIN stream
 * @param {Stream} info.stdout The apps STDOUT stream
 * @param {Stream} info.stderr The apps STDERR stream
 * @param {object} pm2_env The apps environment variables
 * @returns {void}
 */
module.exports = function hook(info, cb) {
  console.log(`post-start hook for app ${info.pm2_env.name} with pid ${info.pid}`);	
  cb(null);
};
```

Any output produced by the hook will be logged to the PM2 log file.

## The hooks runtime environment
The hook is loaded into the PM2 daemons runtime environment using `require()`. This has some implications:
- If multiple apps use the same hook, they will share the same instance of the hook function, and any state that it might have.
- Changes to the hook itself will not be picked up until the PM2 daemon is restarted.
