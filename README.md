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

I took some notes along the way, they are available [here](NOTES.md).

## Install

```shell
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

### Unit

```shell
npm test
```

Check out [Error npm test on MacOs Sierra](NOTES.md#error-npm-test-on-macos-sierra) if you're experimenting some troubles.

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

## Advanced

### Mock mode

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

For those who want to play with webpack configurations, you can access a starter kit I open sourced: [topheman/webpack-babel-starter](https://github.com/topheman/webpack-babel-starter).
