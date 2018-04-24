/**
 * Simple wrapper for sparkline
 *
 * There is no componentWillUpdate mechanism (in case you update data or width).
 * Since it is meant to display still data, I kept it simple.
 *
 * More complex dataviz here: https://github.com/topheman/d3-react-experiments
 */

import React, { Component } from "react";
import PropTypes from "prop-types";

// temporary hack
// see src/libs/README.md for explanation (why not directly use "@fnando/sparkline")
import { sparkline } from "../libs/@fnando/sparkline/src/sparkline";

export default class Sparkline extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    onMouseMove: PropTypes.func,
    onMouseOut: PropTypes.func
  };
  static defaultProps = {
    width: 100,
    height: 30,
    strokeWidth: 3,
    onMouseMove: undefined,
    onMouseOut: undefined
  };
  componentDidMount() {
    this.init(); // only init on mount
  }
  init() {
    if (this.node) {
      const config = {
        onmousemove: this.props.onMouseMove,
        onmouseout: this.props.onMouseOut
      };
      sparkline(this.node, this.props.data, config);
    }
  }
  render() {
    const {
      data, // remove data from the props
      width,
      height,
      strokeWidth,
      ...remainingProps
    } = this.props;
    return (
      <svg
        ref={node => {
          this.node = node;
        }}
        width={width}
        height={height}
        strokeWidth={strokeWidth}
        {...remainingProps}
      />
    );
  }
}
