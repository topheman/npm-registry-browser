import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const SearchResults = ({ results, total }) => (
  <div>
    {total && <p>Total: {total}</p>}
    <ul>
      {results.map(result => (
        <li key={result.package.name}>
          <Link to={`/package/${result.package.name}`}>
            {result.package.name}
          </Link>
        </li>
      ))}
    </ul>
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
