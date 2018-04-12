/**
 * This script is meant to be required by react-scripts to inject infos as env vars on the fly.
 * It's an alternative to the DefinePlugin of webpack for create-react-app without ejecting.
 *
 * That way the vars you expose on process.env bellow will accessible as create-react-app env vars.
 *
 * Limitations:
 * - They can only be strings.
 * - This script is required before any env vars are set by react-scripts
 *    -> you can't rely on NODE_ENV for example
 *
 * Example usage: "start": "react-scripts --require ./bin/expand-metadatas.js start"
 */

const { getBanner, getInfos } = require("../common");

const isMock =
  process.env.REACT_APP_NPM_REGISTRY_API_MOCKS_ENABLED === "true" ||
  process.env.REACT_APP_NPM_API_MOCKS_ENABLED === "true";

process.env.REACT_APP_METADATAS_BANNER_HTML = getBanner(
  "formatted",
  isMock ? ["This is a mocked version", ""] : []
);

process.env.REACT_APP_METADATAS_VERSION = getInfos().pkg.version;
