import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";

const styles = theme => ({
  root: {
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      padding: "10px 10px"
    },
    [theme.breakpoints.up("sm")]: {
      padding: "60px 10px"
    }
  }
});

const RetryButton = ({ onClick, classes, className, ...remainingProps }) => (
  <div className={classNames(classes.root, className)} {...remainingProps}>
    <Button variant="raised" color="primary" onClick={onClick}>
      <RefreshIcon /> Retry
    </Button>
  </div>
);

RetryButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
};
RetryButton.defaultProps = {
  className: undefined
};

export default withStyles(styles)(RetryButton);
