// inspired by https://material-ui-next.com/demos/app-bar/#app-bar-with-buttons

import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";

import { Link } from "react-router-dom";

import "./Header.css";
import npmLogo from "../../assets/images/n-64-white.png";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  logo: {
    backgroundImage: `url(${npmLogo})`,
    backgroundSize: 45,
    backgroundPosition: "2px 2px",
    backgroundRepeat: "no-repeat",
    borderRadius: "0%",
    marginRight: 10
  },
  title: {
    textDecoration: "none",
    fontWeight: 500,
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      fontSize: "100%"
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "130%"
    },
    "&:hover": {
      color: "white"
    }
  },
  menuButton: {
    marginLeft: -12,
    [theme.breakpoints.down("sm")]: {
      marginRight: 0
    },
    [theme.breakpoints.up("sm")]: {
      marginRight: 10
    }
  }
});

const Header = props => {
  const { classes } = props;
  return (
    <header className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            className={classes.logo}
            component={Link}
            to="/"
            title="Home"
            aria-label="logo"
          />
          <Typography
            component={Link}
            to="/"
            title="Home"
            color="inherit"
            className={classes.title}
          >
            npm-registry-browser
          </Typography>
          <ul className="site-networks">
            <li className="twitter">
              <a
                href="https://twitter.com/topheman"
                title="@topheman on twitter"
              >
                <span className="icon" />
                <span className="desc">Twitter</span>
              </a>
            </li>
            <li className="github">
              <a
                href="https://github.com/topheman/npm-registry-browser"
                title="Fork on github"
              >
                <span className="icon" />
                <span className="desc">Github</span>
              </a>
            </li>
          </ul>
        </Toolbar>
      </AppBar>
    </header>
  );
};

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
