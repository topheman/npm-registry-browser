import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { apiNpmRegistry } from "../services/apis";
import Search from "../components/Search";

const compileSearchPackage = registryClient => value =>
  registryClient.search(value).then(({ results }) => results);

const compileGoToPackage = history => packageName =>
  history.push(`/package/${packageName}`);

const SearchContainer = ({ history, className, style }) => (
  <div className={className} style={style}>
    <Search
      fetchInfos={compileSearchPackage(apiNpmRegistry())}
      goToPackage={compileGoToPackage(history)}
    />
  </div>
);

SearchContainer.propTypes = {
  history: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};
SearchContainer.defaultProps = {
  className: "",
  style: {}
};

export default withRouter(SearchContainer);
