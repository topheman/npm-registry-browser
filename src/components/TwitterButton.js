// inspired by https://github.com/topheman/d3-react-experiments/blob/master/src/components/TwitterButton/TwitterButton.js

import React from "react";
import PropTypes from "prop-types";

/**
 * This component renders directly the iframe of twitter without running external script
 * to avoid messing up with react's internal DOM and break react hot loader
 *
 * @param {String} size
 * @param {String} lang
 * @param {Boolean} dnt
 * @param {String} text
 * @param {String} url
 * @param {String} hashtags
 * @param {String} via
 * @param {String} related
 * @param {String} buttonTitle
 */
const TwitterButton = props => {
  const {
    size,
    lang,
    dnt,
    text,
    url,
    hashtags,
    via,
    related,
    buttonTitle
  } = props;
  console.log(props);
  const params = [
    `size=${size}`,
    "count=none",
    `dnt=${dnt}`,
    `lang=${lang}`,
    typeof text !== "undefined" && `text=${encodeURIComponent(text)}`,
    typeof url !== "undefined" && `url=${encodeURIComponent(url)}`,
    typeof hashtags !== "undefined" &&
      `hashtags=${encodeURIComponent(hashtags)}`,
    typeof via !== "undefined" && `via=${encodeURIComponent(via)}`,
    typeof related !== "undefined" && `related=${encodeURIComponent(related)}`
  ]
    .filter(item => item !== undefined)
    .join("&");
  return (
    <iframe
      width="78px"
      height="28px"
      title={buttonTitle}
      style={{ border: 0, overflow: "hidden" }}
      scrolling="no"
      src={`https://platform.twitter.com/widgets/tweet_button.html?${params}`}
    />
  );
};

TwitterButton.defaultProps = {
  size: "l",
  lang: "en",
  dnt: false,
  buttonTitle: "Twitter Tweet Button"
};

TwitterButton.propTypes = {
  size: PropTypes.oneOf(["l", "large"]).isRequired, // no default for the moment, only large
  lang: PropTypes.string.isRequired,
  dnt: PropTypes.bool.isRequired,
  text: PropTypes.string, // eslint-disable-line react/require-default-props
  url: PropTypes.string, // eslint-disable-line react/require-default-props
  hashtags: PropTypes.string, // eslint-disable-line react/require-default-props
  via: PropTypes.string, // eslint-disable-line react/require-default-props
  related: PropTypes.string, // eslint-disable-line react/require-default-props
  buttonTitle: PropTypes.string.isRequired
};

export default TwitterButton;
