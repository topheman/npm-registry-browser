import React, { Fragment } from "react";
import PropTypes from "prop-types";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import { withStyles } from "@material-ui/core/styles";

import { Link } from "react-router-dom";

const styles = theme => ({
  panelDetails: {
    display: "block"
  },
  sectionTitle: {
    marginBottom: 10,
    marginTop: 15
  },
  chipsWrapper: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    margin: "5px 0px"
  },
  chip: {
    margin: 3,
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "#cecece"
    },
    "& > span": {
      [theme.breakpoints.down("sm")]: {
        maxWidth: "75vw", // on small screens, limit the maxWidth to 75% of the width of the window (vw unit)
        display: "inline-block",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }
  }
});

const DependenciesTab = ({
  version,
  packageInfos,
  classes,
  ...remainingProps
}) => {
  const dependencies =
    (packageInfos &&
      packageInfos.versions &&
      packageInfos.versions[version] &&
      packageInfos.versions[version].dependencies &&
      Object.keys(packageInfos.versions[version].dependencies)) ||
    [];
  const devDependencies =
    (packageInfos &&
      packageInfos.versions &&
      packageInfos.versions[version] &&
      packageInfos.versions[version].devDependencies &&
      Object.keys(packageInfos.versions[version].devDependencies)) ||
    [];
  const peerDependencies =
    (packageInfos &&
      packageInfos.versions &&
      packageInfos.versions[version] &&
      packageInfos.versions[version].peerDependencies &&
      Object.keys(packageInfos.versions[version].peerDependencies)) ||
    [];
  const lists = {
    [`Dependencies`]: dependencies,
    [`Dev Dependencies`]: devDependencies,
    [`Peer Dependencies`]: peerDependencies
  };
  return (
    <div {...remainingProps}>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Dependencies ({dependencies.length})</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.panelDetails}>
          {Object.entries(lists).map(([sectionTitle, sectionDependencies]) => (
            <Fragment key={sectionTitle}>
              <Typography variant="subheading" className={classes.sectionTitle}>
                {sectionTitle} ({sectionDependencies.length})
              </Typography>
              <div className={classes.chipsWrapper}>
                {sectionDependencies.map(dependencyName => (
                  <Chip
                    key={`${sectionTitle}-${dependencyName}`}
                    className={classes.chip}
                    label={dependencyName}
                    component={Link}
                    to={`/package/${dependencyName}`}
                    title={dependencyName}
                  />
                ))}
              </div>
            </Fragment>
          ))}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

DependenciesTab.propTypes = {
  version: PropTypes.string.isRequired,
  packageInfos: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DependenciesTab);
