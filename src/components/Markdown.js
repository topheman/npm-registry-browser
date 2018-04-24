// inspired by https://github.com/rexxars/react-markdown/blob/master/demo/src/demo.js

import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown, { uriTransformer } from "react-markdown";

import CodeBlock from "./CodeBlock";
import { buildImageUrl, buildLinkUrl } from "../utils/github";

const ANCHOR_PREFIX = "anchor-";

/**
 * Transforms urls inside readme
 * - pointing to npmjs.com/package/* to #/package/*
 * - relative urls in github readme markdown to absolute ones to keep html links
 *
 * Only applied to mardown (not html code in markdown)
 *
 * @param {*} uri
 */
const makeTransformLinkUri = ({ repository }) => uri => {
  // make sure to sanitize links through XSS-filter
  let sanitizedUri = uriTransformer(uri);
  // transform github relative links to absolute ones
  // keep the anchors - will be rendered by LinkRenderer
  sanitizedUri =
    repository.isGithub && !(uri && uri.startsWith("#"))
      ? buildLinkUrl(repository, sanitizedUri)
      : sanitizedUri;
  // transform links to npm to be used by our front router
  return sanitizedUri
    ? sanitizedUri.replace(
        /http[s]?:\/\/(www\.)?npmjs.com\/package\//,
        "#/package/"
      )
    : null;
};

/**
 * Transforms relative image urls inside readme to absolute ones
 * poiting to raw.githubusercontent.com (that will serve the correct mime type)
 *
 * Only applied to mardown (not html code in markdown)
 *
 * @param {*} uri
 */
const makeTransformImageUri = ({ repository }) => uri => {
  // make sure to sanitize links through XSS-filter
  let sanitizedUri = uriTransformer(uri);
  // transform github relative links to images to absolute one to raw.githubusercontent.com
  sanitizedUri = repository.isGithub
    ? buildImageUrl(repository, sanitizedUri)
    : sanitizedUri;
  return sanitizedUri;
};

/** Renderer Headers with ids to scroll to */

function flatten(text, child) {
  return typeof child === "string"
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text);
}

const HeadingRenderer = props => {
  const children = React.Children.toArray(props.children);
  const text = children.reduce(flatten, "");
  const slug = `${ANCHOR_PREFIX}${text.toLowerCase().replace(/\W/g, "-")}`;
  return React.createElement("h" + props.level, { id: slug }, props.children);
};
HeadingRenderer.propTypes = {
  level: PropTypes.number.isRequired,
  children: PropTypes.array
};
HeadingRenderer.defaultProps = {
  children: undefined
};

/** Renderer Links with handler to prevent links to anchors (and scroll to headers) */

const scrollTo = anchorName => e => {
  e.preventDefault();
  const el = document.getElementById(anchorName.replace("#", ANCHOR_PREFIX));
  if (el) {
    window.scrollTo(0, el.offsetTop - 90);
  }
};

const LinkRenderer = props => {
  const children = React.Children.toArray(props.children);
  if (
    props.href &&
    props.href.startsWith("#") &&
    !props.href.startsWith("#/package") // exclude rewritten urls
  ) {
    return React.createElement(
      "a",
      {
        ...props,
        href: "",
        onClick: scrollTo(props.href)
      },
      children
    );
  }
  return React.createElement("a", props, children);
};
LinkRenderer.propTypes = {
  href: PropTypes.string,
  children: PropTypes.array
};
LinkRenderer.defaultProps = {
  href: undefined,
  children: undefined
};

/** Markdown component */

const Markdown = ({ repository, source, ...remainingProps }) => (
  <ReactMarkdown
    source={source}
    renderers={{
      code: CodeBlock,
      heading: HeadingRenderer,
      link: LinkRenderer
    }}
    escapeHtml={false}
    transformLinkUri={makeTransformLinkUri({ repository })}
    transformImageUri={makeTransformImageUri({ repository })}
    {...remainingProps}
  />
);
Markdown.propTypes = {
  source: PropTypes.string,
  repository: PropTypes.object
};
Markdown.defaultProps = {
  source: "",
  repository: {}
};

export default Markdown;
