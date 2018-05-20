# npm-registry-browser/notes

Bellow, you will find some notes I took along the way.

## Table of Contents

* `create-react-app related`
  * [Error npm test on MacOs Sierra](#error-npm-test-on-macos-sierra)
  * [API proxy for development](#api-proxy-for-development)
* [React specific](#react-specific)
* [Miscellaneous](#miscellaneous)
  * [Eslint and Prettier](#eslint-and-prettier)
  * [Cypress with cross-origin](#cypress-with-cross-origin)
  * [Continuous deployment with Travis](#continuous-deployment-with-travis)
  * [Cypress record on CI with pull requests from a fork](#cypress-record-on-ci-with-pull-requests-from-a-fork)
  * [Api fallback](#api-fallback)
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

You will notice that the [.env](.env) file sets the following urls for the servers (which are the ones that will be used in development):

```shell
REACT_APP_NPM_REGISTRY_API_BASE_URL=/api/npm-registry
REACT_APP_NPM_API_BASE_URL=/api/npm-api
```

In production, you'll need to provide production servers that support CORS, this is why you have [.env.production](.env.production).

### API proxy for production

In [.env.production](.env.production), a specific CORS proxy is setup that will be used at build time.

## React specific

## Miscellaneous

### Eslint and Prettier

Here are the commits where I setup prettier and eslint, you should check the infos in the commit messages:

* [3372bad](https://github.com/topheman/npm-registry-browser/commit/3372badb3df6177c58533003a9d8852e149411e4) - chore(prettier): setup prettier with eslint

  Based on [Using Prettier with VS Code and Create React App](https://medium.com/technical-credit/using-prettier-with-vs-code-and-create-react-app-67c2449b9d08)

  ```shell
  npm install --save-dev --save-exact prettier
  npm install --save-dev eslint-plugin-prettier
  ```

* [a4a67b9](https://github.com/topheman/npm-registry-browser/commit/a4a67b9c70a085a18ca3399361f612f407f8de0f) - style(\*): prettify code
* [247d4ef](https://github.com/topheman/npm-registry-browser/commit/247d4ef9de2f68a630d624a11fa24c44e707d77f) - chore(eslint): setup airbnb rules

  eslint-config-airbnb has peer dependencies, take the latest v15 to ensure compatibility with installed versions of the dependencies in create-react-app

  ```
  npm install --save-dev eslint-config-airbnb@15.x.x
  ```

  Turns off all rules that are unnecessary or might conflict with Prettier: [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier).

  ```
  npm install --save-dev eslint-config-prettier
  ```

* [4746848](https://github.com/topheman/npm-registry-browser/commit/474684810eceba17789167335f9e1221644e57db) - chore(prettier): add precommit hook

### Cypress with cross-origin

I had the following error lying in the cypress console:

```
Error: Blocked a frame with origin "http://localhost:5000" from accessing a cross-origin frame.
```

Solution: add following in [cypress.json](cypress.json):

```json
"chromeWebSecurity": false
```

Sources: https://github.com/cypress-io/cypress/issues/262

Also, when the app is ran inside cypress, the calls to outside are proxied by cypress, the `Origin` header is not added on CORS requests.

You can't manually set this header, you'll have the following error: `Refused to set unsafe header "Origin"`

Since the CORS proxies used in production ask for this origin header and it's missing when ran in cypress, we don't run through the CORS proxy when running tests in cypress with a production build - see [src/services/apis/index.js](src/services/apis/index.js).

### Continuous deployment with Travis

This project applies multiple CI (Continuous Integration) good practices such as:

* Linting / Formatting of the source code
* Unit tests
* End to end tests

We can rely on them when going through [Travis CI](https://travis-ci.org/topheman/npm-registry-browser) to automate the deployment on multiple environments, such as:

* staging: https://staging-npm-registry-browser.surge.sh
* production: https://topheman.github.io/npm-registry-browser/
* mocked version: https://mock-npm-registry-browser.surge.sh/
* upload build artefacts to github releases: https://github.com/topheman/npm-registry-browser/releases

I am using github-pages and surge.sh for hosting, you will see that [Travis CI supports a lot of providers out of the box](https://docs.travis-ci.com/user/deployment/).

Here are some example of use of providers. If you want multiple ones at a time ([Mutiple Provider](https://docs.travis-ci.com/user/deployment/#Deploying-to-Multiple-Providers)), you can take a look at my [`.travis.yml`](.travis.yml) file.

#### Deploy to surge

Add the 2 following env vars to the travis settings of your repo:

* `SURGE_LOGIN`: Set it to the email address you use with Surge
* `SURGE_TOKEN`: Set it to your login token (get it by running `surge token`)

Update your `.travis.yml` with:

```yaml
deploy:
  provider: surge
  project: ./static/
  domain: example.surge.sh
```

📂 [Checkout the PR where I implemented it](https://github.com/topheman/npm-registry-browser/pull/20/files)

📔 [Travis Docs](https://docs.travis-ci.com/user/deployment/surge/)

#### Deploy artefacts to github releases

You might want to archive the builds you deployed for multiple reasons, for example:

* expose them internally to your team to ease re-deployment
* keep them to download the exact same release when someone files an issue on a specific version

To do that, we compress the `build` folder and upload it to github via its API, using the `release` provider from Travis CI.

Follow the steps:

* [Install travis-cli](https://github.com/travis-ci/travis.rb#installation)
* Log into travis on the terminal inside your project folder [travis login](https://github.com/travis-ci/travis.rb#login)
* Run `travis setup releases` [sources](https://docs.travis-ci.com/user/deployment/releases/)

This will ask for a few credentials and add the necessary configuration in your `.travis.yml` file. You will end up with a config like that:

```yaml
# add this step to compress the build folder
before_deploy:
  - tar czvf build.tar.gz -C build .
deploy:
  provider: releases
  api_key: "GITHUB OAUTH TOKEN"
  file: "build.tar.gz"
  skip_cleanup: true
  on:
    tags: true
```

📂 [Checkout the PR where I implemented it](https://github.com/topheman/npm-registry-browser/pull/22/files)

📔 [Travis Docs](https://docs.travis-ci.com/user/deployment/releases/)

#### Deploy to github pages

If you use github-pages as hosting, you can automate the deployment. You'll need a github token (you can generate it from [here](https://github.com/settings/tokens) with the `public_repo` scope).

Then add the following to your `.travis.yml`:

```yaml
deploy:
  provider: pages
  skip-cleanup: true
  github-token: $GITHUB_TOKEN  # Set in the settings page of your repository, as a secure variable
  keep-history: true
  on:
    branch: master
```

📂 [Checkout the PR where I implemented it](https://github.com/topheman/npm-registry-browser/pull/23/files)

📔 [Travis Docs](https://docs.travis-ci.com/user/deployment/pages/)

### Cypress record on CI with pull requests from a fork

> A pull request sent from a fork of the upstream repository could be manipulated to expose environment variables.
> Travis CI makes encrypted variables and data available only to pull requests coming from the same repository. These are considered trustworthy, as only members with write access to the repository can send them.
> Pull requests sent from forked repositories do not have access to encrypted variables or data.

[Sources on travis-ci.org](https://docs.travis-ci.com/user/pull-requests/#Pull-Requests-and-Security-Restrictions)

Since cypress needs a record key passed as an environment value, on PRs from forks, you would come against the following error:

```
You passed the --record flag but did not provide us your Record Key.
You can pass us your Record Key like this:
  cypress run --record --key <record_key>
You can also set the key as an environment variable with the name CYPRESS_RECORD_KEY.
https://on.cypress.io/how-do-i-record-runs
```

[Example of build failing](https://travis-ci.org/topheman/npm-registry-browser/builds/366468341)

To avoid that, [I disable the record on PRs](.travis.yml).

### Api fallback

The app relies on [three APIs](src/services/apis/index.js):

* https://registry.npmjs.org
  * the API used by the npm cli
  * provides package details and search results
* https://api.npmjs.org
  * provides stats
* https://api.npms.io
  * provides search and suggestions

#### Why use api.npms.io, since registry.npmjs.org seams to provide search results as well ?

`api.npms.io` provides sharper search results (even the [npmjs.com](https://www.npmjs.com/) website uses it under the hood). It also has an interresting api `/search/suggestions` (more oriented for autocomplete).

#### What if api.npms.io went down ?

From the beginning I made wrappers for the API calls of both `registry.npmjs.org` and `api.npms.io` that took the same kind of input/output, so they could be switchable.

Some day, `api.npms.io` went down and all the search features were broken. All I had to do was [switch the api client](https://github.com/topheman/npm-registry-browser/commit/29689f37e1d580d7d8966ac7f5a690e492a0c322) (temporary solution) - see bellow for the final fix 👇.

I went back enventually, but made sure that, if `api.npms.io` is down, the app automatically switches back to `registry.npmjs.org`. That way, the user can enjoy a great search experience and if the `api.npms.io` goes down, it will seamlessly switch, without any downtime, without him/her noticing.

[PR where I implemented fallback](https://github.com/topheman/npm-registry-browser/pull/7).

### CORS anywhere development proxy

Deprecated: please use [API proxy for development](#api-proxy-for-development).

The npm registry doesn't return any CORS headers nor can it be called with jsonp. So any in-browser XHR request will be blocked.

I made a little script that will proxy any request, adding those CORS headers to the response. You can launch it with `npm run proxy-apis`.

Note: `./bin/cors-anywhere.js` is for development purpose only, it may not be suited for production (at least update the `originWhiteList`).

Use it for any api you will use in that project, they will be accessible (without anymore configuration) at `http://localhost:8000/ROOT_API_URL`. Examples:

* `http://localhost:8000/https://registry.npmjs.org`
* `http://localhost:8000/https://api.npmjs.org`

[cors-anywhere on npm](https://www.npmjs.com/package/cors-anywhere)
