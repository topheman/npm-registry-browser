import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";

import { withStyles } from "material-ui/styles";
import CssBaseline from "material-ui/CssBaseline";

import Header from "../components/Header";
import SearchContainer from "../containers/SearchContainer";
import MainDrawer from "../components/MainDrawer";
import { withDrawer } from "../components/Drawer";
import Footer from "../components/Footer";

const styles = theme => ({
  root: {
    margin: "0px 16px"
  },
  searchContainer: {
    marginTop: 80
  },
  content: {
    margin: "0px auto",
    maxWidth: "1180px"
  },
  mockWarning: {
    position: "sticky",
    bottom: 0,
    marginLeft: "auto",
    marginRight: "auto",
    width: 200,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: 4,
    textAlign: "center",
    borderRadius: "8px 8px 0px 0px"
  }
});

const MainLayout = ({ children, classes, drawer }) => (
  <Fragment>
    <CssBaseline />
    {drawer.availablePositions.map(position => (
      <MainDrawer
        key={position}
        anchor={position}
        open={drawer[position]}
        onClose={drawer.toggleDrawer(position, false)}
      />
    ))}
    <div className={classes.root}>
      <Header onClickMenuIcon={drawer.toggleDrawer("left", true)} />
      <SearchContainer className={classes.searchContainer} />
      <div className={classes.content}>{children}</div>
      <Footer />
    </div>
    {(process.env.REACT_APP_NPM_REGISTRY_API_MOCKS_ENABLED === "true" ||
      process.env.REACT_APP_NPM_API_MOCKS_ENABLED === "true") && (
      <div className={classes.mockWarning}>⚠ Mocking http request</div>
    )}
  </Fragment>
);

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
  classes: PropTypes.object.isRequired, // from withStyles(styles)
  drawer: PropTypes.object.isRequired // from withDrawer()
};

/**
 * Connecting drawer utilies as well.
 * Same as : withDrawer()(withStyles(styles)(MainLayout));
 *
 * Check HomeContainer to see the render props version of withDrawer HOC.
 */
export default compose(withDrawer(), withStyles(styles))(MainLayout);
