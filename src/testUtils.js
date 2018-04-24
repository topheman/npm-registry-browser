// inpired by https://github.com/kentcdodds/testing-workshop/blob/master/client/test/til-client-test-utils.js

import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "react-testing-library";
// add the custom expect matchers
import "dom-testing-library/extend-expect";
/**
 * Gives access to following jest custom matcher:
 * - toBeInTheDOM
 * - toHaveTextContent
 * - toHaveAttribute
 * - toHaveClass
 */
import "jest-dom/extend-expect";

const renderWithRouter = (ui, renderOptions = {}) =>
  render(<MemoryRouter>{ui}</MemoryRouter>, renderOptions);

export {
  Simulate,
  wait,
  render,
  cleanup,
  renderIntoDocument,
  fireEvent
} from "react-testing-library";
export { renderWithRouter };
