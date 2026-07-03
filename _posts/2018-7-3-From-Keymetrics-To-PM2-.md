---
layout: post
title: From Keymetrics to PM2+
description: It's been an amazing journey to build Keymetrics and PM2 through the last 5 years. I've started to create PM2 when Node.js was at the beginning of its fame, then Keymetrics was built a year after
tags: product
---

It's been an amazing journey to build Keymetrics and PM2 through the last 5 years. I've started to create PM2 when Node.js was at the beginning of its fame, then Keymetrics was built a year after.

I would like to say **THANK YOU**, to all of you, users, customers, teammates, maintainers, contributors for having made these softwares reach this height.

Both PM2 and Keymetrics were honestly the greatest technical, human and organizational challenge I’ve been confronted to.

PM2 shows today amazing metrics, more than [55 million downloads](http://map.keymetrics.io/), 100k daily downloads, 25k stars. Keymetrics counts more than 1000 customers and 18.000 Node.js applications monitored.

## Keymetrics

Keymetrics was created one year after the creation of PM2. The idea came after asking to the whole PM2 user base: "what was their pain?" and they told me that an easy-to-use monitoring application would relieve them.

So I've started prototyping the solution built on top of PM2. At that time the mainstream technology was Angular 1.x. After 4 months of development, this was the very first version of Keymetrics:

Along the increase of the PM2 and Node.js adoption, I continued working on Keymetrics and raised the first $150k dollars from a french fund called Kima Venture. This allowed me to constitute the first Keymetrics team and increase effort on both PM2 and Keymetrics.

Today you are currently using the same technologic base that I‘ve started 3 years ago. The interface has improved a lot since day one and the current interface looks like this:


## PM2+

Our team has grown up from 4 to 15 people now. We have learned to work together to maintain a complex product at scale, and today we are excited to announce our new product, PM2 +

Why PM2+?

First of all, Keymetrics.io has always been tightly linked to PM2 and PM2 has gained a traction I would never expect. 4 years ago, I could not figure out that PM2 would become our flagship product in such proportions.

We really wanted to focus on providing more than just a standard monitoring solution. We want our users to be able to interact with its applications and not just overview them. The custom actions, server or app restarts, in few words, this interaction philosophy is symbolised by PM2.

And finally, the technology landscape has changed, the current Keymetrics interface coded in Angular 1.x was not a solid foundation for the future of our product.

That's why we decided, back early 2018, to re-build many part of the software:

* New interface developed in Vue.js
* Refactor of the pmx library in typescript and rename to @pm2/io
* New version of PM2 Runtime (soon to be announced)
* Separated agent from the PM2 Runtime
* New communication protocol in Websocket instead of raw TCP

**And we are proud to tell you, customers, that you will benefits from all this upgrade and product without having any extra free.**

## New pages

Let me give you some preview of the interface before sharing the link to you ;)

### Dashboards

You have now two pages to get an overview of your Node.js infrastructure.

#### Raw List Page

The famous real-time overview from Keymetrics.io has been rebuilt:



#### Application Overview

A new Application Overview page is now available giving you insights on each application:

### Exception Page

We've revamped the exception page, to track down bugs faster:

### CPU Flamegraph

To give you deeper insight on where CPU usage is spent:

### Memory Snapshots Visualization

Previously in Keymetrics.io we were only enabling you to retrieve memory snapshot from production. Now you can both download the memory snapshot but also vizualize how the memory is fragmented and used:

### Transaction Tracing

The transaction tracing page has been rebuilt giving you important insights rapidly:

We've also started a new refactor of the transaction tracing system. Stay tuned!

## Migrating from Keymetrics to PM2+

Good news. You might know it but we always valued the _0 breaking change philosophy_. That's why the migration to the new interface is a painless process. No need to re-link PM2 to PM2+.

BUT we recommend you to upgrade to the latest PM2 to benefit from many internals improvements.

You will still be able to switch between the Keymetrics.io and PM2+ interface seamlessly.

## Conclusion

Here is the link to start using the new interface:

We're proud to see Node.js getting such adoption world wide and we are willing to support companies making the Node.js choice.

Stay tuned on the release of our future tools.
