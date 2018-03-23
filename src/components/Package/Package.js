import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import List, { ListItem, ListItemText, ListSubheader } from "material-ui/List";

import Title from "./Title";
import Readme from "./Readme";
import VersionsTab from "./VersionsTab";
import DependenciesTab from "./DependenciesTab";
import Gravatar from "../Gravatar";
import Loader from "../Loader";
import RetryButton from "../RetryButton";
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
  blocks: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 10
  }),
  root: {
    display: "grid",
    gridGap: "10px",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
      gridTemplateAreas: `"header"
      "section"
      "aside"`
    },
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "3fr 1fr",
      gridTemplateAreas: `"header header"
      "section aside"
      "section aside"`
    }
  },
  areaHeader: {
    gridArea: "header",
    paddingLeft: 0
  },
  areaAside: {
    gridArea: "aside"
  },
  areaSection: {
    gridArea: "section"
  },
  blockInfos1: {},
  blockInfos2: {
    display: "none"
  },
  blockStats: {},
  blockReadme: {},
  blockVersions: {},
  blockDependencies: {},
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
    <section className={classes.root}>
      <header className={`${classes.blocks} ${classes.areaHeader}`}>
        <Title
          scope={scope}
          name={name}
          version={version}
          packageInfos={packageInfos}
        />
        <Fragment>
          <Typography className={classes.description}>
            {(packageInfos &&
              packageInfos.versions[version] &&
              packageInfos.versions[version].description) ||
              "\u00A0"}
          </Typography>
          <Typography>
            {(packageInfos &&
              packageInfos.time &&
              packageInfos.time[version] &&
              new Date(packageInfos.time[version]).toLocaleDateString()) ||
              "\u00A0"}
          </Typography>
        </Fragment>
      </header>
      <aside className={classes.areaAside}>
        <Paper className={`${classes.blocks} ${classes.blockStats}`}>
          <Loader
            loading={stateNpmApi === "loading"}
            render={() => {
              if (stateNpmApi === "error") {
                return (
                  <RetryButton onClick={() => loadApiInfos(scope, name)} />
                );
              }
              return (
                <Fragment>
                  <Typography variant="title" className={classes.title}>
                    Stats
                  </Typography>
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
              );
            }}
          />
        </Paper>
        <Paper className={`${classes.blocks} ${classes.blockInfos1}`}>
          <Loader
            loading={stateNpmRegistry === "loading"}
            render={() => {
              if (stateNpmRegistry === "error") {
                return (
                  <RetryButton
                    onClick={() => loadRegistryInfos(scope, name, version)}
                  />
                );
              }
              return (
                <Fragment>
                  {publisher && (
                    <List subheader={<ListSubheader>Publisher</ListSubheader>}>
                      <ListItem>
                        <Gravatar
                          alt={publisher.name}
                          email={publisher.email}
                        />
                        <ListItemText>
                          <Typography component="span">
                            {publisher.name}
                          </Typography>
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
                    {extractMaintainers(packageInfos, version).map(
                      maintainer => (
                        <ListItem
                          key={`${maintainer.name}-${maintainer.email}`}
                        >
                          <Gravatar
                            alt={maintainer.name}
                            email={maintainer.email}
                          />
                          <ListItemText>
                            <Typography component="span">
                              {maintainer.name}
                            </Typography>
                          </ListItemText>
                        </ListItem>
                      )
                    )}
                  </List>
                </Fragment>
              );
            }}
          />
        </Paper>
        <Paper className={`${classes.blocks} ${classes.blockInfos2}`}>
          <Loader
            loading={stateNpmRegistry === "loading"}
            render={() => {
              if (stateNpmRegistry === "error") {
                return (
                  <RetryButton
                    onClick={() => loadRegistryInfos(scope, name, version)}
                  />
                );
              }
              return (
                <Typography>Some infos loaded (comming soon) ...</Typography>
              );
            }}
          />
        </Paper>
      </aside>
      <section classes={classes.areaSection}>
        {stateNpmRegistry === "loaded" &&
          packageInfos && (
            <Paper className={`${classes.blocks} ${classes.blockReadme}`}>
              <Readme source={extractReadme(packageInfos, version)} />
            </Paper>
          )}
        {stateNpmRegistry === "loaded" &&
          packageInfos && (
            <VersionsTab
              scope={scope}
              name={name}
              version={version}
              packageInfos={packageInfos}
              className={`${classes.blocks} ${classes.blockVersions}`}
              style={{ padding: 0 }}
            />
          )}
        {stateNpmRegistry === "loaded" &&
          packageInfos && (
            <DependenciesTab
              version={version}
              packageInfos={packageInfos}
              className={`${classes.blocks} ${classes.blockDependencies}`}
              style={{ padding: 0 }}
            />
          )}
      </section>
    </section>
  );
};

Package.propTypes = {
  scope: PropTypes.string,
  name: PropTypes.string.isRequired,
  version: PropTypes.string,
  stateNpmRegistry: PropTypes.string.isRequired,
  stateNpmApi: PropTypes.string.isRequired,
  packageInfos: PropTypes.object,
  downloads: PropTypes.object,
  loadApiInfos: PropTypes.func.isRequired,
  loadRegistryInfos: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};
Package.defaultProps = {
  scope: undefined,
  version: undefined,
  packageInfos: undefined,
  downloads: undefined
};

export default withStyles(styles)(Package);
