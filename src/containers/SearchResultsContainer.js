import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { LinearProgress } from "material-ui/Progress";
import { withStyles } from "material-ui/styles";

import { apiNpmsIo } from "../services/apis";
import { parseQueryString } from "../utils/url";

import SearchResults from "../components/SearchResults";

const styles = {
  progressWrapper: {
    position: "fixed",
    top: "0px",
    left: "0px",
    zIndex: 1101 // the header has a z-index
  },
  progress: { width: "100vw" }
};

class SearchResultsContainer extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  };
  /**
   * Track props.location.search and save it internally in state.search
   * when it changes to tag state.state = "loading"
   * That way, componentDidUpdate will pick it up and fire a request
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.location.search !== prevState.search) {
      return {
        search: nextProps.location.search,
        state:
          nextProps.location.search.length > 0 ? "loading" : prevState.state // dont launch fetch until there is a query specified
      };
    }
    return null; // the new props do not require state updates
  }
  state = {
    search: "",
    state: "loaded",
    results: [],
    total: null
  };
  componentDidMount() {
    if (this.state.state === "loading") {
      this.fetchSearchResults(this.retrieveSearchQuery());
    }
  }
  componentDidUpdate() {
    if (this.state.state === "loading") {
      this.fetchSearchResults(this.retrieveSearchQuery());
    }
  }
  /**
   * Returns the "q" parameter from the url "#/search?q=foo"
   */
  retrieveSearchQuery() {
    return parseQueryString(this.props.location.search).q;
  }
  async fetchSearchResults(searchValue) {
    try {
      const { results, total } = await apiNpmsIo().search(searchValue);
      this.setState({
        results,
        total,
        state: "loaded"
      });
    } catch (e) {
      this.setState({
        state: "error"
      });
    }
  }
  render() {
    const { state: loadingState, results, total } = this.state;
    const { classes } = this.props;
    return (
      <Fragment>
        {loadingState === "loading" && (
          <div className={classes.progressWrapper}>
            <LinearProgress className={classes.progress} />
          </div>
        )}
        <SearchResults results={results} total={total} />
      </Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(SearchResultsContainer));
