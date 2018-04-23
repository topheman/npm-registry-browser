import React from "react";
import PropTypes from "prop-types";
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "material-ui/ExpansionPanel";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import classNames from "classnames";

import CodeBlock from "../CodeBlock";

const styles = theme => ({
  codeBlock: {
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
    [theme.breakpoints.up("xl")]: {
      maxWidth: "53vw" // adjust for very-wide screens
    },
    wordBreak: "normal",
    overflow: "auto"
  }
});

const PackageJson = ({ value, classes, className, style }) => {
  const { version } = value;
  const formattedValue = JSON.stringify(
    value,
    (key, val) =>
      typeof key === "string" && key.startsWith("_") ? undefined : val, // remove "private infos"
    "  "
  );
  return (
    <div className={classNames(classes.root, className)} style={style}>
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
  className: PropTypes.string,
  style: PropTypes.object
};
PackageJson.defaultProps = {
  className: undefined,
  style: undefined
};

export default withStyles(styles)(PackageJson);
