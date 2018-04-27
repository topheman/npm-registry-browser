import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";
import CssBaseline from "material-ui/CssBaseline";

import Header from "../components/Header";
import SearchContainer from "../containers/SearchContainer";
import Footer from "../components/Footer";

const styles = theme => ({
  root: {
    margin: "0px 16px",
    marginBottom:
      ((process.env.REACT_APP_NPM_REGISTRY_API_MOCKS_ENABLED === "true" ||
        process.env.REACT_APP_NPM_API_MOCKS_ENABLED === "true") &&
        "50px") ||
      "0"
  },
  searchContainer: {
    marginTop: 80
  },
  content: {
    margin: "0px auto",
    [theme.breakpoints.up("xs")]: {
      maxWidth: "1180px" // adjust for regular and small screens (default fixed maxWidth)
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: "90vw" // adjust for wide screens
    },
    [theme.breakpoints.up("xl")]: {
      maxWidth: "70vw" // adjust for very-wide screens
    }
  },
  mockWarning: {
    position: "fixed",
    bottom: 0,
    width: 200,
    left: "50%",
    transform: "translate(-50%, 0)",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: 4,
    textAlign: "center",
    borderRadius: "8px 8px 0px 0px"
  }
});

const MainLayout = ({ children, classes }) => (
  <Fragment>
    <CssBaseline />
    <div className={classes.root}>
      <Header />
      <SearchContainer className={classes.searchContainer} />
      <div className={classes.content} data-section="content">
        {children}
      </div>
      <Footer fromFullYear={2018} data-section="footer" />
    </div>
    {(process.env.REACT_APP_NPM_REGISTRY_API_MOCKS_ENABLED === "true" ||
      process.env.REACT_APP_NPM_API_MOCKS_ENABLED === "true") && (
      <div className={classes.mockWarning}>⚠ Mocking http request</div>
    )}
  </Fragment>
);

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainLayout);
