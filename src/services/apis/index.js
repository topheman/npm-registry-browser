/**
 * This file only contains the configuration part of the apis.
 * ALL the implementation part takes place in ./apiManager and its dependencies
 *
 * That way, you can change the config without touching the implementation
 */

import { configure, getInstance } from "./apiManager";

import { TARGET_API_NPM_API, TARGET_API_NPM_REGISTRY } from "./constants";

/**
 * Make scoped packages names safe
 */
const encodePackageName = name => name.replace("/", "%2F");

const decorateNpmRegistryApi = ({ client /* , cache, key */ }) => ({
  packageInfos: (name, version) => {
    const query =
      encodePackageName(name) +
      (typeof version !== "undefined" ? `/${version}` : "");
    return client.get(query);
  },
  search: value => {
    const query = `/-/v1/search?text=${encodeURIComponent(value)}`;
    return client.get(query);
  }
});

const decorateNpmApi = ({ client /* , cache, key */ }) => ({
  downloads: (name, range = "last-month") => {
    const query = "/downloads/range/" + range + "/" + encodePackageName(name);
    return client.get(query);
  }
});

const config = {
  [TARGET_API_NPM_REGISTRY]: {
    httpClientBaseConfig: {
      timeout: Number(process.env.REACT_APP_NPM_REGISTRY_API_TIMEOUT),
      baseURL: process.env.REACT_APP_NPM_REGISTRY_API_BASE_URL
    },
    managerConfig: {
      decorateApi: decorateNpmRegistryApi,
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
      preprocessMocking: ([status, response, headers] /* , config */) => [
        status,
        response,
        {
          ...headers,
          Date: new Date().toString() // adjust date header
        }
      ]
    }
  },
  [TARGET_API_NPM_API]: {
    httpClientBaseConfig: {
      timeout: Number(process.env.REACT_APP_NPM_API_TIMEOUT),
      baseURL: process.env.REACT_APP_NPM_API_BASE_URL
    },
    managerConfig: {
      decorateApi: decorateNpmApi,
      isCacheEnabled: process.env.REACT_APP_NPM_API_CACHE_ENABLED === "true",
      mocks:
        process.env.REACT_APP_NPM_API_MOCKS_ENABLED === "true"
          ? [].concat(require("./mocks/npmApi.fixtures.json"))
          : undefined,
      makeMockedClient:
        process.env.REACT_APP_NPM_API_MOCKS_ENABLED === "true"
          ? require("./httpClientMock").makeMockedClient
          : undefined,
      preprocessMocking: ([status, response, headers] /* , config */) => [
        status,
        response,
        {
          ...headers,
          Date: new Date().toString() // adjust date header
        }
      ]
    }
  }
};

export const init = () => configure(config);

export const apiNpmRegistry = () => getInstance(TARGET_API_NPM_REGISTRY);

export const apiNpmApi = () => getInstance(TARGET_API_NPM_API);
