/**
 * Creates a mocked client, using the mocks passed in param
 * The mocks should be in the format used by nock.recorder
 * You can record your own mocks using the record-http-mock.js utility in bin folder.
 */

import MockAdapter from "axios-mock-adapter";

import { makeClient } from "./httpClient";
import { ucFirst } from "../../utils/string";

// this log will only happen if this file is required
// you will see that if you don't mock, all the json mock files and the implementation
// won't be part of the build
console.log("[Mock] Required src/services/httpClientMock.js");

/**
 * Nock records headers as arrays like:
 * ["content-type","application/json; charset=utf-8","request-id","OwkpB28yRJCj6LH8+Ft+tQ==","Content-Length","1240"]
 *
 * This function turns them into an object like
 * {
 *   "content-type": "application/json; charset=utf-8",
 *   "request-id": "OwkpB28yRJCj6LH8+Ft+tQ==",
 *   "Content-Length": "1240"
 * }
 * @param {Array} nockHeaders
 */
const rawHeadersToRegularHeaders = (rawHeaders = []) =>
  rawHeaders.reduce((acc, cur, index, arr) => {
    if (index % 2 === 0) {
      acc[cur] = arr[index + 1];
    }
    return acc;
  }, {});

/**
 *
 * @param {Object} axiosConfig
 * @param {Array} mocks
 * @param {Object} [options]
 * @param {Function} [options.preprocessMocking] preprocessMocking([status, response, headers], config) -> [status, response, headers]
 * @return {Object}
 */
export const makeMockedClient = (
  axiosConfig,
  mocks,
  { preprocessMocking } = {},
  key
) => {
  // Reshape the headers in the mock from arrays to objects
  const preprocessedMocks = mocks.map(mock => ({
    ...mock,
    headers: Array.isArray(mock.rawHeaders)
      ? rawHeadersToRegularHeaders(mock.rawHeaders)
      : mock.rawHeaders
  }));
  console.warn(
    `[Mock][init](${key}) Following requests will be mocked on ${
      axiosConfig.baseURL
    }`,
    mocks.map(mock => `${mock.method.toUpperCase()}: ${mock.path}`)
  );
  const mockedAxios = new MockAdapter(makeClient(axiosConfig));
  const originalHttpClient = makeClient(axiosConfig);
  preprocessedMocks.forEach(mock => {
    // use either the .match attribute containing a regexp (which was left in the recording config)
    // or the .path attribute
    mockedAxios[`on${ucFirst(mock.method)}`](
      mock.match ? new RegExp(mock.match) : mock.path
    ).reply(config => {
      // allow the user to rewrite the response per-request with
      // preprocessMocking([status, response, headers], config) -> [status, response, headers]
      // can be useful to update the Date response headers
      const { status, response, headers } = mock;
      const userPreprocessedMock =
        typeof preprocessMocking === "function"
          ? preprocessMocking([status, response, headers], config)
          : [status, response, headers];
      console.log(
        `[Mock][mocking](${key}) ${mock.path}`,
        userPreprocessedMock,
        config
      );
      return userPreprocessedMock;
    });
  });
  // let unmocked requests passthrough and log them
  mockedAxios.onAny().reply(config =>
    originalHttpClient.request(config).then(result => {
      const output = [result.status, result.data, result.headers];
      console.log(`[Mock][passThrough](${key}) ${config.url}`, output);
      return output;
    })
  );
  return mockedAxios.axiosInstance;
};
