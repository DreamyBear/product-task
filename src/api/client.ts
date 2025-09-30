import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status || 0;
    const message =
      error?.response?.data?.message || error.message || "Request failed";
    return Promise.reject({ status, message, raw: error });
  }
);
