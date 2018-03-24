import React from "react";
import PropTypes from "prop-types";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import List, { ListItem, ListItemAvatar, ListItemText } from "material-ui/List";
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
    margin: "4px 0 8px"
  },
  license: {},
  homepage: {},
  repository: {},
  maintainers: {}
};

const InfosContent = ({ packageInfos, version, classes, className, style }) => {
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
    <div className={className} style={style}>
      {datePublishedRelative && (
        <div>
          <strong>v{version}</strong> published <i>{datePublishedRelative}</i>
        </div>
      )}
      {licenseInfos && (
        <div className={`${classes.licence} ${classes.block}`}>
          <Typography variant="subheading">License</Typography>
          {licenseInfos.licenseId}
        </div>
      )}
      {homepage && (
        <div className={`${classes.homepage} ${classes.block}`}>
          <Typography variant="subheading">Homepage</Typography>
          <a href={homepage}>{displayUrl(homepage)}</a>
        </div>
      )}
      {repositoryInfos && (
        <div className={`${classes.repository} ${classes.block}`}>
          <Typography variant="subheading">Repository</Typography>
          <a href={repositoryInfos.url}>{repositoryInfos.displayUrl}</a>
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
                <ListItemText primary={maintainer.name} />
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
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};
InfosContent.defaultProps = {
  className: "",
  style: {}
};

export default withStyles(styles)(InfosContent);
