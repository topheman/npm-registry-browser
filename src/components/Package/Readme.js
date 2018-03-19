import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "material-ui/ExpansionPanel";
import Typography from "material-ui/Typography";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
import BookIcon from "material-ui-icons/LibraryBooks";

import Markdown from "../Markdown";

import "./Readme.css";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  bookIcon: {
    verticalAlign: "middle",
    marginRight: "8px"
  },
  markdown: {
    overflow: "scroll",
    fontSize: theme.typography.body1.fontSize,
    lineHeight: theme.typography.body1.lineHeight
  }
});

class Readme extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }
  state = {
    expanded: this.props.defaultExpanded
  };
  toggle(event, expanded) {
    this.setState({
      expanded
    });
  }
  render() {
    const { classes, source } = this.props;
    const { expanded } = this.state;
    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={expanded} onChange={this.toggle}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              <BookIcon className={classes.bookIcon} />
              {expanded ? "Hide" : "Show"} readme
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Markdown
              source={source}
              className={`Readme-markdown__root ${classes.markdown}`}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

Readme.propTypes = {
  classes: PropTypes.object.isRequired,
  source: PropTypes.string,
  defaultExpanded: PropTypes.bool.isRequired
};
Readme.defaultProps = {
  source: "",
  defaultExpanded: true
};

export default withStyles(styles)(Readme);
