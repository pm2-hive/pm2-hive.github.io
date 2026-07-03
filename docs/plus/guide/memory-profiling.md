---
layout: docs
title: Memory Profiling | Guide | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/guide/memory-profiling/"
description: "Profiling tools help you diagnose memory issues in your application."
---

# Memory profiling

![memory profiling]({{ site.baseurl }}{% link img/plus/memory-profiling.png %})

Profiling tools help you diagnose memory issues in your application.

PM2 Plus allows you to take remote heap memory snapshots of your production servers and provide you visualization tools.

## Memory profiling

In order to use the memory profiling, you must first [install the profiling tool]({{ site.baseurl }}{% link docs/plus/guide/installation.md %}#install-cpumemory-profiling).

Click to take a heapdump and download the file. It may take some time depending on the weight of the heap file.

Inspect with the Google Chrome developer tool into the Profiles tab (**Load** button).

### Tracking memory leaks

To track memory leak you will need to compare multiple heapdump files to see which element is increasing over time.

To know more about memory analysis check the [google tutorial](https://developer.chrome.com/devtools/docs/heap-profiling).

## Next Steps

[CPU Profiling]({{ site.baseurl }}{% link docs/plus/guide/cpu-profiling.md %})
{: .btn-stylized}
