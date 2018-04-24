import React from "react";
import { renderWithRouter } from "../../testUtils";

import Header from "../Header";

describe("/components/Header", () => {
  describe("render", () => {
    it("should pass down remainingProps", () => {
      const { container } = renderWithRouter(
        <Header
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
  });
});
