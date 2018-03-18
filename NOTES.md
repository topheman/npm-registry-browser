# npm-registry-browser/notes

Bellow, you will find some notes I took along the way.

## Table of Contents

* `create-react-app related`
  * [Error npm test on MacOs Sierra](#error-npm-test-on-macos-sierra)
  * [API proxy for development](#api-proxy-for-development)
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

### API proxy for development

The `registry.npmjs.org` doesn't return CORS headers, so we need some mechanism like [CORS anywhere development proxy](#cors-anywhere-development-proxy). Thankfully, `create-react-app` ships with that kind of thing: [read here](README.cra.md#proxying-api-requests-in-development).

If you take a look at the `"proxy"` field of the `package.json`, you'll see the following:

```js
"proxy": {
  "/api/npm-registry": {
    "target": "https://registry.npmjs.org",
    "changeOrigin": true,
    "pathRewrite": {
      "^/api/npm-registry": ""
    }
  },
  "/api/npm-api": {
    "target": "https://api.npmjs.org",
    "changeOrigin": true,
    "pathRewrite": {
      "^/api/npm-api": ""
    }
  }
}
```

This means that when you `npm start`, `/api/npm-registry` and `/api/npm-api` urls will proxy to there APIs, from the root of your development server.

That way, in development mode, you don't have to worry about CORS and your api server will definitly be accessible from a mobile device (when you test on wifi - not from `localhost` but with a real IP, you'll have the same experience).

Note: If you publish this kind of project, you'll have to host a proxy server somewhere that adds the CORS header (at least, for the npm registry).

See the .env file where the api root urls server are set:

```shell
REACT_APP_NPM_REGISTRY_API_BASE_URL=/api/npm-registry
REACT_APP_NPM_API_BASE_URL=/api/npm-api
```

## React specific

## Miscellaneous

### CORS anywhere development proxy

The npm registry doesn't return any CORS headers nor can it be called with jsonp. So any in-browser XHR request will be blocked.

I made a little script that will proxy any request, adding those CORS headers to the response. You can launch it with `npm run proxy-apis`.

Note: `./bin/cors-anywhere.js` is for development purpose only, it may not be suited for production (at least update the `originWhiteList`).

Use it for any api you will use in that project, they will be accessible (without anymore configuration) at `http://localhost:8000/ROOT_API_URL`. Examples:

* `http://localhost:8000/https://registry.npmjs.org`
* `http://localhost:8000/https://api.npmjs.org`

[cors-anywhere on npm](https://www.npmjs.com/package/cors-anywhere)
