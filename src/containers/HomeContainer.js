import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Chip from "material-ui/Chip";

const styles = theme => ({
  root: {
    paddingTop: 10,
    "& > p": {
      textAlign: "center"
    }
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
    "material-ui",
    "downshift"
  ];
  return (
    <div className={classes.root}>
      <p>
        Use the serch engine to find a package{" "}
        <span role="img" aria-label="look up">
          👆
        </span>
        or click on one of the sample links bellow{" "}
        <span role="img" aria-label="package">
          📦
        </span>:
      </p>
      <div className={classes.chipsWrapper}>
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
    </div>
  );
};

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
