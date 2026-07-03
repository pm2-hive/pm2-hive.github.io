---
layout: docs
title:  Snippet API | Frontend Monitoring | PM2 Enterprise Documentation
menu: starter
lang: en
section: enterprise
permalink: "/docs/enterprise/frontend-monitoring/snippet-api/"
description: "Once installed, you will be able to configure how your Website is monitored via the apm object. The apm object is only accessible through the pm2Ready…"
---

# Frontend Monitoring snippet API

Once [installed](../install/), you will be able to configure how your Website is monitored via the
`apm` object.  The `apm` object is only accessible through the `pm2Ready` function exposed by the
snippet.

## `pm2Ready(callback)`

The callback function will be called when the PM2 APM will be ready (or immediately if it is already
ready).  The callback will receive the `apm` object as first argument.  Usage example:
```js
pm2Ready(apm => {
  apm.setMeta('user', user.email)
})
```

## `apm.setBucket(bucketId)`

Set your bucket id.  This will be used to authenticate and store the data transmitted by the browser
APM.

### `apm.setApplication(applicationName)`

Set your application name.  This will be used to authenticate and store the data transmitted by the
browser APM.

### `apm.setMeta(name, value)`

Attach a custom meta value to all data sent by the browser APM.  For example, this can be used to
identify the current logged-in user, or your application release version.  Example:

```js
apm.setMeta('user', user.email)
```

### `apm.removeMeta(name)`

Remove a meta from future data packets.

### `apm.addIgnoreURLRule(rule)`

Add a rule to ignore some URLs.  The `rule` parameter should be a function taking the string URL as
argument, and returning a boolean reflcting whether this URL should be ignored or not.

This is used in multiple ways:

* If the current docs location is ignored, no data will be collected at all.
* If an issue is caused by a script loaded from an ignored location, the issue won't be reported.
* This rule also applies to slow HTTP queries warnings.

Example:
```js
apm.addIgnoreURLRule(url => {
  // Ignores anything coming from Google Analytics
  return url.startsWith("https://www.google-analytics.com/")
})
```

### `apm.reportTimings()`

Automatically report various metrics from the current docs.  It will track the time your docs takes
to load, among other performance metrics.

### `apm.reportIssues(options)`

Automatically report unexpected issues triggered during the users sessions.  It will capture
uncaught JS exceptions to help you improve your user experience.

#### `options.recordSessions`

By default, the user session will be recorded to add some context to issues.  You will be able to
replay the last actions done by the user in your PM2 Enterprise dashboard.  To desactivate this
feature, pass `recordeSessions: false`.

You can configure how the session is recorded by passing an object to this option.  To prevent some
information from being recorded, you have two options:

* By default, an element with the class name `.pm2-block` will not be recorded. Instead, it will
  be seen as a placeholder with the same dimension.  You can change this class name by passing
  another one or a `RegExp` to `recordSessions.blockClass`.

* By default, an element with the class name `.pm2-ignore` will not record its input events.
  Password inputs will be ignored as default. You can change this class name by passing another
  one to `recordSessions.ignoreClass`.

Example:

```js
apm.reportIssues({
  recordSessions: {
    blockClass: 'my-block-class',
    ignoreClass: 'my-ignore-class'
  }
})
```

### `new apm.ZipkinLogger()`

Create a [Zipkin](https://zipkin.io/) logger to send distributed traces started from your website
frontend.  See the [zipkin-js
documentation](https://github.com/openzipkin/zipkin-js/blob/master/README.md) for further
informations.  Usage example:

```js
const tracer = new Zipkin.Tracer({
  ctxImpl: new Zipkin.ExplicitContext(),
  recorder: new Zipkin.BatchRecorder({
    logger: new apm.ZipkinLogger()
  }),
  localServiceName: 'service-a'
})
```
