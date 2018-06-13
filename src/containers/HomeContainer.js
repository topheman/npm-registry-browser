import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const styles = theme => ({
  root: {
    "& > p, & > ul": {
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.up("sm")]: {
        maxWidth: "70vw"
      },
      [theme.breakpoints.down("sm")]: {
        maxWidth: "90vw"
      }
    }
  },
  explainMockMode: {
    fontStyle: "italic"
  },
  explainChips: {
    fontSize: "120%",
    textAlign: "center"
  },
  chipsWrapper: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    margin: "5px 0px",
    [theme.breakpoints.up("sm")]: {
      maxWidth: "50vw",
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  chip: {
    margin: 3,
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "#cecece"
    },
    "& > span": {
      [theme.breakpoints.down("sm")]: {
        maxWidth: "90vw",
        display: "inline-block",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }
  }
});

const Home = ({ classes }) => {
  const packages = [
    "react",
    "react@0.14.0",
    "react@0.0.1",
    "@angular/core",
    "ember",
    "vue",
    "lodash",
    "express",
    "express@1.0.0",
    "jquery",
    "jquery@1.8.3",
    "babel-core",
    "webpack",
    "@material-ui/core",
    "downshift"
  ];
  return (
    <div className={classes.root}>
      {(process.env.REACT_APP_NPM_REGISTRY_API_MOCKS_ENABLED === "true" ||
        process.env.REACT_APP_NPM_API_MOCKS_ENABLED === "true") && (
        <p className={classes.explainMockMode}>
          You are in mocked mode, checkout the console in the devtools to
          monitor the mocked requests.{" "}
          {window.location.hostname === "mock.npm-registry-browser.surge.sh" ? (
            <a
              href="https://topheman.github.io/npm-registry-browser"
              title="npm-registry-browser original on github.io"
            >
              Back to original
            </a>
          ) : null}
        </p>
      )}
      <p className={classes.explainChips}>
        No idea what to search for ? Pick a package bellow.
      </p>
      <div className={classes.chipsWrapper} data-testid="chip-wrapper">
        {packages.map(name => (
          <Chip
            key={name}
            className={classes.chip}
            label={name}
            component={Link}
            to={`/package/${name}`}
            title={name}
          />
        ))}
      </div>
      <p className={classes.explainChips}>
        <Link to="/about">About</Link>
      </p>
    </div>
  );
};

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
