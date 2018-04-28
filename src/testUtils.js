// inpired by https://github.com/kentcdodds/testing-workshop/blob/master/client/test/til-client-test-utils.js

import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "react-testing-library";

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
