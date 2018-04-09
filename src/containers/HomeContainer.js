import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Chip from "material-ui/Chip";

const styles = theme => ({
  root: {
    paddingTop: 10,
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
    "material-ui",
    "downshift"
  ];
  return (
    <div className={classes.root}>
      <p>
        There are tons of great resources to learn about new technologies /
        languages / frameworks.
      </p>
      <p>
        The hard part is not to find or learn from those, it&#39;s to pick one
        over others or to put them all together.
      </p>
      <p>
        I noticed this problem talking with multiple developers (at work,
        online, in meetups ...). So I decided to make a project with real-world
        app features and constraints that you would encounter in a development
        team such as:
      </p>
      <ul>
        <li>API calls / frontend router</li>
        <li>Development pipeline</li>
        <li>Using 3rd party libraries / UI kit</li>
        <li>Code quality practice like linters / unit-tests</li>
        <li>and more ...</li>
      </ul>
      <p>
        All the source code is open and documented for you to read. It&#39;s
        available on{" "}
        <a
          href="https://github.com/topheman/npm-registry-browser"
          title="npm-registry-brower sources on github"
        >
          github
        </a>.
      </p>
      <p className={classes.explainChips}>
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
