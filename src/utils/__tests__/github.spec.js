import { buildImageUrl, buildLinkUrl } from "../github";

describe("utils/github", () => {
  describe("buildLinkUrl", () => {
    it("should not alter absolute urls", () => {
      const input = ["https://example.com", `C:\\somefile`, "//example"];
      const output = input.map(url => buildLinkUrl(undefined, url));
      expect(input).toEqual(output);
    });
    it("should rewrite relative urls", () => {
      const input = ["about.html", "/", "tutorial1/", "../"];
      const expected = [
        "https://github.com/topheman/npm-repository-browser/blob/HEAD/about.html",
        "https://github.com/topheman/npm-repository-browser/blob/HEAD/",
        "https://github.com/topheman/npm-repository-browser/blob/HEAD/tutorial1/",
        "https://github.com/topheman/npm-repository-browser/blob/HEAD/../"
      ];
      const received = input.map(url =>
        buildLinkUrl(
          { url: "https://github.com/topheman/npm-repository-browser" },
          url
        )
      );
      expect(received).toEqual(expected);
    });
  });
  describe("buildImageUrl", () => {
    it("should not alter absolute urls", () => {
      const received = buildImageUrl(
        { user: "topheman", repo: "npm-repository-browser" },
        "https://example.com/image.png"
      );
      expect(received).toEqual("https://example.com/image.png");
    });
    it("should rewrite relative urls", () => {
      const received = buildImageUrl(
        { user: "topheman", repo: "npm-repository-browser" },
        "/static/image.png"
      );
      expect(received).toEqual(
        "https://raw.githubusercontent.com/topheman/npm-repository-browser/HEAD/static/image.png"
      );
    });
  });
});
