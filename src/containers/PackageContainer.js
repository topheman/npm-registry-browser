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
    this.loadInfos = this.loadInfos.bind(this);
  }
  state = {
    state: "loading"
  };
  async componentDidMount() {
    const { scope, name, version } = this.props.match.params;
    this.loadInfos(scope, name, version);
  }
  /**
   * Once the container is mounted, we have to track for changes in the router
   * to relaunch xhr to npm-registry, since componentDidMount won't be re-triggered
   * That way, we trigger this.loadInfos with fresh props from the router
   * @param {Object} newProps
   */
  componentWillReceiveProps(newProps) {
    const { scope, name, version } = this.props.match.params;
    const {
      scope: newScope,
      name: newName,
      version: newVersion
    } = newProps.match.params;
    if (scope !== newScope || name !== newName || version !== newVersion) {
      this.loadInfos(newScope, newName, newVersion);
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
  async loadInfos(scope, name, range) {
    this.setState({ state: "loading" });
    try {
      const { data: packageInfos } = await api().packageInfos(
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
        this.setState({ packageInfos, state: "loaded" });
      }
    } catch (e) {
      console.error(e);
      this.setState({ packageInfos: null, state: "error" });
    }
  }
  render() {
    const { scope, name, version } = this.props.match.params;
    const { state, packageInfos } = this.state;
    return (
      <Fragment>
        <h1>{formatPackageString({ scope, name, version })}</h1>
        {state === "error" && (
          <div>
            Error -{" "}
            <button onClick={() => this.loadInfos(scope, name)}>reload</button>
          </div>
        )}
        {state === "loading" && <div>... loading ...</div>}
        {state === "loaded" && (
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
