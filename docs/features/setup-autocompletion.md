---
layout: docs
title: Setup Auto Completion
description: Auto complete commands and arguments with PM2
permalink: /docs/usage/auto-completion/
---

## CLI completion

Tab-completion for PM2:

```bash
pm2 completion install
```

Or manually append completion script to your ~/.bashrc or ~/.zshrc file:

```bash
pm2 completion >> ~/.bashrc # or ~/.zshrc
```

Then source your .bashrc or .zshrc file for current session:

```bash
source ~/.bashrc # or ~/.zshrc
```

You can add pm2 completion to your current session this way:

```bash
. <(pm2 completion)
```
