import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "material-ui/Button";
import Menu, { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";

import { formatPackageString } from "../../utils/string";

const styles = theme => {
  console.log(theme);
  return {
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
    },
    h1: {
      paddingTop: "11px",
      [theme.breakpoints.down("sm")]: {
        fontSize: theme.typography.pxToRem(20)
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.pxToRem(36)
      }
    }
  };
};

/**
 * That way, the name/version of the package will be displayed even if the API hasn't answered
 * It will only be interactive when the infos is ready to be displayed
 */
const ButtonOrHeading = ({
  children,
  packageInfos,
  onClick, // only called when packageInfos is loaded
  classes,
  ...props
}) => {
  if (packageInfos) {
    return (
      <Button onClick={onClick} className={classes.button} {...props}>
        {children}
        <ExpandMoreIcon />
      </Button>
    );
  }
  return (
    <h1 {...props} className={classes.h1}>
      {children}
    </h1>
  );
};

ButtonOrHeading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]), // eslint-disable-line react/require-default-props
  packageInfos: PropTypes.object, // eslint-disable-line react/require-default-props
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

class Title extends Component {
  state = {
    anchorEl: null
  };
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  render() {
    const { scope, name, version, packageInfos, classes } = this.props;
    const { anchorEl } = this.state;
    return (
      <Fragment>
        <ButtonOrHeading
          aria-owns={anchorEl ? "simple-menu" : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          packageInfos={packageInfos}
          classes={classes}
        >
          {formatPackageString({ scope, name, version })}
        </ButtonOrHeading>
        {packageInfos && (
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            {Object.entries(packageInfos["dist-tags"]).map(
              ([tag, correspondingVersion]) => (
                <MenuItem
                  key={`${tag}-${correspondingVersion}`}
                  onClick={this.handleClose}
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
                  key={availableVersion}
                  onClick={this.handleClose}
                  component={Link}
                  to={`/package/${formatPackageString({
                    scope,
                    name,
                    version: availableVersion
                  })}`}
                  selected={availableVersion === version}
                >
                  {availableVersion}
                </MenuItem>
              ))}
          </Menu>
        )}
      </Fragment>
    );
  }
}

Title.propTypes = {
  scope: PropTypes.string, // eslint-disable-line react/require-default-props
  name: PropTypes.string.isRequired,
  version: PropTypes.string, // eslint-disable-line react/require-default-props
  packageInfos: PropTypes.object, // eslint-disable-line react/require-default-props
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Title);
