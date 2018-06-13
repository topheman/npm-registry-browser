import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";

const styles = theme => ({
  root: {
    "& > p, & > ul": {
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.up("sm")]: {
        maxWidth: "70vw"
      },
      [theme.breakpoints.down("xs")]: {
        maxWidth: "90vw"
      }
    }
  }
});

const QrcodeContainer = ({ classes }) => (
  <div className={classes.root}>
    <h2 style={{ textAlign: "center" }}>About</h2>
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
      goal of this project: provide a well-documented example of a front-end app
      with real-world features and constraints.
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
    <p style={{ textAlign: "center" }}>
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
  </div>
);

QrcodeContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(QrcodeContainer);
