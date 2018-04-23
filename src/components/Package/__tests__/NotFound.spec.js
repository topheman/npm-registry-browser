import React from "react";
import { render } from "../../../testUtils";

import NotFound from "../NotFound";

describe("/components/NotFound", () => {
  describe("render", () => {
    it("should pass down className and style", () => {
      const { container } = render(
        <NotFound
          packageName="foo"
          className="hello-world"
          style={{ color: "red" }}
        />
      );
      expect(container.firstChild).toHaveClass("hello-world");
      expect(container.firstChild.style.color).toBe("red");
    });
  });
});
