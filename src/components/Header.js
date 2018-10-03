// inspired by https://material-ui-next.com/demos/app-bar/#app-bar-with-buttons

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { compose, withStateHandlers } from "recompose";
import classNames from "classnames";

import { Link } from "react-router-dom";

import MainDrawer from "../components/MainDrawer";

import "./Header.css";
import npmLogo from "../assets/images/n-64-white.png";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  logo: {
    width: 48,
    height: 48,
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
    [theme.breakpoints.down("xs")]: {
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
    [theme.breakpoints.down("xs")]: {
      marginRight: 0
    },
    [theme.breakpoints.up("sm")]: {
      marginRight: 10
    }
  }
});

const Header = props => {
  const {
    classes,
    drawerOpen,
    toggleDrawer,
    className,
    ...remainingProps
  } = props;
  return (
    <Fragment>
      <header
        className={classNames(classes.root, className)}
        {...remainingProps}
      >
        <AppBar position="absolute">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={() => toggleDrawer(true)}
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
      <MainDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      />
    </Fragment>
  );
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  drawerOpen: PropTypes.bool.isRequired, // from withStateHandlers()
  toggleDrawer: PropTypes.func.isRequired, // from withStateHandlers()
  className: PropTypes.string,
  style: PropTypes.object
};

Header.defaultProps = {
  className: undefined,
  style: undefined
};

export default compose(
  withStateHandlers(
    { drawerOpen: false },
    {
      toggleDrawer: () => open => ({ drawerOpen: open })
    }
  ),
  withStyles(styles)
)(Header);
