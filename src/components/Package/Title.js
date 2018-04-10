import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "material-ui/Button";
import Menu, { MenuItem, MenuList } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Drawer from "material-ui/Drawer";
import { withStateHandlers, compose } from "recompose";
import { ConnectedWindowInfos } from "../WindowInfos";

import { formatPackageString } from "../../utils/string";

const styles = theme => ({
  button: {
    textTransform: "none",
    marginLeft: -16,
    color: theme.palette.primary.main,
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.typography.pxToRem(20)
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: theme.typography.pxToRem(36)
    }
  }
});

/**
 * MenuWrapper and DrawerWrapper have the same interface
 * they accept the same props, in order to be able to use them in
 * mobile or desktop mode, providing the same props.
 */
const MenuWrapper = ({ anchorEl, handleClose, ...props }) => (
  <Menu
    className="Title__Menu Title__Wrapper"
    id="simple-menu"
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleClose}
    {...props}
  />
);
MenuWrapper.propTypes = {
  anchorEl: PropTypes.object,
  handleClose: PropTypes.func.isRequired
};
MenuWrapper.defaultProps = {
  anchorEl: undefined
};
const DrawerWrapper = ({ anchorEl, handleClose, children, ...props }) => (
  <Drawer
    className="Title__Drawer Title__Wrapper"
    anchor="right"
    open={Boolean(anchorEl)}
    onClose={handleClose}
    {...props}
  >
    <div>{children}</div>
  </Drawer>
);
DrawerWrapper.propTypes = MenuWrapper.propTypes;
DrawerWrapper.defaultProps = MenuWrapper.defaultProps;

/**
 * This component displays the list of versions as:
 * - a popup Menu (if window.length > breakpoint.sm (600px))
 * - a drawer List (if window.length < breakpoint.sm (600px))
 */
class VersionList extends Component {
  static propTypes = {
    scope: PropTypes.string,
    name: PropTypes.string.isRequired,
    version: PropTypes.string,
    packageInfos: PropTypes.object,
    handleClose: PropTypes.func.isRequired,
    anchorEl: PropTypes.object,
    theme: PropTypes.object
  };
  static defaultProps = {
    scope: undefined,
    version: undefined,
    packageInfos: undefined,
    anchorEl: null,
    theme: undefined
  };
  /**
   * The List used in Drawer doesn't support init at proper scroll position
   * according to "selected" prop on MenuItem, so added a className to target
   * and adjust the scrollTop
   */
  componentDidUpdate({ anchorEl }) {
    if (this.props.anchorEl !== null && this.props.anchorEl !== anchorEl) {
      setTimeout(() => {
        const selected =
          document && document.querySelector(".Title__Wrapper .selected");
        if (selected && selected.parentElement) {
          selected.parentElement.parentElement.parentElement.scrollTop =
            selected.offsetTop - 100;
        }
      }, 0);
    }
  }
  render() {
    const {
      scope,
      name,
      version,
      packageInfos,
      handleClose,
      anchorEl,
      theme
    } = this.props;
    return (
      <ConnectedWindowInfos
        render={({ windowWidth }) => {
          // According to the window witdh, create a Drawer, or a Menu
          const Wrapper =
            windowWidth > theme.breakpoints.values.sm
              ? MenuWrapper
              : DrawerWrapper;
          return (
            <Wrapper anchorEl={anchorEl} handleClose={handleClose}>
              {packageInfos && (
                <MenuList>
                  {Object.entries(packageInfos["dist-tags"]).map(
                    ([tag, correspondingVersion]) => (
                      <MenuItem
                        button
                        key={`${tag}-${correspondingVersion}`}
                        onClick={handleClose}
                        component={Link}
                        to={`/package/${formatPackageString({
                          scope,
                          name,
                          version: correspondingVersion
                        })}`}
                      >
                        {tag}
                      </MenuItem>
                    )
                  )}
                  {Object.keys(packageInfos.versions)
                    .reverse()
                    .map(availableVersion => (
                      <MenuItem
                        button
                        key={availableVersion}
                        onClick={handleClose}
                        component={Link}
                        to={`/package/${formatPackageString({
                          scope,
                          name,
                          version: availableVersion
                        })}`}
                        selected={availableVersion === version}
                        className={
                          availableVersion === version ? "selected" : ""
                        }
                      >
                        {availableVersion}
                      </MenuItem>
                    ))}
                </MenuList>
              )}
            </Wrapper>
          );
        }}
      />
    );
  }
}

/**
 * This is the exported component that renders a button with the "scope/name@version"
 * It will render a Drawer or a Popup containing the version if clicked on (according to window width)
 */
const Title = ({
  scope,
  name,
  version,
  packageInfos,
  classes,
  handleClick,
  handleClose,
  anchorEl,
  theme
}) => (
  <Fragment>
    <Button
      aria-owns={anchorEl ? "simple-menu" : null}
      aria-haspopup="true"
      onClick={handleClick}
      className={classes.button}
      disabled={!packageInfos}
    >
      {formatPackageString({ scope, name, version })}
      {packageInfos && <ExpandMoreIcon />}
    </Button>
    {packageInfos && (
      <VersionList
        scope={scope}
        name={name}
        version={version}
        packageInfos={packageInfos}
        handleClose={handleClose}
        anchorEl={anchorEl}
        theme={theme}
      />
    )}
  </Fragment>
);

Title.propTypes = {
  scope: PropTypes.string,
  name: PropTypes.string.isRequired,
  version: PropTypes.string,
  packageInfos: PropTypes.object,
  classes: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.object,
  theme: PropTypes.object
};
Title.defaultProps = {
  scope: undefined,
  version: undefined,
  packageInfos: undefined,
  anchorEl: null,
  theme: undefined
};

export default compose(
  withStateHandlers(
    { anchorEl: null }, // initial state
    {
      handleClick: () => event => ({
        anchorEl: event.currentTarget || event.target // currentTarget is not persisted using withStateHandlers - https://github.com/acdlite/recompose/issues/616
      }),
      handleClose: () => () => ({
        anchorEl: null
      })
    }
  ),
  withStyles(styles, { withTheme: true })
)(Title);
