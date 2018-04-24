// inspired by https://github.com/rexxars/react-markdown/blob/cf194cec7e016b3fec185adfd568eec28d9787c0/demo/src/code-block.js

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { highlightBlock } from "highlight.js";

class CodeBlock extends PureComponent {
  componentDidMount() {
    this.highlightCode();
  }
  componentDidUpdate() {
    this.highlightCode();
  }
  highlightCode() {
    highlightBlock(this.codeEl);
  }
  render() {
    const { value, language } = this.props;
    return (
      <pre {...this.props}>
        <code
          ref={ref => {
            this.codeEl = ref;
          }}
          className={`language-${language}`}
        >
          {value}
        </code>
      </pre>
    );
  }
}

CodeBlock.propTypes = {
  value: PropTypes.string.isRequired,
  language: PropTypes.string
};
CodeBlock.defaultProps = {
  language: ""
};

export default CodeBlock;
