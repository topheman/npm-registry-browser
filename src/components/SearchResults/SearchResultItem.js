import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import relativeDate from "relative-date";
import classNames from "classnames";

import KeywordsList from "../KeywordsList";
import Gravatar from "../Gravatar";

const styles = {
  root: {
    marginBottom: "25px"
  },
  packageName: {
    fontSize: "1.4rem",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    }
  },
  version: {
    color: "grey",
    marginLeft: "6px",
    lineHeight: "1.4rem"
  },
  description: {
    margin: "5px 0"
  },
  publishInfos: {
    fontSize: "0.9rem",
    "& em": {
      fontWeight: 500
    }
  },
  gravatar: {
    display: "inline-block",
    marginLeft: 8,
    marginBottom: -5,
    width: "20px",
    height: "20px"
  }
};

const SearchResultItem = ({
  package: packageInfos,
  classes,
  className,
  ...remainingProps
}) => (
  <div className={classNames(classes.root, className)} {...remainingProps}>
    <span>
      <div className={classes.heading}>
        <Link
          to={`/package/${packageInfos.name}`}
          className={classes.packageName}
        >
          {packageInfos.name}
        </Link>
        <span className={classes.version}>(v{packageInfos.version})</span>
      </div>
      <div className={classes.description}>{packageInfos.description}</div>
      <KeywordsList
        keywords={packageInfos.keywords}
        data-testid="keywords-list"
      />
      <div className={classes.publishInfos}>
        <span>
          published <i>{relativeDate(new Date(packageInfos.date))}</i>
        </span>
        {packageInfos.publisher &&
          packageInfos.publisher.username && (
            <span>
              {" "}
              by <em>{packageInfos.publisher.username}</em>
              {packageInfos.publisher.email && (
                <Gravatar
                  size={30}
                  email={packageInfos.publisher.email}
                  className={classes.gravatar}
                />
              )}
            </span>
          )}
      </div>
    </span>
  </div>
);

SearchResultItem.propTypes = {
  classes: PropTypes.object.isRequired,
  package: PropTypes.object.isRequired,
  className: PropTypes.string
};
SearchResultItem.defaultProps = {
  className: undefined
};

export default withStyles(styles)(SearchResultItem);
