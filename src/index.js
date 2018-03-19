import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";

import "./index.css";
import RootContainer from "./containers/RootContainer";
import registerServiceWorker from "./registerServiceWorker";

import { init as initApi } from "./services/ApiManager";
import { Provider as DrawerProvider } from "./components/Drawer";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#900000",
      light: "#c8412a"
    },
    secondary: { main: "#DDDDDD" }
  },
  typography: {
    // Fix relative font-size according to <html> element font-size set in index.css
    fontSize: 14, // Account for base font-size of 87.5%.
    htmlFontSize: 14 // 87.5% of 16px = 14px
  }
});

/**
 * This is where you add the root providers (like react-redux Provider)
 */
const render = Component => {
  ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <DrawerProvider>
        <Component />
      </DrawerProvider>
    </MuiThemeProvider>,
    document.getElementById("root")
  );
};

initApi("npmRegistry");

render(RootContainer);
registerServiceWorker();

if (module.hot) {
  module.hot.accept("./containers/RootContainer", () => {
    render(RootContainer);
  });
}
