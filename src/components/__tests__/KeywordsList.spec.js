import React from "react";
import { renderWithRouter } from "../../testUtils";

import KeywordsList from "../KeywordsList";

describe("/components/KeywordsList", () => {
  describe("render", () => {
    it("should pass down remainingProps", () => {
      const { container } = renderWithRouter(
        <KeywordsList
          keywords={["foo", "bar"]}
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
    // @todo test links to keywords
  });
});
