/**
 * Inspired by https://www.synyx.de/blog/2017-12-14-ux-waiting-komponente/
 * Github https://github.com/bseber/waiting
 *
 * Don't show the loader until 100ms have passed for better UX
 * More about that: https://www.nngroup.com/articles/response-times-3-important-limits/
 */

import React from "react";
import PropTypes from "prop-types";

const TIMEOUT = 100;

export default class Waiting extends React.Component {
  static propTypes = {
    loader: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    loading: PropTypes.bool.isRequired,
    render: PropTypes.func.isRequired
  };

  static defaultProps = {
    loader: () => <div>LOADING ...</div>,
    loading: true,
    render: () => null
  };

  constructor(props) {
    super();
    this.state = {
      loading: props.loading,
      inDecision: props.loading
    };
  }

  componentDidMount() {
    if (this.state.inDecision) {
      this._loadingTimeout = window.setTimeout(() => {
        this.setState({
          loading: true,
          inDecision: false
        });
      }, TIMEOUT);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading) {
      window.clearTimeout(this._loadingTimeout);
      if (nextProps.loading) {
        this.setState({ inDecision: true });
        this._loadingTimeout = window.setTimeout(() => {
          this.setState({
            loading: nextProps.loading,
            inDecision: false
          });
        }, TIMEOUT);
      } else {
        this.setState({
          loading: false,
          inDecision: false
        });
      }
    }
  }

  renderLoader() {
    const { loader } = this.props;
    return typeof loader === "function" ? loader() : loader;
  }

  renderContent() {
    if (this.state.inDecision) {
      return null;
    } else if (this.state.loading) {
      return <div>{this.renderLoader()}</div>;
    }
    return this.props.render();
  }

  render() {
    return this.renderContent();
  }
}
