import axios from "axios";
import { BASE_URL } from "./constant";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const setupAxiosInterceptors = (logoutCallback: () => void) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 419) {
        logoutCallback();
      }

      return Promise.reject(error);
    }
  );
};

export { axiosInstance, setupAxiosInterceptors };
