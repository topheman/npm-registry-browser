import React from "react";
import { render } from "../../testUtils";

import Gravatar from "../Gravatar";

describe("/components/Footer", () => {
  describe("render", () => {
    it("should pass down className and style", () => {
      const { container } = render(
        <Gravatar
          email="tophe@topheman.com"
          className="hello-world"
          style={{ color: "red" }}
        />
      );
      expect(container.firstChild).toHaveClass("hello-world");
      expect(container.firstChild.style.color).toBe("red");
    });
    it("should render the correct img according to email", () => {
      const { getByAltText } = render(
        <Gravatar
          email="tophe@topheman.com"
          className="hello-world"
          style={{ color: "red" }}
        />
      );
      expect(getByAltText("avatar").src).toBe(
        "https://s.gravatar.com/avatar/4aa426e56a82cdab72b0c3a11cfa3982"
      );
    });
    it("should render a customized img", () => {
      const { getByAltText } = render(
        <Gravatar
          size={30}
          email="tophe@topheman.com"
          className="hello-world"
          style={{ color: "red" }}
        />
      );
      expect(getByAltText("avatar").src).toBe(
        "https://s.gravatar.com/avatar/4aa426e56a82cdab72b0c3a11cfa3982?s=30"
      );
    });
  });
});
