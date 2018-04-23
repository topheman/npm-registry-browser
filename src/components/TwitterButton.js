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
    buttonTitle,
    className,
    style
  } = props;
  const params = [
    `size=${size}`,
    "count=none",
    `dnt=${dnt}`,
    `lang=${lang}`,
    (typeof text !== "undefined" && `text=${encodeURIComponent(text)}`) ||
      undefined,
    (typeof url !== "undefined" && `url=${encodeURIComponent(url)}`) ||
      undefined,
    (typeof hashtags !== "undefined" &&
      `hashtags=${encodeURIComponent(hashtags)}`) ||
      undefined,
    (typeof via !== "undefined" && `via=${encodeURIComponent(via)}`) ||
      undefined,
    (typeof related !== "undefined" &&
      `related=${encodeURIComponent(related)}`) ||
      undefined
  ]
    .filter(item => item !== undefined)
    .join("&");
  const mergedStyles = {
    border: 0,
    overflow: "hidden",
    ...style
  };
  return (
    <iframe
      width="78px"
      height="28px"
      title={buttonTitle}
      style={mergedStyles}
      scrolling="no"
      className={className}
      src={`https://platform.twitter.com/widgets/tweet_button.html?${params}`}
    />
  );
};

TwitterButton.propTypes = {
  size: PropTypes.oneOf(["l", "large"]).isRequired, // no default for the moment, only large
  lang: PropTypes.string.isRequired,
  dnt: PropTypes.bool.isRequired,
  text: PropTypes.string,
  url: PropTypes.string,
  hashtags: PropTypes.string,
  via: PropTypes.string,
  related: PropTypes.string,
  buttonTitle: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};
TwitterButton.defaultProps = {
  size: "l",
  lang: "en",
  dnt: false,
  buttonTitle: "Twitter Tweet Button",
  text: undefined,
  url: undefined,
  hashtags: undefined,
  via: undefined,
  related: undefined,
  className: undefined,
  style: undefined
};

export default TwitterButton;
