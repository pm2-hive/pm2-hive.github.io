---
layout: docs
title:  Installation | Frontend Monitoring  | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
permalink: "/docs/enterprise/frontend-monitoring/install/"
description: "First, connect to your PM2 Enterprise dashboard. Go to your bucket, and click on Frontend at the top of the docs."
---

# Frontend Monitoring installation

First, connect to your PM2 Enterprise dashboard.  Go to your bucket, and click on **Frontend** at the top of the docs.

![Frontend monitoring menu]({{ site.baseurl }}{% link img/enterprise/frontend-1.png %})

Fill in the small form, by giving your application a name (you will be able to create multiple applications within your dashboard), and listing the domains your application will be accessible from.  Make sure to put your main domain first.  Enable Webchecks if you want deeper metrics gathered from your main domain.

![Frontend monitoring wizard - form]({{ site.baseurl }}{% link img/enterprise/frontend-2.png %})

After submiting the form, the app will generate an HTML snippet.  Just copy and paste it in your Website, just before the `</body>` tag.

![Frontend monitoring wizard - snippet]({{ site.baseurl }}{% link img/enterprise/frontend-3.png %})

That's it! your Website is starting to be monitored by PM2, and you will see data incoming in realtime.

