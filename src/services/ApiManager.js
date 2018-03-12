import axios from "axios";
import { setupCache } from "axios-cache-adapter";
import warning from "warning";

let instance = null;

/**
 * Merges the config object with the defaults.
 * You can pass any axios-specific config.
 * You can also pass the following project specific attributes:
 *  - isCacheEnabled {Boolean}
 * @param {*} config
 */
const makeConfig = (config = {}) => {
  const mergedConfig = {
    baseURL: process.env.REACT_APP_NPM_REGISTRY_API_BASE_URL,
    isCacheEnabled:
      process.env.REACT_APP_NPM_REGISTRY_API_CACHE_ENABLED === "true",
    ...config
  };
  return mergedConfig;
};

/**
 * Make scoped packages names safe
 */
const encodePackageName = name => name.replace("/", "%2F");

class SingletonApiManager {
  constructor(config) {
    // extract any non-axios-specific config (like cache mode, mock mode ...)
    const { isCacheEnabled, ...axiosConfig } = makeConfig(config);
    if (!instance) {
      instance = this;
      if (isCacheEnabled) {
        this.cache = setupCache({ maxAge: 15 * 60 * 1000 });
        axiosConfig.adapter = this.cache.adapter;
        if (process.env.NODE_ENV === "development") {
          console.info("[ApiManager] Cache is enabled", this.cache);
        }
      }
      this.client = axios.create(axiosConfig);
    }
    if (process.env.NODE_ENV === "development") {
      console.info("[ApiManager] Config", axiosConfig);
    }
  }
  /**
   * Retrieve package info
   * @param {String} name (full also scoped packages)
   * @param @optional {String} version
   */
  packageInfos(name, version) {
    const query =
      encodePackageName(name) +
      (typeof version !== "undefined" ? `/${version}` : "");
    return this.client.get(query);
  }
}

export const getInstance = () => {
  // if .init() wasn't called, the default config of constructor will be used
  if (!instance) {
    return new SingletonApiManager();
  }
  return instance;
};

export const init = config => {
  // prevent re-init (prevent re-instanciation is built-in SingletonApiManager)
  if (instance) {
    warning(
      false,
      "[ApiManager] .init(config) has no effect once .getInstance() or .init() have been called before."
    );
    return instance;
  }
  return new SingletonApiManager(config);
};
