import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import TwitterButton from "./TwitterButton";

const styles = {
  root: {
    opacity: 0.8,
    fontSize: "85%",
    textAlign: "center",
    marginTop: "20px",
    borderTop: "1px solid #e5e5e5"
  }
};

const Footer = ({
  classes,
  fromFullYear,
  toFullYear,
  className,
  ...remainingProps
}) => (
  <footer className={classNames(classes.root, className)} {...remainingProps}>
    <p>
      ©
      {fromFullYear === toFullYear
        ? toFullYear
        : `${fromFullYear}-${toFullYear}`}{" "}
      <a href="http://labs.topheman.com/">labs.topheman.com</a> - Christophe
      Rosset - v{process.env.REACT_APP_METADATAS_VERSION}
    </p>
    <p>
      All data comes from <a href="https://www.npmjs.com/">npm</a> &amp;{" "}
      <a href="https://npms.io/">npms</a> / This project is not affiliated with
      npm, Inc. in any way.
    </p>
    <p>
      <TwitterButton
        text="Dive deeper in #react ecosystem with npm-registry-browser."
        url="https://topheman.github.io/npm-registry-browser"
        hashtags="material, tooling"
        via="topheman"
        related="react, material-ui"
      />
    </p>
  </footer>
);

Footer.propTypes = {
  toFullYear: PropTypes.number,
  fromFullYear: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
};
Footer.defaultProps = {
  toFullYear: new Date().getFullYear(),
  className: undefined
};

export default withStyles(styles)(Footer);
