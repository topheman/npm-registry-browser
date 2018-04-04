import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import PackageIcon from "material-ui-icons/Folder";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";

const styles = theme => ({
  root: {
    paddingTop: 10
  },
  button: {
    margin: theme.spacing.unit
  },
  buttonsRoot: {
    textAlign: "center"
  }
});

const Home = ({ classes }) => {
  const packages = [
    "react",
    "react@16.2.0",
    "@angular/core",
    "@angular/core@5.2.8",
    "ember",
    "vue"
  ];
  return (
    <div className={classes.root}>
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
            <ListItemText>
              <Typography>{name}</Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
