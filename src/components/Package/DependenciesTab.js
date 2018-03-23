import React, { Fragment } from "react";
import PropTypes from "prop-types";
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "material-ui/ExpansionPanel";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
import Typography from "material-ui/Typography";
import Chip from "material-ui/Chip";
import { withStyles } from "material-ui/styles";

import { Link } from "react-router-dom";

const styles = {
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
    }
  }
};

const DependenciesTab = ({
  version,
  packageInfos,
  classes,
  className,
  style
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
    <div className={className} style={style}>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            Dependencies ({dependencies.length})
          </Typography>
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
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};
DependenciesTab.defaultProps = {
  className: "",
  style: {}
};

export default withStyles(styles)(DependenciesTab);
