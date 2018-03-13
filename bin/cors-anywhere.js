#!/usr/bin/env node

/**
 * This file will open a server that will proxy ANY requests
 * and add CORS to the response headers.
 *
 * It is meant to be used for development purpose.
 */

// Listen on a specific host via the HOST environment variable
const host = process.env.HOST || "0.0.0.0";
// Listen on a specific port via the PORT environment variable
const port = process.env.PORT || 8000;

const corsProxy = require("cors-anywhere"); // eslint-disable-line

corsProxy
  .createServer({
    originWhitelist: [] // Allow all origins
  })
  .listen(port, host, () => {
    console.log(`Running CORS Anywhere on ${host}:${port}`);
  });
