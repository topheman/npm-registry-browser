import {
  extractRepositoryInfos,
  extractHomePageInfos,
  extractPeopleInfos,
  extractReadme,
  extractMaintainers
} from "../metadatas";

import packageJsonWithInnerReadme from "./react-package-registry.fixtures.json";
import packageJsonWithRootReadme from "./lodash-package-registry.fixtures.json";

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
  describe("extractPeopleInfos", () => {
    const inputExpectedOutputs = [
      {
        received: "Christophe Rosset",
        expected: { name: "Christophe Rosset" }
      },
      {
        received: "Christophe Rosset <tophe@topheman.com>",
        expected: { name: "Christophe Rosset", email: "tophe@topheman.com" }
      },
      {
        received: "Christophe Rosset (http://labs.topheman.com)",
        expected: { name: "Christophe Rosset", url: "http://labs.topheman.com" }
      },
      {
        received:
          "Christophe Rosset <tophe@topheman.com> (http://labs.topheman.com)",
        expected: {
          name: "Christophe Rosset",
          email: "tophe@topheman.com",
          url: "http://labs.topheman.com"
        }
      },
      {
        received: {
          name: "Christophe Rosset <tophe@topheman.com>",
          url: "http://labs.topheman.com"
        },
        expected: {
          name: "Christophe Rosset",
          email: "tophe@topheman.com",
          url: "http://labs.topheman.com"
        }
      },
      {
        received: {
          name:
            "Christophe Rosset <tophe@topheman.com> (http://labs.topheman.com)",
          url: "http://github.com/topheman"
        },
        expected: {
          name: "Christophe Rosset",
          email: "tophe@topheman.com",
          url: "http://github.com/topheman"
        }
      },
      {
        received: {
          name: "Christophe Rosset <tophe@topheman.com>",
          email: "tophe@example.com"
        },
        expected: {
          name: "Christophe Rosset",
          email: "tophe@example.com"
        }
      },
      {
        received: {
          name: "Christophe Rosset",
          email: "tophe@topheman.com",
          url: "http://labs.topheman.com"
        },
        expected: {
          name: "Christophe Rosset",
          email: "tophe@topheman.com",
          url: "http://labs.topheman.com"
        }
      },
      {
        received: {},
        expected: undefined
      },
      {
        received: undefined,
        expected: undefined
      }
    ];
    inputExpectedOutputs.forEach(({ received, expected }) => {
      it(`sanitize input ${JSON.stringify(received)}`, () => {
        expect(extractPeopleInfos(received)).toEqual(expected);
      });
    });
  });
  describe("extractReadme", () => {
    it("should extract the default readme when no target version", () => {
      expect(extractReadme(packageJsonWithRootReadme)).toEqual(
        packageJsonWithRootReadme.readme
      );
    });
    it("should fallback on default readme when target version doesn't contain readme", () => {
      expect(extractReadme(packageJsonWithRootReadme, "0.1.0")).toEqual(
        packageJsonWithRootReadme.readme
      );
    });
    it("should extract readme from correct version", () => {
      expect(
        extractReadme(packageJsonWithInnerReadme, "16.3.0-alpha.1")
      ).toEqual(packageJsonWithInnerReadme.versions["16.3.0-alpha.1"].readme);
    });
    it("should fallback on latest version if no match", () => {
      expect(extractReadme(packageJsonWithInnerReadme, "16.2.0")).toEqual(
        packageJsonWithInnerReadme.versions["16.3.0-alpha.1"].readme
      );
    });
    it("should fallback on latest version when no version provided", () => {
      expect(extractReadme(packageJsonWithInnerReadme)).toEqual(
        packageJsonWithInnerReadme.versions["16.3.0-alpha.2"].readme
      );
    });
  });
  describe("extractMaintainers", () => {
    it("should extract the default maintainers when no target version", () => {
      expect(extractMaintainers(packageJsonWithInnerReadme)).toEqual(
        packageJsonWithInnerReadme.maintainers.map(extractPeopleInfos)
      );
    });
    it("should extract maintainers from correct version", () => {
      expect(extractMaintainers(packageJsonWithInnerReadme, "0.14.5")).toEqual(
        packageJsonWithInnerReadme.versions["0.14.5"].maintainers.map(
          extractPeopleInfos
        )
      );
    });
    it("should fallback on latest version when no version provided", () => {
      expect(extractMaintainers(packageJsonWithInnerReadme)).toEqual(
        packageJsonWithInnerReadme.versions["16.3.0-alpha.2"].maintainers.map(
          extractPeopleInfos
        )
      );
    });
  });
});
