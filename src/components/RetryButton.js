import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import RefreshIcon from "@material-ui/icons/Refresh";

const styles = theme => ({
  root: {
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      padding: "10px 10px"
    },
    [theme.breakpoints.up("sm")]: {
      padding: "60px 10px"
    }
  }
});

const RetryButton = ({ onClick, classes }) => (
  <div className={classes.root}>
    <Button variant="raised" color="primary" onClick={onClick}>
      <RefreshIcon /> Retry
    </Button>
  </div>
);

RetryButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RetryButton);
