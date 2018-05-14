import React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import relativeDate from "relative-date";

import { Link } from "react-router-dom";

import { formatPackageString } from "../../utils/string";

const styles = theme => ({
  listSubheader: {
    padding: "0"
  },
  ul: {
    padding: 0
  },
  listItem: {
    paddingBottom: 0
  },
  listRoot: {
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "75vw" // on small screens, limit the maxWidth to 75% of the width of the window (vw unit)
    }
  },
  listItemTextContent: {
    fontSize: "1.1rem",
    display: "flex",
    flexDirection: "row",
    "& > *:first-child": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    },
    "& > *:last-child": {
      textAlign: "right"
    },
    "& > *": {
      display: "block",
      "-webkit-box-flex": 1,
      "-ms-flex": "1 0 initial",
      flex: "1 0 initial",
      whiteSpace: "nowrap"
    }
  },
  selected: {
    fontWeight: "bold"
  },
  version: {},
  space: {
    marginBottom: 5,
    borderBottom: "1px dotted rgba(0, 0, 0, .2)",
    marginLeft: 10,
    marginRight: 10,
    flex: "1 1 auto"
  },
  date: {}
});

const VersionsTab = ({
  scope,
  name,
  version: currentVersion,
  packageInfos,
  classes,
  ...remainingProps
}) => {
  const distTags = Object.entries(packageInfos["dist-tags"]);
  const versions = Object.keys(packageInfos.versions).reverse();
  return (
    <div {...remainingProps}>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            Versions ({versions.length})
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List subheader={<li />} dense className={classes.listRoot}>
            <li>
              <ul className={classes.ul}>
                <ListSubheader className={classes.listSubheader}>
                  Tags ({distTags.length})
                </ListSubheader>
                {distTags.map(([tag, version]) => (
                  <Typography
                    key={`tag-${tag}`}
                    className={classes.listItemTextContent}
                    component={Link}
                    to={`/package/${formatPackageString({
                      scope,
                      name,
                      version
                    })}`}
                  >
                    <code className={classes.version}>{tag}</code>
                    <div className={classes.space} />
                    <code className={classes.date}>{version}</code>
                  </Typography>
                ))}
                <ListSubheader className={classes.listSubheader}>
                  Versions ({versions.length})
                </ListSubheader>
                {versions.map(version => (
                  <Typography
                    key={version}
                    className={`${classes.listItemTextContent} ${
                      version === currentVersion ? classes.selected : ""
                    }`}
                    component={Link}
                    to={`/package/${formatPackageString({
                      scope,
                      name,
                      version
                    })}`}
                  >
                    <code className={classes.version}>{version}</code>
                    <div className={classes.space} />
                    <code className={classes.date}>
                      <time
                        dateTime={packageInfos.time[version]}
                        title={new Date(
                          packageInfos.time[version]
                        ).toLocaleDateString()}
                      >
                        {relativeDate(new Date(packageInfos.time[version]))}
                      </time>
                    </code>
                  </Typography>
                ))}
              </ul>
            </li>
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

VersionsTab.propTypes = {
  scope: PropTypes.string,
  name: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  packageInfos: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};
VersionsTab.defaultProps = {
  scope: undefined
};

export default withStyles(styles)(VersionsTab);
