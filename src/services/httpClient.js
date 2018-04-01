import axios from "axios";

export const makeClient = axiosConfig => axios.create(axiosConfig);
