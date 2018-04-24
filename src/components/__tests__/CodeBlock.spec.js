import React from "react";
import { render } from "../../testUtils";

import CodeBlock from "../CodeBlock";

describe("/components/CodeBlock", () => {
  describe("render", () => {
    it("should pass down remaining props", () => {
      const { container } = render(
        <CodeBlock
          value=""
          className="hello-world"
          style={{ color: "red" }}
          data-infos="Hello world"
        />
      );
      expect(container.firstChild).toHaveClass("hello-world");
      expect(container.firstChild.style.color).toBe("red");
      expect(container.firstChild.getAttribute("data-infos")).toBe(
        "Hello world"
      );
    });
    it("should set className on <code> element according to props.language", () => {
      const { container } = render(<CodeBlock value="" language="js" />);
      const [codeElement] = container.getElementsByClassName("language-js");
      expect(codeElement).toBeTruthy();
    });
    // @todo test markdown formatting
  });
});
