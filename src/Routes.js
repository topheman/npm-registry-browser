import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import MainLayout from "./containers/MainLayout/MainLayout";

import Home from "./containers/Home/Home";
import Package from "./containers/Package/Package";

const Routes = () => (
  <HashRouter>
    <MainLayout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route
          exact
          path="/package/@:scope/:name@:version"
          component={Package}
        />
        <Route exact path="/package/@:scope/:name" component={Package} />
        <Route exact path="/package/:name@:version" component={Package} />
        <Route exact path="/package/:name" component={Package} />
      </Switch>
    </MainLayout>
  </HashRouter>
);

export default Routes;
