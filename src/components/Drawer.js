import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import MuiDrawer from "material-ui/Drawer";
import hoistNonReactStatics from "hoist-non-react-statics";

const DrawerContext = createContext({});

const availablePositions = ["top", "bottom", "left", "right"];

const Drawer = ({ anchor, open, onClose, children, ...props }) => (
  <MuiDrawer anchor={anchor} open={open} onClose={onClose} {...props}>
    <div tabIndex={0} role="button" onClick={onClose} onKeyDown={onClose}>
      {children}
    </div>
  </MuiDrawer>
);

Drawer.propTypes = {
  anchor: PropTypes.oneOf(availablePositions).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired
};

export default Drawer;

export class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    availablePositions.forEach(position => {
      this.state[position] = false; // eslint-disable-line react/no-direct-mutation-state
    });
    this.toggleDrawer.bind(this);
  }
  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };
  render() {
    return (
      <DrawerContext.Provider
        value={{
          toggleDrawer: this.toggleDrawer,
          availablePositions,
          ...this.state
        }}
      >
        {this.props.children}
      </DrawerContext.Provider>
    );
  }
}

Provider.propTypes = {
  children: PropTypes.element.isRequired
};

export const ConnectedDrawer = ({ render }) => (
  <DrawerContext.Consumer>{props => render(props)}</DrawerContext.Consumer>
);
ConnectedDrawer.propTypes = {
  render: PropTypes.func.isRequired
};

export const withDrawer = () => Comp => {
  function Wrapper(props) {
    const { innerRef, ...remainingProps } = props;
    return (
      <ConnectedDrawer
        render={drawer => (
          <Comp {...remainingProps} drawer={drawer} ref={innerRef} />
        )}
      />
    );
  }
  Wrapper.displayName = `withDrawer(${Component.displayName ||
    Component.name})`;
  Wrapper.propTypes = {
    innerRef: PropTypes.func // eslint-disable-line
  };
  Wrapper.WrappedComponent = Component;
  return hoistNonReactStatics(Wrapper, Component);
};
