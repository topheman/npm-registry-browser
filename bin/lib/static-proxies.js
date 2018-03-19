const express = require("express"); // eslint-disable-line
const proxy = require("http-proxy-middleware"); // eslint-disable-line

module.exports.createServer = ({
  staticFolders = ["build"],
  proxyConfig = {}
} = {}) => {
  const app = express();

  Object.entries(proxyConfig).forEach(([path, config]) => {
    console.log(`Creating proxy for ${path}`);
    app.use(path, proxy(config));
  });

  (staticFolders || []).forEach(folder => {
    console.log(`Serving static folder ${folder}`);
    app.use(express.static(folder));
  });

  return app;
};
