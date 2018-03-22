import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "material-ui/Button";
import Menu, { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
import { withStateHandlers, compose } from "recompose";

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

const Title = ({
  scope,
  name,
  version,
  packageInfos,
  classes,
  handleClick,
  handleClose,
  anchorEl
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
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.entries(packageInfos["dist-tags"]).map(
          ([tag, correspondingVersion]) => (
            <MenuItem
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
              key={availableVersion}
              onClick={handleClose}
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

Title.propTypes = {
  scope: PropTypes.string,
  name: PropTypes.string.isRequired,
  version: PropTypes.string,
  packageInfos: PropTypes.object,
  classes: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.object
};
Title.defaultProps = {
  scope: undefined,
  version: undefined,
  packageInfos: undefined,
  anchorEl: null
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
  withStyles(styles)
)(Title);
