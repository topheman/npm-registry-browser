import React from "react";
import { renderWithRouter } from "../../testUtils";

import Header from "../Header";

describe.only("/components/Header", () => {
  describe("render", () => {
    it("should pass down className and style", () => {
      const { container } = renderWithRouter(
        <Header className="hello-world" style={{ color: "red" }} />
      );
      expect(container.firstChild).toHaveClass("hello-world");
      expect(container.firstChild.style.color).toBe("red");
    });
  });
});
