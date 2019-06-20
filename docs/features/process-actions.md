---
layout: docs
title: Process Actions
description: Trigger functions from CLI
permalink: /docs/usage/process-actions/
---

## Process Actions

By plugging process actions onto your code, you will be able to trigger them via the PM2 CLI.

First make sure you added the library pmx to your code:

```bash
npm install @pm2/io
```

Then in your code:

```javascript
var pmx = require('@pm2/io');

pmx.action('hello', function(reply) {
  reply({ answer : 'world' });
});

setInterval(function() {
  // Keep application online
}, 100);
```

Start the application with PM2. To trigger process actions, use the command:

```bash
pm2 trigger <application-name> <action-name>
```

![process actions](/images/processactions-trigger.png)

You can also list all available process actions:

```bash
pm2 show <application-name>
```

![process actions](/images/processactions.png)

### Passing a parameter

To pass a parameter to the remote function, just add the `param` attribute to the callback:

```javascript
var pmx = require('@pm2/io');

pmx.action('world', function(param, reply) {
  console.log(param);
  reply({success : param});
});
```

Restart your application and call this process function with PM2:

```bash
pm2 trigger <application-name> <action-name> [parameter]
```
