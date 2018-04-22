import { parseQueryString } from "../url";

describe("utils/url", () => {
  describe("parseQueryString", () => {
    it("should return an empty object when passing undefined or empty string", () => {
      expect(parseQueryString()).toEqual({});
      expect(parseQueryString("")).toEqual({});
      expect(parseQueryString("?")).toEqual({});
    });
    it("should return an empty object when passing no params", () => {
      expect(parseQueryString("?")).toEqual({});
    });
    it("should parse a query string from location.search (with ? at beginning)", () => {
      expect(parseQueryString("?firstName=Christophe&lastName=Rosset")).toEqual(
        {
          firstName: "Christophe",
          lastName: "Rosset"
        }
      );
    });
    it("should handle special characters", () => {
      expect(
        parseQueryString("?type=D%C3%A9veloppeur&handle=@topheman")
      ).toEqual({
        type: "Développeur",
        handle: "@topheman"
      });
    });
  });
});
