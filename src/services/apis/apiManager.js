/**
 * You may create a module where you declare your config and export configure(config)
 * like it's done in ./index.js to separate implementation from configuration
 * And never directly call methods in here from the rest of your project.
 */

import invariant from "invariant";

import Manager from "./Manager";

// the following variables are inititlized with configure(config)

/**
 * Cache the config passed through configure(config)
 */
let baseConfig = null;

let acceptedKeys = [];

/**
 * Cache the instances of the multiton
 * Hashmap: - initialized with configure(config)
 *          - populated when you call getInstance(key)
 */
const instances = {};

/**
 * You must first configure the multiton
 * @param {Object} config
 * @return {Object}
 */
export const configure = config => {
  if (baseConfig) {
    console.warn("[apiManager][configure] Already configured");
    return baseConfig;
  }
  acceptedKeys = Object.keys(config);
  acceptedKeys.forEach(key => {
    instances[key] = null;
  });
  baseConfig = config;
  return baseConfig;
};

/**
 * Once you configured the multiton, you can retrieve the same instance
 * of each of your apis through this utility
 *
 * @param {Object} key
 * @return {Object}
 */
export const getInstance = key => {
  invariant(
    !!baseConfig,
    `[apiManager] You must call .configure(config) before calling .getInstance(key)`
  );
  invariant(
    acceptedKeys.includes(key),
    `[apiManager](${key}) .getInstance(key) only accepts: ${acceptedKeys.join(
      ", "
    )}`
  );
  // ensure return the same instance all the time (only create a new one the first time)
  if (!instances[key]) {
    instances[key] = new Manager(baseConfig[key], key);
  }
  return instances[key];
};
