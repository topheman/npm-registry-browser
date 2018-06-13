import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import qrcode from "../assets/images/qrcode.png";

const styles = {
  root: {
    "& p": {
      textAlign: "center",
      margin: "10 auto"
    }
  },
  qrCodeWrapper: {
    margin: "0px auto",
    width: 250,
    height: 250,
    backgroundImage: `url(${qrcode})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100%"
  }
};

const QrcodeContainer = ({ classes }) => (
  <div className={classes.root}>
    <p>
      <Link to="/" data-testid="link-back-home">
        <HomeIcon
          style={{
            display: "inline-block",
            marginBottom: -7
          }}
        />{" "}
        Back to Home page
      </Link>
    </p>
    <div
      className={classes.qrCodeWrapper}
      role="img"
      aria-label="Qrcode to access to https://topheman.github.io/npm-registry-browser"
      title="Snap the qrcode to access the website"
      data-testid="qrcode-standalone"
    />
    <p>
      <a
        href="https://topheman.github.io/npm-registry-browser"
        title="Share this website!"
      >
        https://topheman.github.io/npm-registry-browser
      </a>
    </p>
  </div>
);

QrcodeContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(QrcodeContainer);
