/**
 * Inspired by https://github.com/npm/marky-markdown/blob/master/lib/plugin/github.js
 */

/**
 * Returns true if is absolute url. Examples:
 * - about.html -> false
 * - tutorial1/ -> false
 * - / -> false
 * - ../ -> false
 * - http://google.com -> true
 * - www.google.com -> true
 * - //google.com -> true
 *
 * inspired by https://stackoverflow.com/questions/31430167/regex-check-if-given-string-is-relative-url#answer-31432012
 *
 * @param {String} url
 * @return {Boolean}
 */
const isAbsoluteUrl = url =>
  !new RegExp("^(?!www.|(?:http|ftp)s?://|[A-Za-z]:\\\\|//).*").test(url);

/**
 * Adds a trailing slash if missing
 *
 * @param {String} url
 * @return {String}
 */
const ensureTrailingSlash = url => (/\/$/.test(url) ? url : url + "/");

const removeLeadingSlash = url => url.replace(/^\//, "");

const DEFAULT_REF = "HEAD";

/**
 * Returns a link to https://raw.githubusercontent.com/
 * based on the repository infos and url passed
 *
 * Absolute url won't be affected
 *
 * @param {Object} [options] from extractRepositoryInfos
 * @param {String} [options.user]
 * @param {String} [options.repo]
 * @param {String} url
 * @return {String}
 */
export const buildImageUrl = ({ user, repo } = {}, url) => {
  if (isAbsoluteUrl(url)) {
    return url;
  }
  const prefix = "https://raw.githubusercontent.com/";
  return prefix + [user, repo, DEFAULT_REF, removeLeadingSlash(url)].join("/");
};

/**
 * Returns a link inside https://github.com/<user>/<repo>/
 * based on the repository infos and url passed
 *
 * Absolute url and anchors won't be affected
 *
 * @param {Object} [options] from extractRepositoryInfos
 * @param {String} [options.url]
 * @param {String} url
 * @return {String}
 */
export const buildLinkUrl = ({ url: repositoryUrl } = {}, url) => {
  if (isAbsoluteUrl(url)) {
    return url;
  }
  return (
    ensureTrailingSlash(repositoryUrl) +
    ["blob", DEFAULT_REF, removeLeadingSlash(url)].join("/")
  );
};
