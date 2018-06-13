import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";
import HomeIcon from "@material-ui/icons/Home";
import InfoIcon from "@material-ui/icons/Info";
import WifiIcon from "@material-ui/icons/Wifi";
import MuiDrawer from "@material-ui/core/Drawer";
import classNames from "classnames";
import { Link } from "react-router-dom";

import twitterIcon from "../assets/images/twitter-retina.png";
import githubIcon from "../assets/images/github-retina.png";
import qrcode from "../assets/images/qrcode.png";

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
  listItem: {
    paddingTop: 8,
    paddingBottom: 8
  },
  listIcon: {
    width: 24,
    height: 24
  },
  qrcodeIcon: {
    backgroundImage: `url(${qrcode})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100%"
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
          <ListItemText primary="MENU" />
        </ListItem>
        <ListItem
          className={classes.listItem}
          button
          component={Link}
          to="/"
          title="Home"
          data-testid="link-to-home"
        >
          <ListItemIcon>
            <HomeIcon
              className={classNames(classes.svgColor, classes.listIcon)}
            />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          className={classes.listItem}
          button
          component={Link}
          to="/about"
          title="About"
          data-testid="link-to-about"
        >
          <ListItemIcon>
            <InfoIcon
              className={classNames(classes.svgColor, classes.listIcon)}
            />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
        <ListItem
          className={classes.listItem}
          button
          component={Link}
          to="/qrcode"
          title="Show Qrcode"
          data-testid="link-to-qrcode"
        >
          <ListItemIcon>
            <Icon className={classes.qrcodeIcon} />
          </ListItemIcon>
          <ListItemText primary="Show Qrcode" />
        </ListItem>
        <Divider style={{ marginTop: "30px" }} />
        <ListItem>
          <ListItemText primary="EXTERNAL" />
        </ListItem>

        <ListItem
          className={classes.listItem}
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
          className={classes.listItem}
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
        <ListItem
          className={classes.listItem}
          button
          component="a"
          href="http://labs.topheman.com"
          title="@topheman on twitter"
        >
          <ListItemIcon>
            <WifiIcon
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
