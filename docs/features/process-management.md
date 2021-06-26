---
layout: docs
title: Process Management
description: Process Management
permalink: /docs/usage/process-management/
---

## Managing applications states

With PM2 you can easily start/restart/reload/stop/list applications in background.

### Start
  
Start an application

```bash
pm2 start api.js
```

When managing multiple application at the same time, you can use a [configuration file](/docs/usage/application-declaration/).

### Restart

To restart an application:

```bash
pm2 restart api
```

If you want to update environment variables of your application, do not forget to add the option `--update-env`

```bash
NODE_ENV=production pm2 restart web-interface --update-env
```

### Stop

To stop a specified application:

```bash
pm2 stop api
```

Note: this will not delete the application from PM2 application list. See next section to delete a an application.

### Delete 

To stop and delete an application:

```bash
pm2 delete api
```

## Listing Applications

To list all running applications:

```bash
pm2 list
# Or
pm2 [list|ls|l|status]
```

To specify which order you want the application to be listed:

```bash
pm2 list --sort name:desc
# Or
pm2 list --sort [name|id|pid|memory|cpu|status|uptime][:asc|desc]
```

### Showing application metadata

To display metadata about an application:

```bash
pm2 show api
```

![image](https://user-images.githubusercontent.com/757747/123510635-fafb6400-d67c-11eb-8534-0ce6106979b2.png)


### Reset restart count

To reset the restart counter:

```bash
pm2 reset all
```
