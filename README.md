# npm-registry-browser

There are lots of great resources on React out there. What might be missing is some projects mixing real world constraints like:

* API calls
* using external libraries (UI kits, http clients ...)
* some routing and global state management
* code quality good practices (linting, testing, git hooks, cis ...)
* automation / dev pipeline
* and more ...

The hard part is often to be able to put all those together. This is the goal of this project: provide a well-documented example of a front-end app with real-world features and constraints.

## Infos

This project was bootstrapped with [create-react-app](https://github.com/facebook/create-react-app).

The whole README from `create-react-app` is available [here](README.cra.md).

I took some notes along the way, they are available [here](NOTES.md)

## Install

```shell
npm install
```

## Run

```shell
npm start
```

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
