import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import CloseIcon from "@material-ui/icons/Close";
import HomeIcon from "@material-ui/icons/Home";
import MuiDrawer from "material-ui/Drawer";
import classNames from "classnames";

import twitterIcon from "../assets/images/twitter-retina.png";
import githubIcon from "../assets/images/github-retina.png";

const styles = {
  closeIcon: {
    cursor: "pointer",
    color: "gray",
    "&:hover": {
      color: "black"
    }
  },
  svgColor: {
    fill: "#900000"
  },
  verticalList: {
    width: 250
  },
  horizontalList: {
    width: "auto"
  },
  listIcon: {
    width: 24,
    height: 24
  }
};

const MainDrawer = ({ classes, anchor, open, onClose, ...remainingProps }) => {
  const sideList = (
    <div
      className={
        ["left", "right"].includes(anchor)
          ? classes.verticalList
          : classes.horizontalList
      }
    >
      <List component="nav">
        <ListItem>
          <CloseIcon className={classes.closeIcon} aria-label="Close" />
        </ListItem>
        <ListItem>
          <ListItemText primary="npm-registry-browser" />
        </ListItem>
        <Divider />
        <ListItem
          button
          component="a"
          href="https://github.com/topheman/npm-registry-browser"
          title="npm-registry-browser on github"
        >
          <ListItemIcon>
            <img src={githubIcon} className={classes.listIcon} alt="github" />
          </ListItemIcon>
          <ListItemText primary="Github" />
        </ListItem>
        <ListItem
          button
          component="a"
          href="https://twitter.com/topheman"
          title="@topheman on twitter"
        >
          <ListItemIcon>
            <img src={twitterIcon} className={classes.listIcon} alt="twitter" />
          </ListItemIcon>
          <ListItemText primary="Twitter" />
        </ListItem>
        <Divider />
        <ListItem
          button
          component="a"
          href="http://labs.topheman.com"
          title="@topheman on twitter"
        >
          <ListItemIcon>
            <HomeIcon
              className={classNames(classes.svgColor, classes.listIcon)}
            />
          </ListItemIcon>
          <ListItemText primary="labs.topheman.com" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <MuiDrawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      {...remainingProps}
    >
      <div
        tabIndex={0}
        role="button"
        onClick={onClose}
        onKeyDown={onClose}
        style={{ outline: "0px" }}
      >
        {sideList}
      </div>
    </MuiDrawer>
  );
};

MainDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  anchor: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withStyles(styles)(MainDrawer);
