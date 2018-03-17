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
    return (
      <pre>
        <code
          ref={ref => {
            this.codeEl = ref;
          }}
          className={`language-${this.props.language}`}
        >
          {this.props.value}
        </code>
      </pre>
    );
  }
}

CodeBlock.defaultProps = {
  language: ""
};

CodeBlock.propTypes = {
  value: PropTypes.string.isRequired,
  language: PropTypes.string
};

export default CodeBlock;
