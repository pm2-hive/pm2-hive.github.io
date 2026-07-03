---
layout: none
title: Stateless Application | Best Practices | PM2 Documentation
menu: starter
lang: en
section: runtime
permalink: "/docs/runtime/best-practices/stateless-application/"
description: "A stateless application has no local data stored in the process. For example, sessions/websocket connections, session-memory and related."
sitemap: false
redirect_to: "/docs/usage/cluster-mode/"
---

# Stateless Application

A stateless application has no local data stored in the process. For example, sessions/websocket connections, session-memory and related.

You must use Redis, Mongo or other databases to share all states between processes.

A useful resource on how to write efficient, production ready stateless application is The Twelve Factor Application manifesto: <https://12factor.net/>




