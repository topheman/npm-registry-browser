import { setupCache } from "axios-cache-adapter";
import invariant from "invariant";

import { makeClient } from "./httpClient";

/**
 * This class is NEVER called directly.
 *
 * Use apiManager.configure(config) with the same params as this constructor.
 *
 * @param {Object} [options.managerConfig]
 * @param {String} [options.managerConfig.key]
 * @param {Function} [options.managerConfig.decorateApi] add custom methods: ({client, cache, key}) => { ...apis}
 * @param {Boolean} [options.manager.isCacheEnabled]
 * @param {Array} [options.managerConfig.mocks] Only passed if mock mode is on - The mocks to be used
 * @param {Function} [options.managerConfig.makeMockedClient] Only passed if mock mode is on - The mockClient Factory
 * @param {Function} [options.managerConfig.preprocessMocking] Only passed if mock mode is on - allow you to rewrite the response per-request ([status, response, headers], config) -> [status, response, headers]
 *
 * @param {Object} [options.httpClientBaseConfig] Config you would pass to your http client (axios here)
 */
export default class Manager {
  constructor({ managerConfig, httpClientBaseConfig = {} } = {}, key) {
    const {
      decorateApi, // ({client, cache, key}) => { ...apis}
      isCacheEnabled,
      mocks,
      makeMockedClient,
      preprocessMocking
    } = managerConfig;
    invariant(
      typeof key !== "undefined",
      "[Api][Manager] key param must be specified (any string will do)"
    );
    const axiosConfig = { ...httpClientBaseConfig }; // don't mutate arguments
    this.key = key;
    if (isCacheEnabled) {
      this.cache = setupCache({ maxAge: 15 * 60 * 1000 });
      axiosConfig.adapter = this.cache.adapter;
      if (process.env.NODE_ENV === "development") {
        console.info(
          `[Api][Manager](${this.key}) Cache is enabled`,
          this.cache
        );
      }
    }
    if (mocks) {
      console.warn(
        `[Api][Manager](${this.key}) Mocking API. Requests will be intercepted and served. The files containing the mocks are in src/services/mocks. To generate those files, run: npm run record-http-mocks.`
      );
      console.warn(
        `[Api][Manager](${this.key}) Unmocked requests will pass through and will be logged.`
      );
      this.client = makeMockedClient(
        axiosConfig,
        mocks,
        {
          preprocessMocking
        },
        this.key
      );
    } else {
      this.client = makeClient(axiosConfig);
    }
    // add custom method to the Api via decorateApi
    if (typeof decorateApi === "function") {
      const moreApis = decorateApi({
        client: this.client,
        cache: this.cache,
        key: this.key
      });
      const reservedAttributes = Object.keys(this);
      invariant(
        !Object.keys(moreApis).some(arrayKey =>
          reservedAttributes.includes(arrayKey)
        ),
        `[Api][Manager](${
          this.key
        }) decorateApi can not return one of the following reserved attributes: ${reservedAttributes.join(
          ", "
        )}`
      );
      Object.assign(this, moreApis);
    }
  }
}
