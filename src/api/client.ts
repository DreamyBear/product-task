import axios from "axios";

export const api = axios.create({
  baseURL: "https://book.mmtsal.com/api",
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
