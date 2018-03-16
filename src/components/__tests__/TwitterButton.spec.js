import React from "react";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

import TwitterButton from "../TwitterButton";

const makeProps = (overrideProps = {}) => ({
  text: "This is my tweet",
  url: "http://dev.topheman.com",
  hashtags: "react, twitter",
  via: "topheman",
  related: "testing, react",
  ...overrideProps
});

describe("/components/TwitterButton", () => {
  describe("render", () => {
    it("should render correctly with default props", () => {
      const wrapper = shallow(<TwitterButton />);
      expect(toJSON(wrapper)).toMatchSnapshot();
    });
    it("should render correctly with simple props", () => {
      const wrapper = shallow(<TwitterButton {...makeProps()} />);
      expect(toJSON(wrapper)).toMatchSnapshot();
    });
    it("should render correctly with props needing escape", () => {
      const wrapper = shallow(
        <TwitterButton
          {...makeProps({
            text: "Un tweet en français. Le verbe être #accents",
            url:
              "https://topheman.github.io/d3-react-experiments/#/victory/count-npm-downloads"
          })}
        />
      );
      expect(toJSON(wrapper)).toMatchSnapshot();
    });
  });
});
