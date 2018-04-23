import React from "react";
import { render } from "../../testUtils";

import Footer from "../Footer";

describe("/components/Footer", () => {
  describe("render", () => {
    it("should pass down className and style", () => {
      const { container } = render(
        <Footer
          fromFullYear={2018}
          toFullYear={2018}
          className="hello-world"
          style={{ color: "red" }}
        />
      );
      expect(container.firstChild).toHaveClass("hello-world");
      expect(container.firstChild.style.color).toBe("red");
    });
  });
});
