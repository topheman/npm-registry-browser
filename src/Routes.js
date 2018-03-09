import React, { Fragment } from "react";
import { HashRouter, Route } from "react-router-dom";

import MainLayout from "./containers/MainLayout/MainLayout";

import Home from "./containers/Home/Home";

const ucFirst = str =>
  (str && str.charAt(0).toUpperCase() + str.slice(1)) || "";

const Routes = () => (
  <HashRouter>
    <MainLayout>
      <Fragment>
        <Route exact path="/" component={Home} />
        <Route
          path="/:page?"
          render={({ match }) => <h1>{ucFirst(match.params.page)}</h1>}
        />
      </Fragment>
    </MainLayout>
  </HashRouter>
);

export default Routes;
