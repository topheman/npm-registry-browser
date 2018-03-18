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

/**
 * Extracts infos from people fields in package.json
 * https://docs.npmjs.com/files/package.json#people-fields-author-contributors
 *
 * @param {Object | String | undefined} people
 * @return {Object | undefined}
 */
export const extractPeopleInfos = people => {
  const URL_REGEXP = /(\(.*)\)/;
  const EMAIL_REGEXP = /(<.*(?!<)>)/;
  if (typeof people === "string") {
    const url =
      (URL_REGEXP.test(people) &&
        people.match(URL_REGEXP)[1].replace(/\(|\)/g, "")) ||
      undefined;
    const email =
      (EMAIL_REGEXP.test(people) &&
        people.match(EMAIL_REGEXP)[1].replace(/<|>/g, "")) ||
      undefined;
    const name = people
      .replace(`(${url})`, "")
      .replace(`<${email}>`, "")
      .trim();
    return {
      name,
      email,
      url
    };
  }
  if (typeof people === "object") {
    const infos = extractPeopleInfos(people.name) || {};
    const result = {
      name: infos.name,
      email: people.email || infos.email || undefined,
      url: people.url || infos.url || undefined
    };
    if (infos.name || infos.email || infos.url) {
      return result;
    }
  }
  return undefined;
};
