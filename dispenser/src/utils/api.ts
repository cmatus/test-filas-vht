import axios from "axios";

import { apiConfig } from "./config";

const apiInstance = axios.create({
  baseURL: `${apiConfig.server}`,
});

export { apiInstance };
