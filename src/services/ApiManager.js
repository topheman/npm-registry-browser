import { setupCache } from "axios-cache-adapter";
import invariant from "invariant";
import warning from "warning";

import { TARGET_API_NPM_API, TARGET_API_NPM_REGISTRY } from "./constants";
import { makeClient } from "./httpClient";

/**
 * To use this, simply await getInstance("npmRegistry").client.get('/react')
 * or await getInstance("npmApi").client.get('/downloads/range/last-month/d3')
 *
 * This is a multiton (you will retrieve the same instance each time for each key)
 * Default configs are set in .env file.
 * They are overridable using init(key, config)
 *
 * Thanks to decorate function, you can add customized method for each
 */

const acceptedKeys = [TARGET_API_NPM_REGISTRY, TARGET_API_NPM_API];

/**
 * Cache the instances of the multiton
 */
const instance = {
  [TARGET_API_NPM_REGISTRY]: null,
  [TARGET_API_NPM_API]: null
};

/**
 * Specify the config for each (see .env files)
 * - isCacheEnabled: will use memory cache
 * - mocks: specify mock files that will be used
 *    require is used so that the fixtures won't be part of the final bundle in regular mode
 *    see: http://dev.topheman.com/optimize-your-bundles-weight-with-webpack/
 * - makeMockClient: same, only required when needed to be dropped if not
 */
const baseConfig = {
  [TARGET_API_NPM_REGISTRY]: {
    baseURL: process.env.REACT_APP_NPM_REGISTRY_API_BASE_URL,
    isCacheEnabled:
      process.env.REACT_APP_NPM_REGISTRY_API_CACHE_ENABLED === "true",
    mocks:
      process.env.REACT_APP_NPM_REGISTRY_API_MOCKS_ENABLED === "true"
        ? [].concat(require("./mocks/npmRegistry.fixtures.json"))
        : undefined,
    makeMockedClient:
      process.env.REACT_APP_NPM_REGISTRY_API_MOCKS_ENABLED === "true"
        ? require("./httpClientMock").makeMockedClient
        : undefined,
    preprocessMocking: ([status, response, headers]) => [
      status,
      response,
      {
        ...headers,
        Date: new Date().toString() // adjust date header
      }
    ]
  },
  [TARGET_API_NPM_API]: {
    baseURL: process.env.REACT_APP_NPM_API_BASE_URL,
    isCacheEnabled: process.env.REACT_APP_NPM_API_CACHE_ENABLED === "true",
    mocks:
      process.env.REACT_APP_NPM_API_MOCKS_ENABLED === "true"
        ? [].concat(require("./mocks/npmApi.fixtures.json"))
        : undefined,
    makeMockedClient:
      process.env.REACT_APP_NPM_API_MOCKS_ENABLED === "true"
        ? require("./httpClientMock").makeMockedClient
        : undefined,
    preprocessMocking: ([status, response, headers]) => [
      status,
      response,
      {
        ...headers,
        Date: new Date().toString() // adjust date header
      }
    ]
  }
};

/**
 * Merges the config object with the defaults.
 * You can pass any axios-specific config.
 * You can also pass the following project specific attributes:
 *  - isCacheEnabled {Boolean}
 * @param {String} key
 * @param {*} config
 */
const makeConfig = (key, config = {}) => {
  invariant(
    acceptedKeys.includes(key),
    `[ApiManager](${key}) Only accepts ${acceptedKeys.join(", ")}`
  );
  const mergedConfig = {
    ...baseConfig[key],
    ...config
  };
  return mergedConfig;
};

/**
 * Make scoped packages names safe
 */
const encodePackageName = name => name.replace("/", "%2F");

/**
 * According to key, decorates the instance of SingletonApiManager with specific methods
 * @param {String} key
 * @param {SingletonApiManager} apiManagerInstance
 */
const decorate = (key, apiManagerInstance) => {
  switch (key) {
    case TARGET_API_NPM_REGISTRY:
      /**
       * Retrieve package info
       * @param {String} name (full also scoped packages)
       * @param @optional {String} version
       */
      // eslint-disable-next-line
      apiManagerInstance.packageInfos = function packageInfos(name, version) {
        const query =
          encodePackageName(name) +
          (typeof version !== "undefined" ? `/${version}` : "");
        return this.client.get(query);
      };
      // eslint-disable-next-line
      apiManagerInstance.search = function search(value) {
        const query = `/-/v1/search?text=${encodeURIComponent(value)}`;
        return this.client.get(query);
      };
      return apiManagerInstance;
    case TARGET_API_NPM_API:
      /**
       * Retrieve package info
       * @param {String} name (full also scoped packages)
       * @param @optional {String} version
       */
      // eslint-disable-next-line
      apiManagerInstance.downloads = function downloads(
        name,
        range = "last-month"
      ) {
        const query =
          "/downloads/range/" + range + "/" + encodePackageName(name);
        return this.client.get(query);
      };
      return apiManagerInstance;
    default:
      return apiManagerInstance;
  }
};

class SingletonApiManager {
  constructor(key, config) {
    // extract any non-axios-specific config (like cache mode, mock mode ...)
    const {
      isCacheEnabled,
      mocks,
      makeMockedClient,
      preprocessMocking,
      ...axiosConfig
    } = makeConfig(key, config);
    if (!instance[key]) {
      instance[key] = decorate(key, this);
      if (isCacheEnabled) {
        this.cache = setupCache({ maxAge: 15 * 60 * 1000 });
        axiosConfig.adapter = this.cache.adapter;
        if (process.env.NODE_ENV === "development") {
          console.info(`[ApiManager](${key}) Cache is enabled`, this.cache);
        }
      }
      if (mocks) {
        console.warn(
          `[ApiManager](${key}) Mocking API. Requests will be intercepted and served. The files containing the mocks are in src/services/mocks. To generate those files, run: npm run record-http-mocks.`
        );
        console.warn(
          `[ApiManager](${key}) Unmocked requests will pass through and will be logged.`
        );
        this.client = makeMockedClient(axiosConfig, mocks, {
          preprocessMocking
        });
      } else {
        this.client = makeClient(axiosConfig);
      }
    }
    if (process.env.NODE_ENV === "development") {
      console.info(`[ApiManager](${key}) Config`, axiosConfig);
    }
  }
}

export const getInstance = key => {
  invariant(
    acceptedKeys.includes(key),
    `[ApiManager](${key}) Only accepts ${acceptedKeys.join(", ")}`
  );
  // if .init() wasn't called, the default config of constructor will be used
  if (!instance[key]) {
    return new SingletonApiManager(key);
  }
  return instance[key];
};

export const init = (key, config) => {
  // prevent re-init (prevent re-instanciation is built-in SingletonApiManager)
  if (instance[key]) {
    warning(
      false,
      `[ApiManager](${key}) .init(key, config) has no effect once .getInstance(key) or .init(key) have been called before.`
    );
    return instance[key];
  }
  return new SingletonApiManager(key, config);
};
