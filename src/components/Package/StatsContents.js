import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";

import Sparkline from "../Sparkline";
import { yearDownloadsToWeaks } from "../../utils/npmApiHelpers";

const styles = {
  root: {},
  label: {},
  downloadsCount: {},
  datavizWrapper: {
    textAlign: "right"
  }
};

class StatsContents extends Component {
  static propTypes = {
    downloads: PropTypes.object.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  };
  static defaultProps = {
    className: "",
    style: {}
  };
  constructor(props) {
    super(props);
    this.state = {
      infos: null,
      downloads: null
    };
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }
  onMouseMove(event, datapoint) {
    if (datapoint) {
      this.setState({
        from: datapoint.from,
        to: datapoint.to,
        downloads: datapoint.value
      });
    }
  }
  onMouseOut() {
    this.setState({
      from: null,
      to: null,
      downloads: null
    });
  }
  render() {
    const data = yearDownloadsToWeaks(this.props.downloads.downloads);
    const { className, style, theme, classes } = this.props;
    const { from, to, downloads } = this.state;
    const lastWeekDownloadsCount = data[data.length - 1].value;
    return (
      <div className={className} style={style}>
        <div className={classes.root}>
          <Typography variant="subheading" className={classes.label}>
            {downloads
              ? `From ${new Date(from).toLocaleDateString()} to ${new Date(
                  to
                ).toLocaleDateString()}`
              : "Last 7 days (all versions)"}
          </Typography>
          <div className={classes.downloadsCount}>
            {(downloads || lastWeekDownloadsCount).toLocaleString()}
          </div>
          <div className={classes.datavizWrapper}>
            <Sparkline
              width={212}
              height={50}
              data={data}
              stroke={theme.palette.primary.main}
              fill="#ececec"
              onMouseMove={this.onMouseMove}
              onMouseOut={this.onMouseOut}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(StatsContents);
