import axios from "axios";
import { setupCache } from "axios-cache-adapter";
import invariant from "invariant";
import warning from "warning";

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

const KEY_NPM_REGISTRY = "npmRegistry";
const KEY_NPM_API = "npmApi";

const acceptedKeys = [KEY_NPM_REGISTRY, KEY_NPM_API];

/**
 * Cache the instances of the multiton
 */
const instance = {
  [KEY_NPM_REGISTRY]: null,
  [KEY_NPM_API]: null
};

/**
 * Specify the config for each
 */
const baseConfig = {
  [KEY_NPM_REGISTRY]: {
    baseURL: process.env.REACT_APP_NPM_REGISTRY_API_BASE_URL,
    isCacheEnabled:
      process.env.REACT_APP_NPM_REGISTRY_API_CACHE_ENABLED === "true"
  },
  [KEY_NPM_API]: {
    baseURL: process.env.REACT_APP_NPM_API_BASE_URL,
    isCacheEnabled: process.env.REACT_APP_NPM_API_CACHE_ENABLED === "true"
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
    case KEY_NPM_REGISTRY:
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
      return apiManagerInstance;
    case KEY_NPM_API:
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
    const { isCacheEnabled, ...axiosConfig } = makeConfig(key, config);
    if (!instance[key]) {
      instance[key] = decorate(key, this);
      if (isCacheEnabled) {
        this.cache = setupCache({ maxAge: 15 * 60 * 1000 });
        axiosConfig.adapter = this.cache.adapter;
        if (process.env.NODE_ENV === "development") {
          console.info(`[ApiManager](${key}) Cache is enabled`, this.cache);
        }
      }
      this.client = axios.create(axiosConfig);
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
