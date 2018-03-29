import axios from "axios";

export const makeClient = axiosConfig => axios.create(axiosConfig);

export const makeMockedClient = (axiosConfig, targetApiKey) => {
  console.log(`[httpClient] Mocking ${targetApiKey}`);
};
