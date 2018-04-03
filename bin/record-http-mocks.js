#!/usr/bin/env node

/**
 * Inspired by https://github.com/topheman/react-es6-redux/blob/master/bin/nock/call-nock.js
 *
 * This script records the http requests (requests / response with body and headers)
 * so that they could be mocked in development mode or tests.
 * This task is automated, this way, you don't have to bother to do it manually ! ;-)
 */

// we are importing ESM modules from the front
require = require("esm")(module); // eslint-disable-line
require("dotenv").config({ path: ".env.production" }); // eslint-disable-line

const path = require("path");

const { recordAll } = require("./lib/record-http-mocks");
const {
  TARGET_API_NPM_API,
  TARGET_API_NPM_REGISTRY
} = require("../src/services/apis/constants");

const recordConfig = {
  [TARGET_API_NPM_REGISTRY]: {
    config: {
      baseURL: process.env.REACT_APP_NPM_REGISTRY_API_BASE_URL,
      headers: {
        origin: "https://github.io"
      }
    },
    requests: [
      "/react",
      "/@angular%2Fcore",
      {
        url: "/-/v1/search?text=react",
        match: "/-/v1/search\\?text=react(\\.*)"
      },
      {
        url: "/-/v1/search?text=%40angular",
        match: "/-/v1/search\\?text=%40angular(\\.*)"
      }
    ],
    outputPath: path.join(
      __dirname,
      "..",
      "src",
      "services",
      "mocks",
      `${TARGET_API_NPM_REGISTRY}.fixtures.json`
    )
  },
  [TARGET_API_NPM_API]: {
    config: {
      baseURL: process.env.REACT_APP_NPM_API_BASE_URL
    },
    requests: [
      "/downloads/range/last-year/react",
      "/downloads/range/last-year/@angular%2Fcore"
    ],
    outputPath: path.join(
      __dirname,
      "..",
      "src",
      "services",
      "mocks",
      `${TARGET_API_NPM_API}.fixtures.json`
    )
  }
};

recordAll(recordConfig)
  .then(() => console.log("Recording success"))
  .catch(e => console.log("[ERROR]", e.message));
