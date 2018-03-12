import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { formatPackageString } from "../../utils/string";
import { getInstance as api } from "../../services/ApiManager";

export default class Package extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.loadInfos = this.loadInfos.bind(this);
  }
  state = {
    state: "loading"
  };
  async componentDidMount() {
    const { scope, name } = this.props.match.params;
    this.loadInfos(scope, name);
  }
  componentWillReceiveProps(newProps) {
    const { scope, name, version } = this.props.match.params;
    const {
      scope: newScope,
      name: newName,
      version: newVersion
    } = newProps.match.params;
    if (scope !== newScope || name !== newName || version !== newVersion) {
      this.loadInfos(newScope, newName);
    }
  }
  async loadInfos(scope, name) {
    this.setState({ state: "loading" });
    try {
      const { data: packageInfos } = await api().packageInfos(
        formatPackageString({ scope, name })
      );
      console.log(packageInfos.name, { packageInfos });
      this.setState({ packageInfos, state: "loaded" });
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
