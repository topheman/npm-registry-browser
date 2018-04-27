import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Backdrop from "material-ui/Modal/Backdrop";
import Downshift from "downshift";
import { compose } from "recompose";
import classNames from "classnames";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import Loader from "./Loader";
import { withWindowInfos } from "./WindowInfos";
import { debounce } from "../utils/helpers";

/**
 *
 * @param {Object} windowInfos
 * @param {Object} theme
 * @return {Boolean}
 */
const isSmallScreen = (windowInfos, theme) =>
  windowInfos.windowWidth < theme.breakpoints.values.sm;

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
  escInput: {
    display: "block",
    background: "#900000",
    zIndex: 1332,
    position: "fixed",
    top: 0,
    left: 0,
    width: 50,
    height: 56,
    "& > svg": {
      width: 40,
      height: 40,
      fill: "white",
      marginTop: 8,
      marginLeft: 5,
      transform: "rotate(180deg)"
    }
  },
  input: {
    width: "100%",
    backgroundColor: "#ececec",
    border: 0,
    padding: 16,
    fontSize: "1.1rem",
    fontWeight: 500,
    fontFamily: `"Roboto", "Arial", sans-serif`,
    borderRadius: "5px",
    outline: "none",
    "-webkit-appearance": "none" // remove weird border radius on iOs devices
  },
  inputFocus: {
    [theme.breakpoints.down("sm")]: {
      "&:focus": {
        zIndex: 1332,
        borderRadius: 0,
        position: "fixed",
        top: 0,
        left: 50,
        right: 0,
        height: 56
      }
    }
  },
  itemsWrapper: {
    padding: 0,
    margin: 0,
    position: "absolute",
    zIndex: 2,
    left: 0,
    right: 0,
    border: "1px solid rgba(34,36,38,.15)",
    boxShadow: theme.shadows[1],
    [theme.breakpoints.up("sm")]: {
      maxHeight: 450,
      overflowY: "scroll"
    },
    [theme.breakpoints.down("sm")]: {
      position: "fixed",
      top: 50,
      zIndex: 1332
    }
  },
  item: {
    listStyle: "none",
    padding: "8px 16px",
    borderBottom: "1px solid #ececec",
    cursor: "pointer"
  },
  safeItem: {
    maxWidth: "80%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  itemName: {
    fontWeight: 500,
    "& > em": {
      fontWeight: "bold",
      fontStyle: "normal"
    }
  },
  itemDescription: {},
  itemVersion: {
    textAlign: "right",
    marginTop: -24
  },
  // following are the classes to override the CustomLoader
  customLoaderMessage: {
    display: "none"
  },
  customLoaderRoot: {
    verticalAlign: "center",
    padding: "O auto"
  },
  progress: {
    width: 50,
    margin: "-10px auto 10px"
  },
  backdrop: {
    // "-webkit-overflow-scrolling": "touch" // prevent scrolling (with the .preventScroll)
  }
});

class Search extends Component {
  /**
   * That way, state.inputValue can have its own internal state and sometimes,
   * when props.searchQuery changes from the parent, it can change with it.
   *
   * Track props.searchQuery and update our internal state.searchQuery
   * that way, if we have state.searchQuery in componentDidUpdate,
   * we need to update the state.inputValue
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.searchQuery !== prevState.searchQuery) {
      return {
        searchQuery: nextProps.searchQuery
      };
    }
    return null; // the new props do not require state updates
  }
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      inputValue: "",
      inputFocus: false,
      inputDisabled: false // will be used to prevent refocusing
    };
    this.inputEl = null;
  }
  componentDidMount() {
    window.addEventListener("touchstart", this.blurInputOnTouchOut, false);
  }
  componentDidUpdate(_prevProps, _prevState, snapshot) {
    // update state.inputValue when props.searchQuery changes (see getDerivedStateFromProps above)
    if (this.state.searchQuery !== null) {
      this.updateInputeValueWithSearchQuery();
    }
    // the snapshot from getSnapshotBeforeUpdate() tells us whether if we need to hide or show content to prevent sroll
    if (snapshot && snapshot.backdrop) {
      this.hideContentToPreventScroll(true);
    }
    if (snapshot && !snapshot.backdrop) {
      this.hideContentToPreventScroll(false);
    }
  }
  /**
   * cleanup listeners / outside styles
   */
  componentWillUnmount() {
    window.removeEventListener("touchstart", this.blurInputOnTouchOut);
    this.hideContentToPreventScroll(false);
  }
  /**
   * Identify if there is a backdrop.
   * The result of the snapshot is used in componentDidUpdate()
   */
  getSnapshotBeforeUpdate(_prevProps, prevState) {
    if (prevState.inputFocus !== this.state.inputFocus) {
      return {
        backdrop: this.state.inputFocus
      };
    }
    return null;
  }
  updateInputeValueWithSearchQuery() {
    this.setState({
      inputValue: this.state.searchQuery,
      searchQuery: null
    });
  }
  hideContentToPreventScroll = (add = true) => {
    // hide background content to avoid scrolling
    document
      .querySelectorAll("[data-section=content], [data-section=footer]")
      .forEach(el => {
        el.style.display = add ? "none" : "initial"; // eslint-disable-line
      });
  };
  /**
   * On iOs, clicking out doesn't blur the search field (neither close the search dropdown)
   * This fixes it.
   */
  blurInputOnTouchOut = event => {
    // go up the DOM tree from the touch to check if we are in the dropdown
    const ulAncestor = event.target.closest("ul") || { dataset: { type: {} } };
    // only trigger blur if touch not in input or in dropdown
    if (
      this.inputEl &&
      event.target !== this.inputEl &&
      ulAncestor.dataset.type !== "search-results"
    ) {
      this.inputEl.blur();
    }
  };
  debouncedSearch = debounce(
    value =>
      this.props
        .fetchInfos(value, {
          size: isSmallScreen(this.props.windowInfos, this.props.theme)
            ? 6
            : undefined
        }) // limit results on mobile
        .then(items => {
          this.setState({ items, state: "loaded" });
        })
        .catch(e => {
          console.error(e);
          this.setState({
            items: [],
            state: "error"
          });
        }),
    300
  );
  render() {
    const {
      goToPackage,
      goToSearchResults,
      windowInfos,
      classes,
      theme
    } = this.props;
    const smallScreen = isSmallScreen(windowInfos, theme);
    const { inputValue, items, state, inputFocus, inputDisabled } = this.state;
    return (
      <Downshift
        itemToString={item => (item && item.package && item.package.name) || ""}
        onChange={item => {
          this.setState({
            inputValue: "" // reset the value of the controlled input
          });
          if (this.inputEl) {
            this.inputEl.blur();
          }
          goToPackage(item.package.name);
        }}
        render={({
          selectedItem,
          getInputProps,
          getItemProps,
          highlightedIndex,
          isOpen,
          closeMenu
        }) => (
          <div className={classes.rootWrapper}>
            {/* To have a "Search" button on mobile virtual keyboards */}
            <form action=".">
              {(inputFocus || (!inputFocus && inputDisabled)) && (
                <div className={classes.escInput}>
                  <ExitToAppIcon />
                </div>
              )}
              <input
                data-testid="search-input"
                ref={node => {
                  this.inputEl = node;
                }}
                className={classNames(
                  classes.input,
                  inputFocus && classes.inputFocus
                )}
                {...getInputProps({
                  disabled: inputDisabled, // when blur out to prevent refocusing right away if clicking at the same place
                  type: "search",
                  value: inputValue,
                  placeholder: "Search packages",
                  onKeyDown: event => {
                    // when type enter inside text input : go to search results and close menu
                    if (event.key === "Enter" && highlightedIndex === null) {
                      event.preventDefault(); // prevent submitting the form
                      // only go to search results if any value is set
                      if (event.target.value !== "") {
                        if (smallScreen) {
                          event.target.blur(); // trigger blur to remove backdrop on small screen
                        }
                        closeMenu();
                        goToSearchResults(event.target.value);
                      }
                    }
                    // when hit escape on small screen - trigger blur to remove backdrop
                    if (smallScreen && event.key === "Escape") {
                      event.target.blur();
                    }
                  },
                  onChange: event => {
                    const value = event.target.value;
                    // the API only answer to queries with 2 chars or more
                    if (value.length > 1) {
                      this.setState(
                        {
                          inputValue: value, // keep track of the value of the input
                          state: "loading"
                        },
                        () => this.debouncedSearch(value)
                      );
                    } else {
                      this.setState({
                        inputValue: value, // keep track of the value of the input
                        items: []
                      });
                    }
                  },
                  onFocus: () => {
                    if (smallScreen) {
                      this.setState({
                        inputFocus: true
                      });
                    }
                  },
                  onBlur: () => {
                    if (smallScreen) {
                      this.setState({
                        inputFocus: false,
                        inputDisabled: true // that way if you click on the input right away, it won't refocus
                      });
                      setTimeout(
                        () =>
                          this.setState({
                            inputDisabled: false
                          }),
                        200
                      );
                    }
                  }
                })}
              />
            </form>
            {inputFocus &&
              ["loading", "error"].includes(state) && (
                <ul className={classes.itemsWrapper} data-type="search-results">
                  <li
                    data-testid="search-loading-indicator"
                    className={classes.item}
                    style={{
                      paddingTop: "30px",
                      backgroundColor: "white"
                    }}
                  >
                    {state === "loading" ? (
                      <Loader
                        message=""
                        overrideClasses={{
                          customLoaderMessage: classes.customLoaderMessage,
                          customLoaderRoot: classes.customLoaderRoot,
                          progress: classes.progress
                        }}
                      />
                    ) : (
                      "error"
                    )}
                  </li>
                </ul>
              )}
            {isOpen &&
              state === "loaded" &&
              items &&
              items.length > 0 && (
                <ul className={classes.itemsWrapper} data-type="search-results">
                  {items.map((item, index) => (
                    <li
                      data-testid={`search-result-${item.package.name}`}
                      key={item.package.name}
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
                        dangerouslySetInnerHTML={{ __html: item.highlight }}
                      />
                      <Typography
                        className={`${classes.itemDescription} ${
                          classes.safeItem
                        }`}
                      >
                        {item.package.description}
                      </Typography>
                      <Typography className={classes.itemVersion}>
                        {item.package.version}
                      </Typography>
                    </li>
                  ))}
                </ul>
              )}
            <Backdrop
              style={(inputFocus && { zIndex: 1331 }) || undefined}
              className={classes.backdrop}
              open={inputFocus}
            />
          </div>
        )}
      />
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  fetchInfos: PropTypes.func.isRequired,
  goToPackage: PropTypes.func.isRequired,
  goToSearchResults: PropTypes.func.isRequired,
  windowInfos: PropTypes.object.isRequired
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withWindowInfos()
)(Search);
