import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import Markdown from "../Markdown";

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
    [theme.breakpoints.down("sm")]: {
      // on small screens, limit the maxWidth to 80% of the width of the window (vw unit)
      // so that <pre> tags in readme have specific width to overflow: scroll when
      // piece of code exemple is to wide
      maxWidth: "80vw"
    },
    [theme.breakpoints.up("sm")]: {
      maxWidth: "58vw" // adjust for regular screens
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: "64vw" // adjust for regular screens
    },
    wordBreak: "break-word", // revent long word from overflowing the layout
    "& pre": {
      wordBreak: "normal",
      overflow: "auto"
    },
    "& code": {
      fontSize: "1.1em"
    },
    "& img": {
      maxWidth: "100%" // Prevent large images to overflow
    }
  }
});

const Readme = ({ classes, source, repository }) => (
  <Markdown
    source={source}
    repository={repository}
    className={`Readme-markdown__root ${classes.markdown}`}
  />
);

Readme.propTypes = {
  classes: PropTypes.object.isRequired,
  source: PropTypes.string,
  repository: PropTypes.object
};
Readme.defaultProps = {
  source: "",
  repository: {}
};

export default withStyles(styles)(Readme);
