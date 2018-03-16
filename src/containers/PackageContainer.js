import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { match as matchSemver } from "semver-match";

import { formatPackageString } from "../utils/string";
import { getInstance as api } from "../services/ApiManager";

class Package extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.loadRegistryInfos = this.loadRegistryInfos.bind(this);
  }
  state = {
    stateNpmRegistry: "loading",
    stateNpmApi: "loading"
  };
  async componentDidMount() {
    const { scope, name, version } = this.props.match.params;
    this.loadRegistryInfos(scope, name, version);
    this.loadApiInfos(scope, name);
  }
  /**
   * Once the container is mounted, we have to track for changes in the router
   * to relaunch xhr to npm-registry, since componentDidMount won't be re-triggered
   * That way, we trigger this.loadRegistryInfos with fresh props from the router
   * @param {Object} newProps
   */
  componentWillReceiveProps(newProps) {
    const { scope, name } = this.props.match.params;
    const {
      scope: newScope,
      name: newName,
      version: newVersion
    } = newProps.match.params;
    // no need to track version for registry infos (since all versions are included)
    if (scope !== newScope || name !== newName) {
      this.loadRegistryInfos(newScope, newName, newVersion);
      this.loadApiInfos(scope, name);
    }
  }
  /**
   * Redirect a final version is matched
   * Returns the matched versions if matched (and redirects the router).
   * If no need to redirect, returns false.
   * @param {String} scope
   * @param {String} name
   * @param {String} range
   * @param {Array} versions
   * @param {Object} distTags
   * @return {Boolean|String}
   */
  redirectUntilMatchVersion(scope, name, range, versions = [], distTags = {}) {
    if (typeof range !== "undefined") {
      const matchedVersion = matchSemver(range, versions, distTags) || "latest";
      console.log({ range, versions, distTags, matchedVersion });
      if (
        matchedVersion &&
        matchedVersion !== this.props.match.params.version
      ) {
        this.props.history.replace(
          `/package/${formatPackageString({ scope, name })}@${matchedVersion}`
        );
      }
      return matchedVersion;
    }
    return false;
  }
  /**
   * Loads infos from the npm registry.
   * @param {String} scope
   * @param {String} name
   * @param {String} range
   */
  async loadRegistryInfos(scope, name, range) {
    this.setState({ stateNpmRegistry: "loading" });
    try {
      const { data: packageInfos } = await api("npmRegistry").packageInfos(
        formatPackageString({ scope, name })
      );
      console.log(packageInfos.name, { packageInfos });
      const matched = this.redirectUntilMatchVersion(
        scope,
        name,
        range,
        Object.keys(packageInfos.versions),
        packageInfos["dist-tags"]
      );
      if (matched) {
        console.log("matched", matched);
        this.setState({ packageInfos, stateNpmRegistry: "loaded" });
      }
    } catch (e) {
      console.error(e);
      this.setState({ packageInfos: null, stateNpmRegistry: "error" });
    }
  }
  async loadApiInfos(scope, name) {
    this.setState({ stateNpmApi: "loading" });
    try {
      const { data: downloads } = await api("npmApi").downloads(
        formatPackageString({ scope, name })
      );
      console.log({ downloads });
      if (downloads) {
        this.setState({ downloads, stateNpmApi: "loaded" });
      }
    } catch (e) {
      console.error(e);
      this.setState({ downloads: null, stateNpmApi: "error" });
    }
  }
  render() {
    const { scope, name, version } = this.props.match.params;
    const {
      stateNpmRegistry,
      stateNpmApi,
      packageInfos,
      downloads
    } = this.state;
    return (
      <Fragment>
        <h1>{formatPackageString({ scope, name, version })}</h1>
        <h2>Downloads</h2>
        {stateNpmApi === "error" && (
          <div>
            Error -{" "}
            <button onClick={() => this.loadApiInfos(scope, name)}>
              reload
            </button>
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
            <button
              onClick={() => this.loadRegistryInfos(scope, name, version)}
            >
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
      </Fragment>
    );
  }
}

/**
 * Gives access to history/location/match in props from the router - https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md
 */
export default withRouter(Package);
