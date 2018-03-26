import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Downshift from "downshift";

import { debounce } from "../utils/helpers";

const styles = theme => ({
  rootWrapper: {
    position: "relative",
    display: "block",
    [theme.breakpoints.down("sm")]: {
      width: "90vw"
    },
    [theme.breakpoints.up("sm")]: {
      width: "80vw"
    },
    [theme.breakpoints.up("md")]: {
      width: "60vw"
    },
    margin: "0 auto"
  },
  input: {
    width: "100%",
    backgroundColor: "#ececec",
    border: 0,
    padding: 16,
    fontSize: "1.1rem",
    fontWeight: 500,
    fontFamily: `"Roboto", "Arial", sans-serif`,
    borderRadius: 5,
    outline: "none"
  },
  itemsWrapper: {
    padding: 0,
    margin: 0,
    position: "absolute",
    zIndex: 2,
    left: 0,
    right: 0,
    border: "1px solid rgba(34,36,38,.15)",
    overflowY: "scroll",
    [theme.breakpoints.down("sm")]: {
      maxHeight: 200
    },
    [theme.breakpoints.up("sm")]: {
      maxHeight: 450
    },
    "& li:last-child": {
      border: 0
    }
  },
  item: {
    padding: "8px 16px",
    borderBottom: "1px solid #ececec"
  },
  safeItem: {
    maxWidth: "80%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  itemName: {},
  itemDescription: {},
  itemVersion: {
    textAlign: "right",
    marginTop: -24
  }
});

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [] };
  }
  debouncedSearch = debounce(
    value =>
      this.props
        .fetchInfos(value)
        .then(items => {
          this.setState({ items });
        })
        .catch(e => console.error(e)),
    300
  );
  render() {
    const { goToPackage, classes } = this.props;
    return (
      <Downshift
        itemToString={item => (item && item.name) || ""}
        onChange={item => goToPackage(item.name)}
        render={({
          selectedItem,
          getInputProps,
          getItemProps,
          highlightedIndex,
          isOpen
        }) => (
          <div className={classes.rootWrapper}>
            <input
              className={classes.input}
              {...getInputProps({
                placeholder: "Search packages",
                onChange: event => {
                  const value = event.target.value;
                  if (!value) {
                    return;
                  }
                  this.debouncedSearch(value);
                }
              })}
            />
            {isOpen &&
              this.state.items &&
              this.state.items.length > 0 && (
                <ul className={classes.itemsWrapper}>
                  {this.state.items.map((item, index) => (
                    <li
                      key={item.name}
                      className={classes.item}
                      {...getItemProps({
                        item,
                        style: {
                          backgroundColor:
                            highlightedIndex === index ? "#ececec" : "white",
                          fontWeight: selectedItem === item ? "bold" : "normal"
                        }
                      })}
                    >
                      <Typography
                        variant="subheading"
                        className={`${classes.itemName} ${classes.safeItem}`}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        className={`${classes.itemDescription} ${
                          classes.safeItem
                        }`}
                      >
                        {item.description}
                      </Typography>
                      <Typography className={classes.itemVersion}>
                        {item.version}
                      </Typography>
                    </li>
                  ))}
                </ul>
              )}
          </div>
        )}
      />
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchInfos: PropTypes.func.isRequired,
  goToPackage: PropTypes.func.isRequired
};

export default withStyles(styles)(Search);
