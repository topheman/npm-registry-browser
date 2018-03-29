/**
 * Inspired by https://github.com/topheman/react-es6-redux/blob/master/bin/nock/call-nock.js
 *
 * This script records the http requests (requests / response with body and headers)
 * so that they could be mocked in development mode or tests.
 * This task is automated, this way, you don't have to bother to do it manually ! ;-)
 */

const nock = require("nock"); // eslint-disable-line
const axios = require("axios");
const fs = require("fs-extra"); // eslint-disable-line

/**
 *
 * @param {String} target Will only be used for logging
 * @param {Object} config The shared config you would pass to your http client for all requests
 * @param {String} outputPath Filename where to write result (will be created if not exists)
 * @param {Array} requests Declarations of the requests like you would do with your http client
 * @return {Promise}
 */
function record({ target, config, outputPath, requests = [] }) {
  const httpClient = axios.create();

  const makeRequests = (clientConfig = {}) =>
    requests.map(options => {
      let appliedOptions = {};
      if (typeof options === "string") {
        appliedOptions = {
          url: options,
          method: "get"
        };
      } else {
        appliedOptions = {
          url: options.url,
          method: options.method || "get",
          ...options
        };
      }
      console.log(`[nock ${target}] ${appliedOptions.url}`);
      // @warn the per-request options and the config-options are not deep-merged (should-it ?)
      return httpClient.request({
        ...appliedOptions,
        ...clientConfig
      });
    });

  // reset any current recording
  nock.recorder.clear();

  // start recording
  nock.recorder.rec({
    output_objects: true,
    enable_reqheaders_recording: true,
    dont_print: true
  });

  console.log(`[nock ${target}] Start recording`);

  return Promise.all(makeRequests(config))
    .then(() => {
      // once all request have passed, retrieve the recorded data
      const nockCallObjects = nock.recorder.play() || [];
      const output = nockCallObjects.map(item => {
        // change the shape of the object if necessary
        console.log(item.scope, item.path);
        return item;
      });
      fs.ensureFileSync(outputPath); // make sur the file exists (create it if it doesn't)
      fs.writeFileSync(outputPath, JSON.stringify(output));
      console.log(`[nock ${target}] file created at`, outputPath);
      nock.restore();
    })
    .catch(error => {
      nock.restore();
      console.log(`[ERRORS ${target}]`, error.message);
    });
}

/**
 * Prepares the config from an object to an array for recordAll
 * @param {Object} recordConfig
 * @return {Array}
 */
const makeConfig = recordConfig =>
  Object.entries(recordConfig).map(([key, value]) => ({
    target: key,
    ...value
  }));

/**
 * Will record sequentially multiple tracks of apis
 * @param {Object} recordConfig
 */
async function recordAll(recordConfig) {
  try {
    const config = makeConfig(recordConfig);
    // eslint-disable-next-line
    for (const currentConf of config) {
      await record(currentConf); // eslint-disable-line
    }
    await "Success";
  } catch (e) {
    await e;
  }
}

module.exports.record = record;
module.exports.recordAll = recordAll;
