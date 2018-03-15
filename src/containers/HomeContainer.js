import React from "react";
import { Link } from "react-router-dom";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import PackageIcon from "material-ui-icons/Folder";

const Home = () => {
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

export default Home;
