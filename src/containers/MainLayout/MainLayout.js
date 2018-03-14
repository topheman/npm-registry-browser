import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import Button from "material-ui/Button";
import CssBaseline from "material-ui/CssBaseline";

import Header from "../../components/Header/Header";
import MainDrawer, {
  positions as drawerPositions
} from "../../components/MainDrawer/MainDrawer";

import { ucFirst } from "../../utils/string";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#900000",
      light: "#c8412a"
    },
    secondary: { main: "#DDDDDD" }
  }
});

const packages = [
  "react",
  "react@16.2.0",
  "@angular/core",
  "@angular/core@5.2.8"
];

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
    const { children } = this.props;
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
        <div className="layout">
          <Header onClickMenuIcon={this.toggleDrawer("left", true)} />
          <div style={{ marginTop: 70 }}>
            <h2>Temporary page</h2>
            <nav>
              <ul>
                <li>
                  <Button
                    color="primary"
                    variant="raised"
                    to="/"
                    component={Link}
                  >
                    Home
                  </Button>
                </li>
                {packages.map(name => (
                  <li key={name}>
                    <Button
                      color="primary"
                      to={`/package/${name}`}
                      component={Link}
                      key={name}
                    >
                      {name}
                    </Button>
                  </li>
                ))}
                {drawerPositions.map(position => (
                  <li key={position}>
                    <Button
                      color="primary"
                      onClick={this.toggleDrawer(position, true)}
                    >
                      {position}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {children}
          <footer>Some Footer</footer>
        </div>
      </MuiThemeProvider>
    );
  }
}

MainLayout.propTypes = {
  children: PropTypes.element.isRequired
};

export default MainLayout;
