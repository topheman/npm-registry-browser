export const safeExtractVersion = (packageInfos, targetVersion) =>
  (packageInfos &&
    packageInfos.versions &&
    packageInfos.versions[targetVersion]) ||
  {};

const strictExtractVersion = (packageInfos, targetVersion) =>
  (packageInfos &&
    packageInfos.versions &&
    packageInfos.versions[targetVersion]) ||
  undefined;

/**
 * Extracts the url from a "homepage" -like field containing either a string
 * or an object like : {url}
 * @param {String | Object | undefined} homepage
 * @return {String | undefined}
 */
export const extractUrl = urlField =>
  (urlField && urlField.url) ||
  (urlField && typeof urlField === "string" && urlField) ||
  undefined;

/**
 * Extract infos from the repositry field (github ones)
 * @param {String | Object | undefined} repository
 * @return {Object | undefined}
 */
export const extractRepositoryInfos = repository => {
  let url = extractUrl(repository);
  url =
    url &&
    url
      .replace(/^(git\+http[s]?|http[s]?\+git|git|http[s]?)/g, "https") // sanitize schema
      .replace(/\.git$/, "")
      .replace(/\/$/, ""); // sanitize trailing slash
  if (url) {
    const isGithub = /https:\/\/github.com/.test(url);
    const isGitlab = /https:\/\/gitlab.com/.test(url);
    const [, , , user, repo] = ((isGithub || isGitlab) && url.split("/")) || [];
    const result = {
      url,
      displayUrl: url.replace(/^https:\/\//, ""),
      issuesUrl: ((isGithub || isGitlab) && `${url}/issues`) || undefined,
      user,
      repo,
      pullsUrl:
        (isGithub && `${url}/pulls`) ||
        (isGitlab && `${url}/merge_requests`) ||
        undefined,
      repoType: (isGithub && "github") || (isGitlab && "gitlab") || undefined,
      isGithub,
      isGitlab
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
  if (people && typeof people === "object") {
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

/**
 * Extract readme from package.json infos
 *
 * @param {Object} packageInfos from registry.npmjs.org
 * @param {String | undefined} targetVersion
 * @return {String | undefined}
 */
export const extractReadme = (packageInfos, targetVersion) => {
  if (packageInfos && typeof packageInfos === "object") {
    // if a targetVersion is specified, try to retrieve it first
    if (safeExtractVersion(packageInfos, targetVersion).readme) {
      return packageInfos.versions[targetVersion].readme;
    }
    // fallback on general readme
    if (packageInfos.readme) {
      return packageInfos.readme;
    }
    // fallback on the latest readme published
    const result =
      Object.values(packageInfos.versions)
        .reverse()
        .reduce((acc, packageInfo) => {
          if (!acc && packageInfo.readme) {
            return packageInfo.readme;
          }
          return acc;
        }, "") || undefined;
    return result;
  }
  return undefined;
};

/**
 * Extract maintainers from package.json infos
 *
 * @param {Object} packageInfos from registry.npmjs.org
 * @param {String | undefined} targetVersion
 * @return {Array[Object]}
 */
export const extractMaintainers = (packageInfos, targetVersion) => {
  if (packageInfos && typeof packageInfos === "object") {
    // if a targetVersion is specified, try to retrieve it first
    if (safeExtractVersion(packageInfos, targetVersion).maintainers) {
      return packageInfos.versions[targetVersion].maintainers.map(
        extractPeopleInfos
      );
    }
    // fallback on general maitainers
    if (packageInfos.maintainers) {
      return packageInfos.maintainers.map(extractPeopleInfos);
    }
    // fallback on the latest maintainers published
    const result = Object.values(packageInfos.versions)
      .reverse()
      .reduce((acc, packageInfo) => {
        if (acc.length === 0 && packageInfo.maintainers) {
          return packageInfo.maintainers;
        }
        return acc;
      }, []);
    return result;
  }
  // return empty array anyway
  return [];
};

/**
 * @todo review following code + write tests
 * @param {*} license
 */
export const extractLicenseInfos = (packageInfo, targetVersion) => {
  const version = strictExtractVersion(packageInfo, targetVersion);
  const license =
    (version && version.license) ||
    (version && Array.isArray(version.licenses) && version.licenses[0]);
  if (!license) {
    return undefined;
  }
  if (typeof license === "object") {
    return {
      licenseId: license.name
    };
  }
  return {
    licenseId: license
  };
};
