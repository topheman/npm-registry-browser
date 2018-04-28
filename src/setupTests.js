/**
 * Setup file for test suites, specific to create-react-app
 *
 * Loaded before EACH test file
 *
 * Necessary for jest config with enzyme, see:
 * - http://airbnb.io/enzyme/docs/installation/index.html
 * - https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#initializing-test-environment
 */
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

/**
 * Gives access to the following jest custom matchers:
 * - toBeInTheDOM
 * - toHaveTextContent
 * - toHaveAttribute
 * - toHaveClass
 *
 * Can also be exposed from "dom-testing-library" via `import "dom-testing-library/extend-expect"`
 */
import "jest-dom/extend-expect";

configure({ adapter: new Adapter() });

global.window.resizeTo = (width, height) => {
  global.window.innerWidth = width || global.window.innerWidth;
  global.window.innerHeight = height || global.window.innerHeight;
  global.window.dispatchEvent(new Event("resize"));
};
