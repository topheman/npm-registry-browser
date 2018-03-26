import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { getInstance as api } from "../services/ApiManager";
import Search from "../components/Search";

const compileSearchPackage = registryClient => value =>
  registryClient.search(value).then(({ data }) => {
    if (data && data.objects && data.objects.length > 0) {
      return data.objects.map(item => item.package);
    }
    return [];
  });

const compileGoToPackage = history => packageName =>
  history.push(`/package/${packageName}`);

const SearchContainer = ({ history, className, style }) => (
  <div className={className} style={style}>
    <Search
      fetchInfos={compileSearchPackage(api("npmRegistry"))}
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
