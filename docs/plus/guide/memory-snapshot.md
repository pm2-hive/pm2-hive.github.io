---
layout: docs
title: Memory Snapshot | Guide | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/guide/memory-snapshot/"
description: "This feature help you diagnose memory issues in your application."
---

# Overview

![memory snapshot]({{ site.baseurl }}{% link img/plus/memory-profiling.png %})

This feature help you diagnose memory issues in your application.

PM2 Plus allows you to take remote heap memory snapshots of your applications and provide you visualization tools.

**WARNING**: There are few bugs in V8 (the engine that runs the javascript in Node.js) that can impact your applications when you are doing a memory snapshot. Specially if you use it in applications with large memory (>800MB of RAM). You should avoid running it in those cases.

## How to use

In order to use the memory snapshot, you must first [install the snapshot tool]({{ site.baseurl }}{% link docs/plus/guide/installation.md %}#install-cpumemory-profiling).

Click to take a heapdump and download the file. It may take some time depending on the weight of the heap file.

Inspect with the Google Chrome developer tool into the Profiles tab (**Load** button).

### Tracking memory leaks

To track memory leak you will need to compare multiple heapdump files to see which element is increasing over time.

To know more about memory analysis check the [chrome devtools tutorial](https://developer.chrome.com/devtools/docs/heap-profiling).

## Next Steps

[CPU Profiling]({{ site.baseurl }}{% link docs/plus/guide/cpu-profiling.md %})
{: .btn-stylized}
