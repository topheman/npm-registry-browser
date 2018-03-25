/**
 * Returns an array of length of factor of 7 (like the 7 days of the weeks).
 * Removing the first item if necessary.
 *
 * @param {Array} downloads
 * @return {Array}
 */
export const removeLeadingDays = downloads =>
  downloads.slice(downloads.length % 7); // we want weeks -> remove leading days

/**
 * Takes the downloads array from the npm api /downloads/range/last-month/packageName
 * Returns an array of 52 entries with info per week object like: {from, to, downloads}
 *
 * @param {Array} downloads
 * @return {Array}
 */
export const yearDownloadsToWeaks = downloads =>
  removeLeadingDays(downloads).reduce((acc, cur, index) => {
    // we will only create a new entry in the accumulator each 7 loop
    const indexStep7 = (index - index % 7) / 7;
    // init accumulator
    acc[indexStep7] = acc[indexStep7] || { value: 0 };
    // add from value every 7 loops
    if (index % 7 === 0) {
      acc[indexStep7].from = cur.day;
    }
    // add to value every 7 loops, just befor the to
    if (index % 7 === 6) {
      acc[indexStep7].to = cur.day;
    }
    // update the value of the accumulator
    acc[indexStep7].value += cur.downloads;
    // return the accumulator!
    return acc;
  }, []);
