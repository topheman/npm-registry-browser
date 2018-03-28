import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";

import Title from "./Title";
import Readme from "./Readme";
import VersionsTab from "./VersionsTab";
import DependenciesTab from "./DependenciesTab";
import PackageJsonTab from "./PackageJsonTab";
import InfosContents from "./InfosContents";
import StatsContents from "./StatsContents";
import Loader from "../Loader";
import RetryButton from "../RetryButton";
import { extractReadme } from "../../utils/metadatas";

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
      gridTemplateColumns: "90vw",
      gridTemplateAreas: `"header"
      "section"
      "aside"`
    },
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "1fr 260px",
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
  blockPackageJson: {},
  blockVersions: {},
  blockDependencies: {
    marginBottom: 0
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
}) => (
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
              return <RetryButton onClick={() => loadApiInfos(scope, name)} />;
            }
            return <StatsContents downloads={downloads} />;
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
              <InfosContents version={version} packageInfos={packageInfos} />
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
    <section className={classes.areaSection}>
      <Paper className={`${classes.blocks} ${classes.blockReadme}`}>
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
            return <Readme source={extractReadme(packageInfos, version)} />;
          }}
        />
      </Paper>
      {stateNpmRegistry === "loaded" &&
        packageInfos &&
        packageInfos.versions &&
        packageInfos.versions[version] && (
          <PackageJsonTab
            value={packageInfos.versions[version]}
            className={`${classes.blocks} ${classes.blockPackageJson}`}
            style={{ padding: 0 }}
          />
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
