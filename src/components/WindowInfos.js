// inspired by https://github.com/topheman/d3-react-experiments/blob/master/src/components/WindowInfos/Provider.js

import React, { Component, createContext, forwardRef } from "react";
import PropTypes from "prop-types";
import hoistNonReactStatics from "hoist-non-react-statics";

import { debounce } from "../utils/helpers";

const WindowInfosContext = createContext({});

/** Provider part */

export class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: global.width || 960,
      windowHeight: global.height || 640
    };
    // create the debounced handle resize, to prevent flooding with resize events and pass down some computed width and height to the children
    this.debouncedHandleResize = debounce(
      () =>
        this.setState({
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight
        }),
      props.debounceTime
    );
  }

  componentDidMount() {
    window.addEventListener("resize", this.debouncedHandleResize);
    // update the state once mounted to pass window size to children on the very first render
    setTimeout(() => {
      this.setState({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      });
    }, 0);
  }

  componentWillUnmount() {
    // cleanup after unmount
    window.removeEventListener("resize", this.debouncedHandleResize);
  }

  render() {
    return (
      <WindowInfosContext.Provider value={this.state}>
        {this.props.children}
      </WindowInfosContext.Provider>
    );
  }
}
Provider.propTypes = {
  debounceTime: PropTypes.number.isRequired,
  children: PropTypes.element.isRequired
};
Provider.defaultProps = {
  debounceTime: 500
};

/** Component with render props part */

export const ConnectedWindowInfos = ({ render }) => (
  <WindowInfosContext.Consumer>
    {props => render(props)}
  </WindowInfosContext.Consumer>
);
ConnectedWindowInfos.propTypes = {
  render: PropTypes.func.isRequired
};

/** Higher Order Component (HOC) part */

export const withWindowInfos = () => Comp => {
  // second argument `ref` injected via `forwardRef`
  function Wrapper(props, ref) {
    return (
      <ConnectedWindowInfos
        render={windowInfos => (
          <Comp {...props} windowInfos={windowInfos} ref={ref} />
        )}
      />
    );
  }
  Wrapper.displayName = `withWindowInfos(${Comp.displayName ||
    Comp.name ||
    "Component"})`;
  const WrapperWithRef = forwardRef(Wrapper);
  hoistNonReactStatics(WrapperWithRef, Comp);
  WrapperWithRef.WrappedComponent = Comp;
  return WrapperWithRef;
};
