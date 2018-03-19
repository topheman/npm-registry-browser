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
  /**
   * To override the whole fontSize, see https://material-ui-next.com/customization/themes/#typography-font-size
   * Prefer <Typography> to plain html tags like <p> <h1> <li> ...
   *
   * This will ensure that you rem as units (so if you change the base fontSize, it will "cascade")
   *
   * This part feels very weird when first using a ui-kit based on css-in-js ...
   */
  typography: {
    // htmlFontSize: 12 // also update index.css
  }
  // overrides: {
  //   MuiListItem: {
  //     default: {
  //       paddingTop: 8,
  //       paddingBottom: 8
  //     }
  //   }
  // }
});

console.log(theme);

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
