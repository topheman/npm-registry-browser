// inspired by https://github.com/rexxars/react-markdown/blob/master/demo/src/demo.js

import React from "react";
import ReactMarkdown, { uriTransformer } from "react-markdown";

import CodeBlock from "./CodeBlock";

/**
 * Transform urls in readme pointing to npmjs.com/package/* to #/package/*
 * @param {*} uri
 */
const transformLinkUri = uri => {
  // make sure to sanitize links through XSS-filter
  const sanitizedUri = uriTransformer(uri);
  return sanitizedUri
    ? sanitizedUri.replace(
        /http[s]?:\/\/(www\.)?npmjs.com\/package\//,
        "#/package/"
      )
    : null;
};

const Markdown = props => (
  <ReactMarkdown
    {...props}
    renderers={{ code: CodeBlock }}
    escapeHtml={false}
    transformLinkUri={transformLinkUri}
  />
);

export default Markdown;
