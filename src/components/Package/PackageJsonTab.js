import React from "react";
import PropTypes from "prop-types";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import CodeBlock from "../CodeBlock";

const styles = theme => ({
  codeBlock: {
    [theme.breakpoints.down("xs")]: {
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
    [theme.breakpoints.up("xl")]: {
      maxWidth: "53vw" // adjust for very-wide screens
    },
    wordBreak: "normal",
    overflow: "auto"
  }
});

const PackageJson = ({ value, classes, className, ...remainingProps }) => {
  const { version } = value;
  const formattedValue = JSON.stringify(
    value,
    (key, val) =>
      typeof key === "string" && key.startsWith("_") ? undefined : val, // remove "private infos"
    "  "
  );
  return (
    <div className={classNames(classes.root, className)} {...remainingProps}>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            package.json (v{version})
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <CodeBlock
            value={formattedValue}
            language="json"
            className={classes.codeBlock}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};
PackageJson.propTypes = {
  value: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
};
PackageJson.defaultProps = {
  className: undefined
};

export default withStyles(styles)(PackageJson);
