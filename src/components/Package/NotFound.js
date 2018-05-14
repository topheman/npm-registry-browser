import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

const styles = {
  root: {
    "& h2, & p": {
      textAlign: "center"
    }
  },
  emoji: {
    lineHeight: "100px",
    fontSize: "70px"
  }
};

const NotFound = ({ classes, packageName, className, ...remainingProps }) => (
  <div className={classNames(classes.root, className)} {...remainingProps}>
    <h2>Not Found</h2>
    <p>Package &quot;{packageName}&quot; not found</p>
    <p>
      <span role="img" aria-label="Package" className={classes.emoji}>
        📦
      </span>
    </p>
  </div>
);

NotFound.propTypes = {
  packageName: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
};
NotFound.defaultProps = {
  className: undefined
};

export default withStyles(styles)(NotFound);
