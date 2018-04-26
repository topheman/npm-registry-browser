/**
 * This file only contains the configuration part of the apis.
 * ALL the implementation part takes place in ./apiManager and its dependencies
 *
 * That way, you can change the config without touching the implementation
 */

import { configure, getInstance } from "./apiManager";

import {
  TARGET_API_NPM_API,
  TARGET_API_NPM_REGISTRY,
  TARGET_API_NPMS_IO
} from "./constants";

/**
 * Make scoped packages names safe
 */
const encodePackageName = name => name.replace("/", "%2F");

const decorateNpmRegistryApi = ({ client /* , cache, key */ }) => ({
  packageInfos: (name, version) => {
    const query =
      encodePackageName(name) +
      (typeof version !== "undefined" ? `/${version}` : "");
    return client.get(query).then(({ data }) => data);
  },
  /**
   * @param {String} value to search
   * @param {Object} [options]
   * @param {Number} [options.size] To limit the number of results
   */
  search: (value, { size } = {}) => {
    const query = `/-/v1/search?text=${encodeURIComponent(value)}${
      size ? `&size=${size}` : ""
    }`;
    return client.get(query).then(({ data }) => {
      const { objects: results, ...remainingAttributes } = data;
      return {
        results: (results || []).map(result => ({
          ...result,
          highlight: result.package.name.replace(value, `<em>${value}</em>`) // mimic the npms.io API
        })),
        ...remainingAttributes
      };
    });
  }
});

const decorateNpmApi = ({ client /* , cache, key */ }) => ({
  downloads: (name, range = "last-month") => {
    const query = "/downloads/range/" + range + "/" + encodePackageName(name);
    return client.get(query).then(({ data }) => data);
  }
});

/**
 * In case the npms.io API goes down, we tag the client as down and use directly
 * the npmRegistry API as fallback (they have the same input / outputs).
 *
 * A downtime in npms.io won't even be noticed
 */
const decorateNpmsIoApi = ({ client /* , cache, key */ }) => ({
  apiIsDown: false,
  /**
   * @param {String} value to search
   * @param {Object} [options]
   * @param {Number} [options.size] To limit the number of results
   */
  search: async (value, { size } = {}) => {
    const query = `/v2/search?q=${encodeURIComponent(value)}${
      size ? `&size=${size}` : ""
    }`;
    // return the same shape of object as npmRegistryApi#search (so that they could be interchangeable)
    if (!this.apiIsDown) {
      try {
        return await client.get(query).then(({ data }) => data);
      } catch (e) {
        console.error(
          "[apiManager](npmsIo) Might be down, switching back to npm registry",
          e.message
        );
        this.apiIsDown = true;
      }
    }
    // the npmsIo api is down, so we call the npm registry
    console.info(
      "[apiManager](npmsIo) DOWN /search - calling search with npmRegistry api"
    );
    // eslint-disable-next-line
    return apiNpmRegistry().search(value, { size });
  },
  /**
   * @param {String} value to search
   * @param {Object} [options]
   * @param {Number} [options.size] To limit the number of results
   */
  suggestions: async (value, { size } = {}) => {
    const query = `/v2/search/suggestions?q=${encodeURIComponent(value)}${
      size ? `&size=${size}` : ""
    }`;
    // return the same shape of object as npmRegistryApi#search (so that they could be interchangeable)
    if (!this.apiIsDown) {
      try {
        return await client.get(query).then(({ data }) => ({ results: data }));
      } catch (e) {
        console.error(
          "[apiManager](npmsIo) Might be down, switching back to npm registry",
          e.message
        );
        this.apiIsDown = true;
      }
    }
    // the npmsIo api is down, so we call the npm registry
    console.info(
      "[apiManager](npmsIo) DOWN /search/suggestions - calling search with npmRegistry api"
    );
    // eslint-disable-next-line
    return apiNpmRegistry().search(value, { size });
  }
});

/**
 * When the app is ran inside cypress, the calls to outside are proxied by cypress,
 * the `Origin` header is not added on CORS requests.
 * You can't manually set this header, you'll have the following error: `Refused to set unsafe header "Origin"`
 *
 * Since the CORS proxies used in production ask for this origin header and it's missing
 * when ran in cypress, we don't run through the CORS proxy when running tests in cypress
 *
 * @param {String} baseURL
 */
const cypressStripBaseUrlFromCorsProxy = baseURL => {
  if (typeof window.Cypress !== "undefined") {
    const [, originalBaseURL] = baseURL.split("/https://");
    if (originalBaseURL) {
      return `https://${originalBaseURL}`;
    }
  }
  return baseURL;
};

const config = {
  [TARGET_API_NPM_REGISTRY]: {
    httpClientBaseConfig: {
      timeout: Number(process.env.REACT_APP_NPM_REGISTRY_API_TIMEOUT),
      baseURL: cypressStripBaseUrlFromCorsProxy(
        process.env.REACT_APP_NPM_REGISTRY_API_BASE_URL
      )
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
      baseURL: cypressStripBaseUrlFromCorsProxy(
        process.env.REACT_APP_NPM_API_BASE_URL
      )
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
  },
  [TARGET_API_NPMS_IO]: {
    httpClientBaseConfig: {
      timeout: Number(process.env.REACT_APP_NPMS_IO_API_TIMEOUT),
      baseURL: cypressStripBaseUrlFromCorsProxy(
        process.env.REACT_APP_NPMS_IO_API_BASE_URL
      )
    },
    managerConfig: {
      decorateApi: decorateNpmsIoApi,
      isCacheEnabled:
        process.env.REACT_APP_NPMS_IO_API_CACHE_ENABLED === "true",
      mocks:
        process.env.REACT_APP_NPMS_IO_API_MOCKS_ENABLED === "true"
          ? [].concat(require("./mocks/npmsIo.fixtures.json"))
          : undefined,
      makeMockedClient:
        process.env.REACT_APP_NPMS_IO_API_MOCKS_ENABLED === "true"
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

export const apiNpmsIo = () => getInstance(TARGET_API_NPMS_IO);
