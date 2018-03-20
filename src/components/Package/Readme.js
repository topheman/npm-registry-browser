import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import Markdown from "../Markdown";

import "./Readme.css";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  heading: {
    fontSize: theme.typography.pxToRem(12)
  },
  bookIcon: {
    verticalAlign: "middle",
    marginRight: "8px"
  },
  markdown: {
    overflow: "scroll"
  }
});

const Readme = ({ classes, source }) => (
  <Markdown
    source={source}
    className={`Readme-markdown__root ${classes.markdown}`}
  />
);

Readme.propTypes = {
  classes: PropTypes.object.isRequired,
  source: PropTypes.string
};
Readme.defaultProps = {
  source: ""
};

export default withStyles(styles)(Readme);
