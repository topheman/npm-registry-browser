import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import MainLayout from "./components/MainLayout";

// Containers that will be loaded by the router
import HomeContainer from "./containers/HomeContainer";
import PackageContainer from "./containers/PackageContainer";
import SearchResultsContainer from "./containers/SearchResultsContainer";
import QrcodeContainer from "./containers/QrcodeContainer";
import AboutContainer from "./containers/AboutContainer";

/**
 * Compiles a render method to pass to a Route that will redirect to "latest" version
 * Examples:
 * - /package/react -> package/react@latest
 * - /package/@angular/core -> /package/@angular/core@latest
 * The Package container will handle it from their (there is always a "latest" dist tag to match)
 * @param {Boolean} scoped
 */
const compileRedirectToLatest = scoped => (
  { match: { params } } // eslint-disable-line
) => (
  <Redirect
    replace
    to={
      "/package" +
      (scoped ? "/@" + params.scope : "") +
      ("/" + params.name + "@latest")
    }
  />
);

const Routes = () => (
  <HashRouter>
    <MainLayout>
      <Switch>
        <Route exact path="/" component={HomeContainer} />
        <Route exact path="/qrcode" component={QrcodeContainer} />
        <Route exact path="/about" component={AboutContainer} />
        <Route
          exact
          path="/package/@:scope/:name@:version"
          component={PackageContainer}
        />
        <Route
          exact
          path="/package/@:scope/:name"
          render={compileRedirectToLatest(true)}
        />
        <Route
          exact
          path="/package/:name@:version"
          component={PackageContainer}
        />
        <Route
          exact
          path="/package/:name"
          render={compileRedirectToLatest(false)}
        />
        <Route exact path="/search" component={SearchResultsContainer} />
      </Switch>
    </MainLayout>
  </HashRouter>
);

export default Routes;
