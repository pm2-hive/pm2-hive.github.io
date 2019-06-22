---
layout: docs
title: Production Setup with Nginx
description: Production Setup with Nginx
permalink: /docs/tutorials/pm2-nginx-production-setup
---

## Nginx as a HTTP proxy

This is a common method to use NGINX as a HTTP proxy front of PM2.
NGINX will allow to serve static files rapidly, manage the SSL protocol and redirect the traffic to your Node.js application.

Here is an example for a Node.js application listening on port 3001 and NGINX forwarding the traffic from port 80 to 3001. This sample also handle Websocket connections.

nginx.conf:

```
upstream my_nodejs_upstream {
    server 127.0.0.1:3001;
    keepalive 64;
}

server {
    listen 443 ssl;
    
    server_name www.my-website.com;
    ssl_certificate_key /etc/ssl/main.key;
    ssl_certificate     /etc/ssl/main.crt;
   
    location / {
    	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    	proxy_set_header Host $http_host;
        
    	proxy_http_version 1.1;
    	proxy_set_header Upgrade $http_upgrade;
    	proxy_set_header Connection "upgrade";
        
    	proxy_pass http://my_nodejs_upstream/;
    	proxy_redirect off;
    	proxy_read_timeout 240s;
    }
}
```

Learn more on these options on the [Nginx docs](http://nginx.org/en/docs/http/websocket.html)! Once you have this, all you will need is a PM2-linked Node.js server running on the port `3001` and you'll have a production-ready HTTP server!
