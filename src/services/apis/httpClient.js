import axios from "axios";
import axiosRetry from "axios-retry";

const fibonacci = num => {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
};

/**
 * If starts === 4, will return:
 * 1) 500
 * 2) 800
 * 3) 1300
 * ... see fibonnacci sequence
 *
 * @param {Number} starts You can adjust this number from where you want to start
 * @return {Function} To be passed to retryDelay
 */
const fibonacciRetryDelay = (starts = 4) => (retryNumber = 0) => {
  const delay = fibonacci(retryNumber + starts) * 100;
  const randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay
  return delay + randomSum;
};

/**
 * Returns an axios client
 *
 * @param {Object} [options] The config passed to axios.create()
 * @param @optional {Number} [options.retries] pass 0 if you don't wan't retries
 * @param @optional {Number} [options.retryDelay]
 */
export const makeClient = ({
  retries = 3,
  retryDelay = fibonacciRetryDelay(),
  ...axiosConfig
}) => {
  const client = axios.create(axiosConfig);
  /*
   * If the network or the api server fails a request, the client will
   * retry 3 times until the request goes through
   * Only applied to idempotent requests:
   * - method GET/HEAD/OPTIONS/PUT/DELETE
   * - 5xx server error
   * - network errors
   */
  if (retries) {
    axiosRetry(client, { retries, retryDelay });
  }
  return client;
};
