export const displayUrl = url =>
  url.replace(/^http[s]?:\/\//, "").replace(/\/$/, "");

export const parseQueryString = (query = "") => {
  // remove leading "?" (from location.search)
  const sanitizedQuery = query.replace(/^\?/, "");
  return sanitizedQuery.split("&").reduce((acc, nameAndValue) => {
    const [name, value] = nameAndValue.split("=");
    if (typeof value !== "undefined") {
      acc[name] = decodeURIComponent(value);
    }
    return acc;
  }, {});
};
