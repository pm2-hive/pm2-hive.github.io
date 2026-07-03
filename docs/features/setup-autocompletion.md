---
layout: docs
title: Setup Auto Completion
description: Enable shell auto-completion for PM2 commands and arguments in bash and zsh with the pm2 completion command.
permalink: /docs/usage/auto-completion/
last_modified_at: 2026-07-03
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
