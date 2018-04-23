import React from "react";
import { render } from "../../testUtils";

import CodeBlock from "../CodeBlock";

describe("/components/CodeBlock", () => {
  describe("render", () => {
    it("should pass down className and style", () => {
      const { container } = render(
        <CodeBlock value="" className="hello-world" style={{ color: "red" }} />
      );
      expect(container.firstChild).toHaveClass("hello-world");
      expect(container.firstChild.style.color).toBe("red");
    });
    it("should set className on <code> element according to props.language", () => {
      const { container } = render(<CodeBlock value="" language="js" />);
      const [codeElement] = container.getElementsByClassName("language-js");
      expect(codeElement).toBeTruthy();
    });
    // @todo test markdown formatting
  });
});
