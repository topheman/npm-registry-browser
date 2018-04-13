# npm-registry-browser

There are lots of great resources on React out there. What might be missing is some projects mixing real world constraints like:

* API calls
* using external libraries (UI kits, http clients ...)
* some routing and global state management
* code quality good practices (linting, testing, git hooks, cis ...)
* automation / dev pipeline
* and more ...

The hard part is often to be able to put all those together. This is the goal of this project: provide a well-documented example of a front-end app with real-world features and constraints.

## What this project is not

1.  A simple boilerplate. It aims to be more than that: expose quality sample code that you could learn from, at a project level.
2.  The ultimate answer. There are things you would have done differently and it's ok. Other things will evolve with time.

## Infos

This project was bootstrapped with [create-react-app](https://github.com/facebook/create-react-app).

The whole README from `create-react-app` is available [here](README.cra.md).

Here's a list of some of the technologies I'm using:

* [React](https://github.com/facebook/react) / [React Router](https://github.com/reactjs/react-router)
* [material-ui](https://material-ui-next.com/) / [Downshift](https://github.com/paypal/downshift)
* [Eslint](http://eslint.org/) (with [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)) / [Prettier](https://github.com/prettier/prettier)
* [Jest](https://facebook.github.io/jest/) / [Cypress.io](https://www.cypress.io/) - [enzyme](https://github.com/airbnb/enzyme) / [react-testing-library](https://github.com/kentcdodds/react-testing-library)
* [Axios](https://github.com/axios/axios) / [nock](https://github.com/node-nock/nock)

I took some notes along the way, they are available [here](NOTES.md).

## Install

```shell
git clone https://github.com/topheman/npm-registry-browser.git
cd npm-registry-browser
npm install
```

## Run

```shell
npm start
```

Checkout [API proxy for development](NOTES.md#api-proxy-for-development) to understand how the API servers are served in development mode.

## Build

```shell
npm run build
```

Will build the a production version of the website in the `build` folder.

## Serve

Once you've built you're app, you can test the build on a local server with:

```shell
npm run serve
```

## Test

The following command will run both unit and e2e (cypress) tests.

```shell
npm test
```

You can choose to run them separately.

### Unit

You'll find unit tests spread in the `src` folder inside `__tests__` folders in files named like `*.spec.js`.

I'm using [Jest](https://facebook.github.io/jest/) as a test runner and [enzyme](https://github.com/airbnb/enzyme) / [react-testing-library](https://github.com/kentcdodds/react-testing-library) as testing utilies.

* `npm run test:unit` : single run of the unit tests
* `npm run test:unit:watch` : run the unit tests in watch mode

Check out [Error npm test on MacOs Sierra](NOTES.md#error-npm-test-on-macos-sierra) if you're experimenting some troubles.

### End to end

> End-to-end testing is a technique used to test whether the flow of an application right from start to finish is behaving as expected. The purpose of performing end-to-end testing is to identify system dependencies and to ensure that the data integrity is maintained between various system components and systems.
>
> The entire application is tested for critical functionalities such as communicating with the other systems, interfaces, database, network, and other applications.

I'm using [cypress.io](https://www.cypress.io/) for the e2e tests. You will find them in [cypress/integration](cypress/integration).

* `npm run test:cypress` : single run the e2e tests. It will:
  * build the project and serve it on [http://localhost:5000](http://localhost:5000) (that way, your tests reflect exactly what the end user would see in production)
  * run the tests in [cypress/integration](cypress/integration) folder
  * tear down once tests are passed (or failed)
* `npm run test:cypress:dev` : use this one when you're coding your tests. It will:
  * spin up a dev server on [http://localhost:3000](http://localhost:3000) (so, you don't have to `npm start`)
  * open the cypress client that will let you choose which tests you want to run

## Linter

I use eslint to check the coding style, with the following presets:

* [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb): An advanced set of eslint rules for JavaScript and React made by Airbnb
* [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier): Turns off all rules that are unnecessary or might conflict with Prettier.
* [eslint-config-react-app](https://www.npmjs.com/package/eslint-config-react-app): Shipping preset from create-react-app

More on [eslint configuration](NOTES.md#eslint-and-prettier).

The following command will run the linter on your code base. This task is ran at pre-commit to ensure code quality.

```shell
npm run lint
```

## Prettier

Prettier is a great tool to enforce a consistent style accross your code base (usefull when working in teams).

[Here is how to integrate it with your editor](https://prettier.io/docs/en/editors.html).

Once it's done, when you'll save a file, it will reformat it.

The following command will let you format your code base. This task is ran at pre-commit.

```shell
npm run pretty
```

More on [prettier](NOTES.md#eslint-and-prettier).

## Deploy

The demo is hosted on [github-pages](https://topheman.github.io/npm-registry-browser). A simple way to publish your app is to use the [gh-pages](https://www.npmjs.com/package/gh-pages) package that will create a `gh-pages` orphan branch on which it will commit and push.

The following script will build then publish your app on your github pages:

```shell
npm run deploy
```

[More infos](README.cra.md#github-pages)

## Advanced

### Mock mode

You can test an [online demo of the mocked version of the app](https://mock.npm-registry-browser.surge.sh/) (open the console to see the mocked requests).

#### Serve mocks

Thanks to [src/services/apis](src/services/apis), the api calls can be mocked at any time. The following command will let the api manager serve the mocks saved in [src/services/apis/mocks](src/services/apis/mocks).

```shell
npm run dev:mock
```

It can be useful when the front-end and back-end teams are developing the same feature at the same time, so as a front-end developer, you don't have to wait for the server to be completed.

It can also be applied once you have a backend to mock your api calls while coding or testing, to have deterministic responses from your http client.

#### Record mocks

I made a utility based on nock in [bin/record-http-mocks.js](bin/record-http-mocks.js) to automate the recording of the mocks by declaring which urls you want to mock and automatically generate those files.

Specify your config in [bin/record-http-mocks.js](bin/record-http-mocks.js) and

```shell
npm run record-http-mocks
```

#### Make a build with mocks

You can even make a mocked build version of the app.

Warning: Like in development, mocked requests will be intercepted (won't go to the server) and you will be shipping mocks (and the code that implements the mocking part) to your bundle.

This could be used for e2e testing purposes.

```shell
npm run build:mock
```

## FAQ

### Why use create-react-app ?

The goal of this project is to focus on how to put the pieces together to make a front-end app, to focus on architecture, not get stuck on webpack configurations 😉.

[Toolkits](https://blog.kentcdodds.com/concerning-toolkits-4db57296e1c3) are becoming more popular. Developers are tending to use them or make their own.

Since create-react-app is the most popular toolkit in the react community, I chose this one, with a challenge/constaint: **NOT TO EJECT**.

Why not eject ?

* So that when you dive in the project, you don't have any more overhead from enforcing any weird configuration or tool
* To challenge some use-cases where people tell you that you should eject when you can still remain

### What couldn't you do with create-react-app ?

There are some points that I couldn't address with an unejected create-react-app:

* Not being able to add babel-presets/babel-plugins: usually I use a few ones such as:
  * [babel-plugin-dev-expression](https://www.npmjs.com/package/babel-plugin-dev-expression): I use [invariant](https://www.npmjs.com/package/invariant), it removes development checks added for development
* Not being able to alias modules via webpack config: when hacking/forking a module, it can come handy. This is why there is a [src/libs](src/libs) folder (temporary).
* Use `HtmlWebpackPlugin` and `webpack.DefinePlugin` to expose vars generated on the fly (such as retrieving the git hash, the date of the build ...) - I managed to do that with [bin/expand-metadatas.js](bin/expand-metadatas.js).

For those who want to play with webpack configurations, you can access a starter kit I open sourced: [topheman/webpack-babel-starter](https://github.com/topheman/webpack-babel-starter).

### Why not use redux ?

> People often choose Redux before they need it. “What if our app doesn’t scale without it?” Later, developers frown at the indirection Redux introduced to their code. “Why do I have to touch three files to get a simple feature working?” Why indeed!
>
> People blame Redux, React, functional programming, immutability, and many other things for their woes, and I understand them. It is natural to compare Redux to an approach that doesn’t require “boilerplate” code to update the state, and to conclude that Redux is just complicated. In a way it is, and by design so.

[You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) by [Dan Abramov](https://twitter.com/dan_abramov)

I wanted to show that you don't necessarily need redux to make a web app like this one.

Also, not adding redux kept the codebase more agnostic.

Maybe in further versions, I will add redux while adding other features.

### Why use Material UI ?

In every enterprise app, you're using some kind of UI Kit (whether it is homemade or based on libraries like [material-ui](https://material-ui-next.com/), [semantic-ui](https://react.semantic-ui.com) or [bootstrap](https://react-bootstrap.github.io/)).

Working with such a library was part of the constraints I set.

I had never used `material-ui`, it was the opportunity of testing it (and also test the `css-in-js` paradigm that I knew of, but never coded with).

## Next

This project is a work in progress, here are some of the next features I'll be working on:

* Test pluging an other `css-in-js` library to [`material-ui`](https://material-ui-next.com/) (default one is [jss](https://material-ui-next.com/customization/css-in-js/#jss))
* Form management use case (to show a more advanced way of state management - maybe using redux ?)
* Add some i18n (since the content of the app is all in english, first find some adapted feature to apply it)
* Use latest React 16.3 apis such as:
  * New lifecycles such as [`getDerivedStateFromProps`](https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops) / [`getSnapshotBeforeUpdate`](https://reactjs.org/docs/react-component.html#getsnapshotbeforeupdate)
* More unit tests and e2e tests
* Try out [React Suspense](https://www.youtube.com/watch?v=6g3g0Q_XVb4) (next versions of React)
* Upgrade `react-scripts` / use webpack 4 ?
