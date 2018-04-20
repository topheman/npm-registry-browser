import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { apiNpmsIo } from "../services/apis";
import Search from "../components/Search";

/**
 * You can pass the following (they are switchable - take same args + return same shape of objects):
 * - apiNpmRegistry().search
 * - apiNpmsIo().suggestions
 *
 * @param {Function} search function from the API
 */
const compileSearchPackage = searchApi => value =>
  searchApi(value).then(({ results }) => results);

const compileGoToPackage = history => packageName =>
  history.push(`/package/${packageName}`);

const SearchContainer = ({ history, className, style }) => (
  <div className={className} style={style}>
    <Search
      fetchInfos={compileSearchPackage(apiNpmsIo().suggestions)}
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
