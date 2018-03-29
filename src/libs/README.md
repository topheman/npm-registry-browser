# libs

This folder contains libs that aren't meant to be modified in the project.

Example: I've the following problem at build with [@fnando/sparkline](https://github.com/fnando/sparkline):

```
Failed to minify the code from this file:

  ./node_modules/@fnando/sparkline/src/sparkline.js:6
```

The `package.json` file is like this:

```
  "main": "dist/sparkline.js",
  "module": "src/sparkline.js",
```

The reason seams to be that the webpack config of create-react-app is meant to use the ESModule version of a package when possible, but since it is in the `node_modules`, it doesn't transpiles them.

So it won't transpile the spread operator (l6) nor export as a CommonJS module for Babel.

Still in progress ...