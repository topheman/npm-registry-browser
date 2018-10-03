import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Backdrop from "@material-ui/core/Backdrop";
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
    [theme.breakpoints.down("xs")]: {
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
    border: "1px solid #c9c9c9",
    backgroundImage: `url('data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><g><path fill="gray" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></g></svg>')`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "40px 40px",
    padding: 16,
    fontSize: "1.1rem",
    fontWeight: 500,
    fontFamily: `"Roboto", "Arial", sans-serif`,
    borderRadius: "5px",
    outline: "none",
    "-webkit-appearance": "none", // remove weird border radius on iOs devices
    // search icon on the left on regular screens
    backgroundPosition: "top 5px left 5px",
    paddingLeft: 50,
    paddingRight: 16,
    // search icon on the right on small screens
    [theme.breakpoints.down("sm")]: {
      backgroundPosition: "top 5px right 5px",
      paddingLeft: 16,
      paddingRight: 50
    }
  },
  inputFocus: {
    [theme.breakpoints.down("sm")]: {
      "&:focus": {
        // adjust search icon position
        backgroundPosition: "top 8px right 58px",
        paddingRight: 110,
        zIndex: 1332,
        border: 0,
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
    [theme.breakpoints.down("xs")]: {
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
   *
   * Same approach as https://reactjs.org/blog/2018/05/23/react-v-16-4.html#2-compare-incoming-props-to-previous-props-when-computing-controlled-values
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    const { prevProps = {} } = prevState;
    // Compare the incoming prop to previous prop
    const searchQuery =
      prevProps.searchQuery !== nextProps.searchQuery
        ? nextProps.searchQuery
        : prevState.searchQuery;
    return {
      // Store the previous props in state
      prevProps: nextProps,
      searchQuery
    };
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
    // update state.inputValue if it has been initialized (via getDerivedStateFromProps)
    if (this.state.searchQuery) {
      this.updateInputValueWithSearchQuery();
    }
  }
  componentDidUpdate(_prevProps, _prevState, snapshot) {
    // update state.inputValue when props.searchQuery changes (see getDerivedStateFromProps above)
    if (_prevState.searchQuery !== this.state.searchQuery) {
      this.updateInputValueWithSearchQuery();
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
  updateInputValueWithSearchQuery() {
    this.setState(state => ({
      inputValue: state.searchQuery
    }));
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
      >
        {({
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
                  placeholder: "Search packages ...",
                  onKeyDown: event => {
                    // when type enter inside text input : go to search results and close menu
                    if (event.key === "Enter" && highlightedIndex === null) {
                      event.preventDefault(); // prevent submitting the form
                      // only go to search results if any value is set
                      if (event.target.value !== "") {
                        // prevent loader to display while unfinished request comes back (wont be processed)
                        this.setState({
                          state: "loaded"
                        });
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
            {["loading", "error"].includes(state) && (
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
      </Downshift>
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
