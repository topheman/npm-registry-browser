import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import qrcode from "../assets/images/qrcode.png";

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
  },
  qrCodeWrapper: {
    width: 150,
    height: 170,
    float: "right",
    marginRight: "10vw",
    position: "relative",
    backgroundImage: `url(${qrcode})`,
    backgroundRepeat: "no-repeat",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
    "& > span": {
      fontStyle: "italic",
      position: "absolute",
      bottom: 0,
      textAlign: "center",
      width: 150
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
      <div className={classes.qrCodeWrapper} data-testid="qrcode">
        <span>Visit on mobile</span>
      </div>
      <p>
        There are lots of great resources on React out there. What might be
        missing is some projects mixing real-world constraints like:
      </p>
      <ul>
        <li>API calls / frontend router</li>
        <li>using external libraries (UI kits, http clients ...)</li>
        <li>
          code quality good practices (linting, testing, git hooks, cis ...)
        </li>
        <li>automation / dev pipeline</li>
        <li>and more ...</li>
      </ul>
      <p>
        The hard part is often to be able to put all those together. This is the
        goal of this project: provide a well-documented example of a front-end
        app with real-world features and constraints.
      </p>
      <p>
        All the source code is open and documented for you to read. It&#39;s
        available on{" "}
        <a
          href="https://github.com/topheman/npm-registry-browser"
          title="topheman/npm-registry-browser sources on github"
        >
          github
        </a>.
      </p>
      <p>
        <span role="img" aria-label="Notebook">
          📔
        </span>{" "}
        <a
          href="http://dev.topheman.com/project-to-help-getting-into-making-react-apps/"
          title="Why I made this project"
        >
          Read the blog post where I explain why I made the project
        </a>.
      </p>
      <p>
        <span role="img" aria-label="TV">
          📺
        </span>{" "}
        <a
          href="http://dev.topheman.com/pourquoi-realiser-topheman-npm-registry-browser-video-talk/"
          title="Video of the talk about why I made this project"
        >
          Watch the video of the talk{" "}
          <span role="img" aria-label="FR">
            🇫🇷
          </span>
        </a>.
      </p>
      <p className={classes.explainChips}>
        Use the search engine to find a package{" "}
        <span role="img" aria-label="look up">
          👆
        </span>
        or click on one of the sample links bellow{" "}
        <span role="img" aria-label="package">
          📦
        </span>:
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
    </div>
  );
};

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
