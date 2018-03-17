// inspired by https://github.com/rexxars/react-markdown/blob/master/demo/src/demo.js

import React from "react";
import ReactMarkdown from "react-markdown";
// import PropTypes from "prop-types";

import CodeBlock from "./CodeBlock";

const Markdown = props => (
  <ReactMarkdown {...props} renderers={{ code: CodeBlock }} />
);

export default Markdown;
