import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import Button from "material-ui/Button";
import CssBaseline from "material-ui/CssBaseline";

import Header from "../../components/Header/Header";

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

const MainLayout = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <div className="layout">
      <Header />
      <div style={{ marginTop: 70 }}>
        <h2>Temporary page</h2>
        <nav>
          <ul>
            <li>
              <Button color="primary" variant="raised" to="/" component={Link}>
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
          </ul>
        </nav>
      </div>
      {children}
      <footer>Some Footer</footer>
    </div>
  </MuiThemeProvider>
);

MainLayout.propTypes = {
  children: PropTypes.element.isRequired
};

export default MainLayout;
