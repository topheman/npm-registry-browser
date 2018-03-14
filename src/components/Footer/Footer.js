import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import TwitterButton from "../TwitterButton/TwitterButton";

const styles = {
  root: {
    opacity: 0.8,
    fontSize: "85%",
    textAlign: "center",
    marginTop: "20px",
    borderTop: "1px solid #e5e5e5"
  }
};

const Footer = ({ classes }) => (
  <footer className={classes.root}>
    <p>
      ©{new Date().getFullYear()}{" "}
      <a href="http://labs.topheman.com/">labs.topheman.com</a> - Christophe
      Rosset
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
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Footer);
