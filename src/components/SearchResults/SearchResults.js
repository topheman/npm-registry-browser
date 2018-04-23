import React from "react";
import PropTypes from "prop-types";

import SearchResultItem from "./SearchResultItem";

const SearchResults = ({ results, total, ...props }) => (
  <div {...props}>
    {results.map(result => (
      <SearchResultItem key={result.package.name} {...result} />
    ))}
    {results.length === 0 && (
      <div style={{ textAlign: "center" }}>No Results</div>
    )}
    {results.length > 0 && total && total > results.length && <div>...</div>}
  </div>
);

SearchResults.propTypes = {
  total: PropTypes.number,
  results: PropTypes.array.isRequired
};

SearchResults.defaultProps = {
  total: undefined
};

export default SearchResults;
