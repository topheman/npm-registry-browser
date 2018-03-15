import React from "react";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

import Drawer from "../Drawer";

const makeProps = (overrideProps = {}) => ({
  anchor: "top",
  open: false,
  onClose: () => {},
  children: <div>Hello world</div>,
  ...overrideProps
});

describe("/components/Drawer", () => {
  describe("Drawer/render", () => {
    it("should render correctly", () => {
      const wrapper = shallow(<Drawer {...makeProps()} />);
      expect(toJSON(wrapper)).toMatchSnapshot();
    });
  });
});
