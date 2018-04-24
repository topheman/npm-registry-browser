import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";

// cypress:open doesn't support the following, we need to pollyfill ...
import "mdn-polyfills/Array.prototype.includes";
import "mdn-polyfills/Object.entries";

import "./index.css";
import RootContainer from "./containers/RootContainer";
import registerServiceWorker from "./registerServiceWorker";

import { init as initApis } from "./services/apis";
import { Provider as WindowInfosProvider } from "./components/WindowInfos";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#900000",
      light: "#c8412a"
    },
    secondary: { main: "#DDDDDD" },
    error: {
      main: "#f44336",
      light: "#e5c9ca"
    }
  },
  typography: {
    // Fix relative font-size according to <html> element font-size set in index.css
    fontSize: 14, // Account for base font-size of 87.5%.
    htmlFontSize: 14 // 87.5% of 16px = 14px
  },
  overrides: {
    MuiListSubheader: {
      root: {
        fontSize: "1rem",
        color: "grey",
        fontWeight: 500
      }
    },
    MuiTypography: {
      subheading: {
        fontSize: "1rem",
        color: "grey",
        fontWeight: 500
      }
    }
  }
});

/**
 * This is where you add the root providers (like react-redux Provider)
 */
const render = Component => {
  ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <WindowInfosProvider>
        <Component />
      </WindowInfosProvider>
    </MuiThemeProvider>,
    document.getElementById("root")
  );
};

initApis();

render(RootContainer);
registerServiceWorker();

if (module.hot) {
  module.hot.accept("./containers/RootContainer", () => {
    render(RootContainer);
  });
}
