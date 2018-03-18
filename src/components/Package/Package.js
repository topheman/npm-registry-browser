import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";

import Title from "./Title";
import Readme from "./Readme";

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
    <Title
      scope={scope}
      name={name}
      version={version}
      packageInfos={packageInfos}
    />
    {stateNpmRegistry === "loaded" &&
      packageInfos &&
      packageInfos.versions[version] &&
      packageInfos.versions[version].description && (
        <Fragment>
          <p>
            {stateNpmRegistry === "loaded" &&
              packageInfos &&
              packageInfos.time &&
              packageInfos.time[version] &&
              new Date(packageInfos.time[version]).toLocaleDateString()}
          </p>
          <p className={classes.description}>
            {packageInfos.versions[version].description}
          </p>
        </Fragment>
      )}
    {(stateNpmRegistry === "loaded" &&
      (packageInfos &&
        packageInfos.versions[version] &&
        packageInfos.versions[version].readme && (
          <Readme source={packageInfos.versions[version].readme} />
        ))) ||
      (stateNpmRegistry === "loaded" &&
        packageInfos &&
        packageInfos.readme && <Readme source={packageInfos.readme} />)}
    <h2>Stats</h2>
    {stateNpmApi === "error" && (
      <div>
        Error -{" "}
        <button onClick={() => loadApiInfos(scope, name)}>reload</button>
      </div>
    )}
    {stateNpmApi === "loading" && <div>... loading stats ...</div>}
    {stateNpmApi === "loaded" && (
      <Fragment>
        <p>For all versions:</p>
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
    <h2>Infos</h2>
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
    {stateNpmRegistry === "loaded" && <div>loaded</div>}
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
