import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "material-ui/Button";
import Menu, { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";

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
        <Button
          aria-owns={anchorEl ? "simple-menu" : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          className={classes.button}
          disabled={!packageInfos}
        >
          {formatPackageString({ scope, name, version })}
          {packageInfos && <ExpandMoreIcon />}
        </Button>
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
