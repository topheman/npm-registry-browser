import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import List, {
  ListItem,
  // ListItemIcon,
  // ListItemSecondaryAction,
  ListItemText,
  ListSubheader
} from "material-ui/List";

import Title from "./Title";
import Readme from "./Readme";
import Gravatar from "../Gravatar";
import {
  extractReadme,
  extractMaintainers,
  extractPeopleInfos
} from "../../utils/metadatas";

const styles = theme => ({
  description: {
    fontStyle: "italic",
    fontSize: theme.typography.pxToRem(14)
  },
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 16
  }),
  rootGridContainer: {
    marginTop: 8
  },
  title: {
    color: theme.palette.primary.main
  }
});

const Package = ({
  scope,
  name,
  version,
  stateNpmRegistry,
  stateNpmApi,
  packageInfos,
  downloads,
  loadApiInfos,
  loadRegistryInfos,
  classes
}) => {
  const publisher =
    packageInfos &&
    packageInfos.versions &&
    packageInfos.versions[version] &&
    extractPeopleInfos(packageInfos.versions[version]._npmUser); // eslint-disable-line
  const maintainers = extractMaintainers(packageInfos, version);
  return (
    <div>
      <Title
        scope={scope}
        name={name}
        version={version}
        packageInfos={packageInfos}
      />
      <Fragment>
        {packageInfos &&
          packageInfos.versions[version] &&
          packageInfos.versions[version].description && (
            <Typography className={classes.description}>
              {packageInfos.versions[version].description}
            </Typography>
          )}
        {packageInfos &&
          packageInfos.time &&
          packageInfos.time[version] && (
            <Typography>
              {new Date(packageInfos.time[version]).toLocaleDateString()}
            </Typography>
          )}
      </Fragment>
      <Grid container className={classes.rootGridContainer}>
        <Grid item xs={12} sm={4}>
          <Paper className={classes.paper}>
            <Typography variant="title" className={classes.title}>
              Stats
            </Typography>
            {stateNpmApi === "loaded" && (
              <Fragment>
                <p>Downloads for all versions:</p>
                <ul>
                  <li>
                    Last day:{" "}
                    {downloads.downloads[
                      downloads.downloads.length - 1
                    ].downloads.toLocaleString()}
                  </li>
                  <li>
                    Last month:{" "}
                    {downloads.downloads
                      .reduce((acc, { downloads: dl }) => acc + dl, 0)
                      .toLocaleString()}
                  </li>
                </ul>
              </Fragment>
            )}
            {stateNpmApi === "loading" && (
              <Typography>... loading stats ...</Typography>
            )}
            {stateNpmApi === "error" && (
              <Typography>
                Error -{" "}
                <button onClick={() => loadApiInfos(scope, name)}>
                  reload
                </button>
              </Typography>
            )}
          </Paper>
          {stateNpmRegistry === "loaded" && (
            <Paper className={classes.paper}>
              {publisher && (
                <List subheader={<ListSubheader>Publisher</ListSubheader>}>
                  <ListItem>
                    <Gravatar alt={publisher.name} email={publisher.email} />
                    <ListItemText>
                      <Typography component="span">{publisher.name}</Typography>
                    </ListItemText>
                  </ListItem>
                </List>
              )}
              <List
                subheader={
                  <ListSubheader>
                    Maintainer{maintainers.length > 1 ? "s" : ""}
                  </ListSubheader>
                }
              >
                {extractMaintainers(packageInfos, version).map(maintainer => (
                  <ListItem key={`${maintainer.name}-${maintainer.email}`}>
                    <Gravatar alt={maintainer.name} email={maintainer.email} />
                    <ListItemText>
                      <Typography component="span">
                        {maintainer.name}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} sm={8}>
          {stateNpmRegistry === "loaded" &&
            packageInfos && (
              <Readme source={extractReadme(packageInfos, version)} />
            )}
          {["loading", "error"].includes(stateNpmRegistry) && (
            <Paper className={classes.paper}>
              {stateNpmRegistry === "loading" && (
                <Typography>... loading registry infos ...</Typography>
              )}
              {stateNpmRegistry === "error" && (
                <Typography>
                  Error -{" "}
                  <button
                    onClick={() => loadRegistryInfos(scope, name, version)}
                  >
                    reload
                  </button>
                </Typography>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

Package.propTypes = {
  scope: PropTypes.string, // eslint-disable-line react/require-default-props
  name: PropTypes.string, // eslint-disable-line react/require-default-props
  version: PropTypes.string, // eslint-disable-line react/require-default-props
  stateNpmRegistry: PropTypes.string.isRequired,
  stateNpmApi: PropTypes.string.isRequired,
  packageInfos: PropTypes.object, // eslint-disable-line react/require-default-props
  downloads: PropTypes.object, // eslint-disable-line react/require-default-props
  loadApiInfos: PropTypes.func.isRequired,
  loadRegistryInfos: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Package);
