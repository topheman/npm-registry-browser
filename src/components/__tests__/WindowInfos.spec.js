/* eslint-disable react/no-multi-comp  */
/**
 * This test is done using react-testing-library, not enzyme.
 * Why ? At the time I'm writting it, enzyme is not yet ready for the new context API
 * It's also a good way to try this testing library which has just got added to the official react doc
 * about test utilies - https://twitter.com/kentcdodds/status/981961256008548352
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { render } from "react-testing-library";
// add the custom expect matchers
import "react-testing-library/extend-expect";

import { timeout } from "../../utils/time";

import {
  Provider,
  ConnectedWindowInfos,
  withWindowInfos
} from "../WindowInfos";

const renderWithProvider = (ui, ...config) =>
  render(<Provider>{ui}</Provider>, ...config);

// to be decorated with withWindowInfos
const MyComponent = ({ windowInfos }) => (
  <div>
    <span data-testid="width">{windowInfos.windowWidth}</span>
    <span data-testid="height">{windowInfos.windowHeight}</span>
  </div>
);
MyComponent.propTypes = {
  windowInfos: PropTypes.object.isRequired
};

// to be used as render prop in ConnectedWindowInfos
const myRenderProp = ({ windowWidth, windowHeight }) => (
  <div>
    <span data-testid="width">{windowWidth}</span>
    <span data-testid="height">{windowHeight}</span>
  </div>
);
myRenderProp.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired
};

describe("/components/WindowInfos", () => {
  describe("Provider/render", () => {
    it("should render children", () => {
      const { queryByTestId } = renderWithProvider(
        <div data-testid="child">Hello world!</div>
      );
      // use queryByTestId with toBeInTheDOM
      expect(queryByTestId("child")).toBeInTheDOM();
      expect(queryByTestId("not-a-child")).not.toBeInTheDOM();
    });
  });
  describe("withWindowInfos/render", () => {
    it("should inject props.windowInfos into a component that uses withWindowInfos()(Component) HOC", () => {
      const MyComponentWithWindowInfos = withWindowInfos()(MyComponent);
      const { getByTestId } = renderWithProvider(
        <MyComponentWithWindowInfos />
      );
      // use getByTestId with others
      expect(getByTestId("width")).toHaveTextContent("960");
      expect(getByTestId("height")).toHaveTextContent("640");
    });
    it("should properly update injected props on HOC when window is resized", async () => {
      const MyComponentWithWindowInfos = withWindowInfos()(MyComponent);
      const { getByTestId, container } = renderWithProvider(
        <MyComponentWithWindowInfos />
      );
      expect(getByTestId("width")).toHaveTextContent("960");
      expect(getByTestId("height")).toHaveTextContent("640");
      global.window.resizeTo(1200, 800); // declared in src/setupTest.js
      await timeout(Provider.defaultProps.debounceTime); // wait 500ms (the resize event is debounced)
      renderWithProvider(<MyComponentWithWindowInfos />, { container }); // update the render of the component
      expect(getByTestId("width")).toHaveTextContent("1200");
      expect(getByTestId("height")).toHaveTextContent("800");
    });
    it("should expose .WrappedComponent attribute containing original component when using withWindowInfos()(Component)", () => {
      const MyComponentWithWindowInfos = withWindowInfos()(MyComponent);
      expect(MyComponent).toEqual(MyComponentWithWindowInfos.WrappedComponent);
    });
    it("should hoist static properties when using withWindowInfos()(Component)", () => {
      class CustomComponent extends Component {
        static myStaticProperty = true;
      }
      const CustomComponentWithWindowInfos = withWindowInfos()(CustomComponent);
      expect(CustomComponentWithWindowInfos.myStaticProperty).toBe(true);
    });
    // @todo check innerRef
  });
  describe("ConnectedWindowInfos/render", () => {
    it("render prop should render with defaults", () => {
      const { getByTestId } = renderWithProvider(
        <ConnectedWindowInfos render={myRenderProp} />
      );
      expect(getByTestId("width")).toHaveTextContent("960");
      expect(getByTestId("height")).toHaveTextContent("640");
    });
    it("render prop should update on window resize", async () => {
      const { getByTestId, container } = renderWithProvider(
        <ConnectedWindowInfos render={myRenderProp} />
      );
      expect(getByTestId("width")).toHaveTextContent("960");
      expect(getByTestId("height")).toHaveTextContent("640");
      global.window.resizeTo(1200, 800); // declared in src/setupTest.js
      await timeout(Provider.defaultProps.debounceTime); // wait 500ms (the resize event is debounced)
      renderWithProvider(<ConnectedWindowInfos render={myRenderProp} />, {
        container
      }); // update the render of the component
      expect(getByTestId("width")).toHaveTextContent("1200");
      expect(getByTestId("height")).toHaveTextContent("800");
    });
  });
});
