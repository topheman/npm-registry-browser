import React from "react";
import { renderWithRouter } from "../../testUtils";

import KeywordsList from "../KeywordsList";

describe("/components/KeywordsList", () => {
  describe("render", () => {
    it("should pass down className and style", () => {
      const { container } = renderWithRouter(
        <KeywordsList
          keywords={["foo", "bar"]}
          className="hello-world"
          style={{ color: "red" }}
        />
      );
      expect(container.firstChild).toHaveClass("hello-world");
      expect(container.firstChild.style.color).toBe("red");
    });
    // @todo test links to keywords
  });
});
