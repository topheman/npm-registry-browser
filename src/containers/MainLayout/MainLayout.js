import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "material-ui/styles";
import Button from "material-ui/Button";
import CssBaseline from "material-ui/CssBaseline";

import Header from "../../components/Header/Header";
import MainDrawer, {
  positions as drawerPositions
} from "../../components/MainDrawer/MainDrawer";

import { ucFirst } from "../../utils/string";

const styles = theme => ({
  root: {
    margin: "0px 16px"
  },
  content: {
    marginTop: "70px"
  },
  button: {
    margin: theme.spacing.unit
  },
  buttonsRoot: {
    textAlign: "center"
  }
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#900000",
      light: "#c8412a"
    },
    secondary: { main: "#DDDDDD" }
  }
});

class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    drawerPositions.forEach(position => {
      this.state[`drawer${ucFirst(position)}`] = false; // eslint-disable-line
    });
    this.toggleDrawer.bind(this);
  }
  toggleDrawer = (side, open) => () => {
    this.setState({
      [`drawer${ucFirst(side)}`]: open
    });
  };
  render() {
    const { children, classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {drawerPositions.map(position => (
          <MainDrawer
            key={position}
            anchor={position}
            open={this.state[`drawer${ucFirst(position)}`]}
            onClose={this.toggleDrawer(position, false)}
          />
        ))}
        <div className={classes.root}>
          <Header onClickMenuIcon={this.toggleDrawer("left", true)} />
          <div className={classes.content}>
            <p>
              Trying <a href="https://material-ui-next.com">Material-UI</a> as a
              UI-kit.
            </p>
            <p>
              Play with the drawers (you can open the default one with the
              hamburger menu):
            </p>
            <div className={classes.buttonsRoot}>
              {drawerPositions.map(position => (
                <Button
                  className={classes.button}
                  key={position}
                  variant="raised"
                  color="primary"
                  onClick={this.toggleDrawer(position, true)}
                >
                  {position}
                </Button>
              ))}
            </div>
          </div>
          {children}
          <footer>Some Footer</footer>
        </div>
      </MuiThemeProvider>
    );
  }
}

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainLayout);
