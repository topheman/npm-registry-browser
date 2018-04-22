import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { apiNpmsIo } from "../services/apis";
import { parseQueryString } from "../utils/url";

import SearchResults from "../components/SearchResults";

class SearchResultsContainer extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired
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
        state: "loading"
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
    this.fetchSearchResults(this.retrieveSearchQuery());
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
    console.log(this.state.results);
    return (
      <SearchResults results={this.state.results} total={this.state.total} />
    );
  }
}

export default withRouter(SearchResultsContainer);
