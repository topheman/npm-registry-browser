import { extractRepositoryInfos, extractHomePageInfos } from "../metadatas";

describe("/utils/metadatas", () => {
  describe("extractRepositoryInfos", () => {
    describe("extract/sanitize url", () => {
      const inputExpectedOutputs = [
        {
          received: "http://github.com/topheman/npm-registry-browser",
          expected: "https://github.com/topheman/npm-registry-browser"
        },
        {
          received: "https://github.com/topheman/npm-registry-browser",
          expected: "https://github.com/topheman/npm-registry-browser"
        },
        {
          received: "git://github.com/topheman/npm-registry-browser",
          expected: "https://github.com/topheman/npm-registry-browser"
        },
        {
          received: "git+http://github.com/topheman/npm-registry-browser",
          expected: "https://github.com/topheman/npm-registry-browser"
        },
        {
          received: "git+https://github.com/topheman/npm-registry-browser",
          expected: "https://github.com/topheman/npm-registry-browser"
        },
        {
          received: "http+git://github.com/topheman/npm-registry-browser",
          expected: "https://github.com/topheman/npm-registry-browser"
        },
        {
          received: "https+git://github.com/topheman/npm-registry-browser",
          expected: "https://github.com/topheman/npm-registry-browser"
        },
        {
          received: "https://github.com/topheman/npm-registry-browser.git",
          expected: "https://github.com/topheman/npm-registry-browser"
        },
        {
          received: "https://github.com/topheman/npm-registry-browser/",
          expected: "https://github.com/topheman/npm-registry-browser"
        },
        {
          received: "https://somewhere-else.com",
          expected: "https://somewhere-else.com"
        }
      ];
      inputExpectedOutputs.forEach(({ received, expected }) => {
        it(`sanitize schema ${received}`, () => {
          expect(extractRepositoryInfos(received).url).toEqual(expected);
        });
      });
    });
    describe("extract/sanitize infos", () => {
      it("github issues", () => {
        expect(
          extractRepositoryInfos(
            "https://github.com/topheman/npm-registry-browser"
          ).issuesUrl
        ).toEqual("https://github.com/topheman/npm-registry-browser/issues");
      });
      it("gitlab issues", () => {
        expect(
          extractRepositoryInfos(
            "https://gitlab.com/topheman/npm-registry-browser"
          ).issuesUrl
        ).toEqual("https://gitlab.com/topheman/npm-registry-browser/issues");
      });
      it("github pull requests", () => {
        expect(
          extractRepositoryInfos(
            "https://github.com/topheman/npm-registry-browser"
          ).pullsUrl
        ).toEqual("https://github.com/topheman/npm-registry-browser/pulls");
      });
      it("gitlab pull requests (called merge requests)", () => {
        expect(
          extractRepositoryInfos(
            "https://gitlab.com/topheman/npm-registry-browser"
          ).pullsUrl
        ).toEqual(
          "https://gitlab.com/topheman/npm-registry-browser/merge_requests"
        );
      });
      it("no match", () => {
        const result = extractRepositoryInfos("https://somewhere-else.com");
        expect(result.url).toEqual("https://somewhere-else.com");
        expect(result.issuesUrl).toBeUndefined();
        expect(result.pullsUrl).toBeUndefined();
      });
      it("should accept undefined as param", () => {
        expect(extractRepositoryInfos()).toBeUndefined();
      });
    });
    describe("match host type", () => {
      it("should match github", () => {
        expect(
          extractRepositoryInfos(
            "https://github.com/topheman/npm-registry-browser"
          ).repoType
        ).toEqual("github");
      });
      it("should match gitlab", () => {
        expect(
          extractRepositoryInfos(
            "https://gitlab.com/topheman/npm-registry-browser"
          ).repoType
        ).toEqual("gitlab");
      });
      it("should match none", () => {
        expect(
          extractRepositoryInfos("https://somewhere-else.com").repoType
        ).toEqual(false);
      });
    });
  });
  describe("extractHomePageInfos", () => {
    it("should return passed param", () => {
      expect(extractHomePageInfos("hello world")).toEqual("hello world");
    });
    it("should return value of url fiels if object was passed", () => {
      expect(extractHomePageInfos({ url: "hello world" })).toEqual(
        "hello world"
      );
    });
    it("accept undefined as param", () => {
      expect(extractHomePageInfos()).toBeUndefined();
    });
  });
});
