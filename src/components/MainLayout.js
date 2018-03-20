import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";

import { withStyles } from "material-ui/styles";
import CssBaseline from "material-ui/CssBaseline";

import Header from "../components/Header";
import MainDrawer from "../components/MainDrawer";
import { withDrawer } from "../components/Drawer";
import Footer from "../components/Footer";

const styles = () => ({
  root: {
    margin: "0px 16px"
  },
  content: {
    margin: "60px auto",
    maxWidth: "1180px"
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
      <div className={classes.content}>{children}</div>
      <Footer />
    </div>
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
