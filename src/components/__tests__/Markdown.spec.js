import React from "react";
import { render } from "../../testUtils";

import Markdown from "../Markdown";

describe("/components/Markdown", () => {
  describe("render", () => {
    it("should ONLY pass className from remainingProps", () => {
      const { container } = render(
        <Markdown
          className="hello-world"
          style={{ color: "red" }}
          data-infos="Hello world"
        />
      );
      expect(container.firstChild).toHaveClass("hello-world");
      expect(container.firstChild.style.color).not.toBe("red");
      expect(container.firstChild.getAttribute("data-infos")).not.toBe(
        "Hello world"
      );
    });
  });
});
