import React from "react";
import { render } from "../../testUtils";

import Footer from "../Footer";

describe("/components/Footer", () => {
  describe("render", () => {
    it("should pass down remainingProps", () => {
      const { container } = render(
        <Footer
          fromFullYear={2018}
          toFullYear={2018}
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
