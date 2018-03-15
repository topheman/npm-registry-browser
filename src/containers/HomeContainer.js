import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import PackageIcon from "material-ui-icons/Folder";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";

import { ConnectedDrawer } from "../components/Drawer";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  buttonsRoot: {
    textAlign: "center"
  }
});

/**
 * You can see that we use <ConnectedDrawer/> with a render prop
 * to do the same thing as with HOC withDrawer() (use in MainLayout)
 */
const Home = ({ classes }) => {
  const packages = [
    "react",
    "react@16.2.0",
    "@angular/core",
    "@angular/core@5.2.8"
  ];
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page. This is still a work in progress.</p>
      <p>
        Trying <a href="https://material-ui-next.com">Material-UI</a> as a
        UI-kit.
      </p>
      <p>
        Play with the drawers (you can open the default one with the hamburger
        menu):
      </p>
      <ConnectedDrawer
        render={({ toggleDrawer, availablePositions }) => (
          <div className={classes.buttonsRoot}>
            {availablePositions.map(position => (
              <Button
                className={classes.button}
                key={position}
                variant="raised"
                color="primary"
                onClick={toggleDrawer(position, true)}
              >
                {position}
              </Button>
            ))}
          </div>
        )}
      />
      <h2>Packages</h2>
      <p>
        The following links will let you browse infos about packages from the
        npm registry (search will come later):
      </p>
      <List component="nav">
        {packages.map(name => (
          <ListItem button component={Link} to={`/package/${name}`} key={name}>
            <ListItemIcon>
              <PackageIcon />
            </ListItemIcon>
            <ListItemText inset primary={name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

Home.propTypes = {
  classes: PropTypes.object.isRequired // from withStyles(styles)
};

export default withStyles(styles)(Home);
