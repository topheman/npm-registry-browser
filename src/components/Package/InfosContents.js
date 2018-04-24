import React from "react";
import PropTypes from "prop-types";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import List, { ListItem, ListItemAvatar } from "material-ui/List";
import relativeDate from "relative-date";

import {
  safeExtractVersion,
  extractLicenseInfos,
  extractUrl,
  extractRepositoryInfos,
  extractMaintainers
} from "../../utils/metadatas";
import { displayUrl } from "../../utils/url";
import Gravatar from "../Gravatar";

const styles = {
  block: {
    margin: "4px 0 16px"
  },
  safeWidth: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  license: {},
  homepage: {},
  repository: {},
  maintainers: {}
};

const InfosContent = ({
  packageInfos,
  version,
  classes,
  ...remainingProps
}) => {
  const licenseInfos = extractLicenseInfos(packageInfos, version);
  const homepage = extractUrl(
    safeExtractVersion(packageInfos, version).homepage
  );
  const repositoryInfos = extractRepositoryInfos(
    safeExtractVersion(packageInfos, version).repository
  );
  const maintainers = extractMaintainers(packageInfos, version);
  const datePublishedRelative =
    (packageInfos &&
      packageInfos.time &&
      packageInfos.time[version] &&
      relativeDate(new Date(packageInfos.time[version]))) ||
    undefined;
  return (
    <div {...remainingProps}>
      {datePublishedRelative && (
        <div>
          <strong>v{version}</strong> published <i>{datePublishedRelative}</i>
        </div>
      )}
      <Typography style={{ textAlign: "right" }}>
        {(packageInfos &&
          packageInfos.time &&
          packageInfos.time[version] &&
          new Date(packageInfos.time[version]).toLocaleDateString()) ||
          "\u00A0"}
      </Typography>
      {licenseInfos && (
        <div className={`${classes.licence} ${classes.block}`}>
          <Typography variant="subheading">License</Typography>
          <span className={classes.safeWidth}>{licenseInfos.licenseId}</span>
        </div>
      )}
      {homepage && (
        <div className={`${classes.homepage} ${classes.block}`}>
          <Typography variant="subheading">Homepage</Typography>
          <a href={homepage} className={classes.safeWidth}>
            {displayUrl(homepage)}
          </a>
        </div>
      )}
      {repositoryInfos && (
        <div className={`${classes.repository} ${classes.block}`}>
          <Typography variant="subheading">Repository</Typography>
          <a href={repositoryInfos.url} className={classes.safeWidth}>
            {repositoryInfos.displayUrl}
          </a>
        </div>
      )}
      {maintainers.length > 0 && (
        <div className={`${classes.maintainers} ${classes.block}`}>
          <Typography variant="subheading">Maintainers</Typography>
          <List dense>
            {maintainers.map(maintainer => (
              <ListItem key={maintainer.email}>
                <ListItemAvatar>
                  <Gravatar alt={maintainer.name} email={maintainer.email} />
                </ListItemAvatar>
                <Typography variant="subheading" className={classes.safeWidth}>
                  {maintainer.name}
                </Typography>
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

InfosContent.propTypes = {
  packageInfos: PropTypes.object.isRequired,
  version: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InfosContent);
