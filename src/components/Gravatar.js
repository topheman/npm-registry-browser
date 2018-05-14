import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";

import md5 from "js-md5";

const Gravatar = ({ email, size, ...remainingProps }) => (
  <Avatar
    src={`https://s.gravatar.com/avatar/${md5(email)}${
      size ? `?s=${size}` : ""
    }`}
    alt="avatar"
    {...remainingProps}
  />
);

Gravatar.propTypes = {
  email: PropTypes.string.isRequired,
  size: PropTypes.number
};

Gravatar.defaultProps = {
  size: undefined
};

export default Gravatar;
