---
layout: docs
title: Metrics Glossary | Best Practices | PM2 Plus Documentation
menu: starter
lang: en
section: plus
permalink: "/docs/plus/best-practices/metrics-glossary/"
description: "This glossary is an exhaustive list of all metrics recorded by PM2 Plus. Understand what a metric stands for and how it is computed will avoid you to draw…"
---

# Metrics Glossary

This glossary is an exhaustive list of all metrics recorded by PM2 Plus. Understand what a metric stands for and how it is computed will avoid you to draw conclusions too quickly.   

Note that each metric always describes the state of a specific application on a specific server. You may find some cross server metrics on the dashboard, to suggest on which application you could use the profiling for example, but in most cases, metrics are application and server specific.

## CPU Usage

The CPU usage is the amount of time the CPU is busy. A CPU only can handle one operation at a time and so is either busy or idle.

Unit: %  
Range of values: 0 - 100

## Memory Usage

The memory usage is the total amount of memory used by the application.  

Unit: Megabytes (MB)  
Range of values: 0 - total memory of the server

## Issues

The number of new issues recorded in the app.

## Number of restart

The number of restart of your application since added to the PM2 process list. PM2 automatically restarts your application whenever needed, for example after an uncaught exception has happened.

## Number of processes

The number of cluster on which your app has been spread on the server. Only PM2 clusters appear. 

## HTTP Requests per Minutes

Unit: Number of requests / minutes

## Loop Delay

Unit: milliseconds (ms)
Range: 0 - less than 100ms

The time the Node.js event loop takes to complete a loop.

## Active Handles

Handles represent long-lived objects capable of performing certain operations while active. Some examples:

- A prepare handle gets its callback called once every loop iteration when active.
- A TCP server handle that gets its connection callback called every time there is a new connection.

## Active Requests

Requests represent short-lived operations. These operations can be performed over a handle: write requests are used to write data on a handle; or standalone: getaddrinfo requests don’t need a handle they run directly on the loop.

## Node.js Memory

## New space used size

## Old space used size

## Map space used size

## Code space used size

## Large object space used suze

## Heap size

## Heap size executable

## Used heap size

## Heap size limit

## Garbage Collector

## GC heap size

## GC executable heap size

## GC used heap size

## GC type

## Gc Pause
