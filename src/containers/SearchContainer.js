import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { isMobile } from "../utils/helpers";
import { apiNpmsIo } from "../services/apis";
import { parseQueryString } from "../utils/url";

import Search from "../components/Search";

/**
 * You can pass the following (they are switchable - take same args + return same shape of objects):
 * - apiNpmRegistry().search
 * - apiNpmsIo().suggestions
 *
 * @param {Function} search function from the API
 */
const compileSearchPackage = searchApi => (...args) =>
  searchApi(...args).then(({ results }) => results);

const compileGoToPackage = history => packageName =>
  history.push(`/package/${packageName}`);

const compileGoToSearchResults = history => searchValue =>
  history.push(`/search?q=${searchValue}`);

const SearchContainer = ({ history, location, className, style }) => (
  <div className={className} style={style}>
    <Search
      searchQuery={parseQueryString(location.search).q || ""}
      isMobile={isMobile(navigator && navigator.userAgent)}
      fetchInfos={compileSearchPackage(apiNpmsIo().suggestions)}
      goToPackage={compileGoToPackage(history)}
      goToSearchResults={compileGoToSearchResults(history)}
    />
  </div>
);

SearchContainer.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};
SearchContainer.defaultProps = {
  className: "",
  style: {}
};

export default withRouter(SearchContainer);
