/**
 * Extracts the url from a "homepage" field containing either a string
 * or an object like : {url}
 * @param {String | Object | undefined} homepage
 * @return {String | undefined}
 */
export const extractHomePageInfos = homepage =>
  (homepage && homepage.url) ||
  (homepage && typeof homepage === "string" && homepage);

/**
 * Extract infos from the repositry field (github ones)
 * @param {String | Object | undefined} repository
 * @return {String | undefined}
 */
export const extractRepositoryInfos = repository => {
  let url = extractHomePageInfos(repository);
  url =
    url &&
    url
      .replace(/^(git\+http[s]?|http[s]?\+git|git|http[s]?)/g, "https") // sanitize schema
      .replace(/\.git$/, "")
      .replace(/\/$/, ""); // sanitize trailing slash
  if (url) {
    const isGithub = /https:\/\/github.com/.test(url);
    const isGitlab = /https:\/\/gitlab.com/.test(url);
    const result = {
      url,
      displayUrl: url.replace(/^https:\/\//, ""),
      issuesUrl: ((isGithub || isGitlab) && `${url}/issues`) || undefined,
      pullsUrl:
        (isGithub && `${url}/pulls`) ||
        (isGitlab && `${url}/merge_requests`) ||
        undefined,
      repoType: (isGithub && "github") || (isGitlab && "gitlab")
    };
    return result;
  }
  return undefined;
};
