/**
 * Use:
 *
 * async function() {
 *   console.log('Something');
 *   await timeout(500);
 *   console.log('I waited 500ms !');
 * }
 *
 * @param {Number} ms
 * @return {Promise}
 */
export const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
