import axios from "axios";

const apios = axios.create({
  baseURL: process.env.REACT_APP_API_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apios;
