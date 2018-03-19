#!/usr/bin/env node

/**
 * This file is meant to be used to test your build in local
 * with the apis proxied on the same domain (in order to be able to seamlessly test
 * on mobile devices via wifi)
 *
 * Make sure you build with the same proxy config as in dev
 */
const { createServer } = require("./lib/static-proxies");
const packageJson = require("../package.json");

// Listen on a specific host via the HOST environment variable
const host = process.env.HOST || "0.0.0.0";
// Listen on a specific port via the PORT environment variable
const port = process.env.PORT || 8000;

createServer({ proxyConfig: packageJson.proxy }).listen(port, host, () => {
  console.log(`Running static-proxies on ${host}:${port}`);
});
