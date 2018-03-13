# npm-registry-browser/notes

Bellow, you will find some notes I took along the way.

## Table of Contents

* `create-react-app related`
  * [Error npm test on MacOs Sierra](#error-npm-test-on-macos-sierra)
* [React specific](#react-specific)
* [Miscellaneous](#miscellaneous)
  * [CORS anywhere development proxy](#cors-anywhere-development-proxy)

## create-react-app related

### Error npm test on MacOs Sierra

Due to the following error:

```
> react-scripts test --env=jsdom
Determining test suites to run...2016-10-07 11:38 node[873] (FSEvents.framework) FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
2016-10-07 11:38 node[873] (FSEvents.framework) FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
events.js:160
      throw er; // Unhandled 'error' event
      ^

Error: Error watching file for changes: EMFILE
    at exports._errnoException (util.js:953:11)
    at FSEvent.FSWatcher._handle.onchange (fs.js:1400:11)
npm ERR! Test failed.  See above for more details.
```

I installed [watchman](https://facebook.github.io/watchman/docs/install.html), which solved the problem ([known problem on MacOS](https://github.com/facebook/create-react-app/issues/871)).

Note: `create-react-app` doesn't rely on the latest version `jest` (currently `jest@20.0.4`). This [should be resolved](https://github.com/amasad/sane/pull/91) for more recent versions.

## React specific

## Miscellaneous

### CORS anywhere development proxy

The npm registry doesn't return any CORS headers nor can it be called with jsonp. So any in-browser XHR request will be blocked.

I made a little script that will proxy any request, adding those CORS headers to the response. It is automatically launched on `npm start`.

Note: `./bin/cors-anywhere.js` is for development purpose only, it may not be suited for production.
