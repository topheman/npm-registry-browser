import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { withStyles } from "material-ui/styles";

import { formatPackageString } from "../utils/string";
import Markdown from "./Markdown";

const styles = {
  description: {
    fontStyle: "italic"
  }
};

const Package = ({
  scope,
  name,
  version,
  stateNpmRegistry,
  stateNpmApi,
  packageInfos,
  downloads,
  loadApiInfos,
  loadRegistryInfos,
  classes
}) => (
  <div>
    <h1>{formatPackageString({ scope, name, version })}</h1>
    {stateNpmRegistry === "loaded" &&
      packageInfos &&
      packageInfos.versions[version].description && (
        <p className={classes.description}>
          {packageInfos.versions[version].description}
        </p>
      )}
    {(stateNpmRegistry === "loaded" &&
      (packageInfos &&
        packageInfos.versions[version].readme && (
          <Markdown source={packageInfos.versions[version].readme} />
        ))) ||
      (stateNpmRegistry === "loaded" &&
        packageInfos &&
        packageInfos.readme && <Markdown source={packageInfos.readme} />)}
    <h2>Downloads</h2>
    {stateNpmApi === "error" && (
      <div>
        Error -{" "}
        <button onClick={() => loadApiInfos(scope, name)}>reload</button>
      </div>
    )}
    {stateNpmApi === "loading" && <div>... loading stats ...</div>}
    {stateNpmApi === "loaded" && (
      <Fragment>
        <p>Stats for all versions:</p>
        <ul>
          <li>
            Last day:{" "}
            {downloads.downloads[
              downloads.downloads.length - 1
            ].downloads.toLocaleString()}
          </li>
          <li>
            Last month:{" "}
            {downloads.downloads
              .reduce((acc, { downloads: dl }) => acc + dl, 0)
              .toLocaleString()}
          </li>
        </ul>
      </Fragment>
    )}
    <h2>Versions</h2>
    {stateNpmRegistry === "error" && (
      <div>
        Error -{" "}
        <button onClick={() => loadRegistryInfos(scope, name, version)}>
          reload
        </button>
      </div>
    )}
    {stateNpmRegistry === "loading" && (
      <div>... loading registry infos ...</div>
    )}
    {stateNpmRegistry === "loaded" && (
      <ul>
        {Object.keys(packageInfos.versions)
          .reverse()
          .map(availableVersion => (
            <li key={availableVersion}>
              <Link
                to={`/package/${formatPackageString({
                  scope,
                  name,
                  version: availableVersion
                })}`}
              >
                {availableVersion}
              </Link>
            </li>
          ))}
      </ul>
    )}
  </div>
);

Package.propTypes = {
  scope: PropTypes.string, // eslint-disable-line react/require-default-props
  name: PropTypes.string, // eslint-disable-line react/require-default-props
  version: PropTypes.string, // eslint-disable-line react/require-default-props
  stateNpmRegistry: PropTypes.string.isRequired,
  stateNpmApi: PropTypes.string.isRequired,
  packageInfos: PropTypes.object, // eslint-disable-line react/require-default-props
  downloads: PropTypes.object, // eslint-disable-line react/require-default-props
  loadApiInfos: PropTypes.func.isRequired,
  loadRegistryInfos: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Package);
