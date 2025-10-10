import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// simple token store (you could switch to context or zustand later)
let token: string | null = localStorage.getItem("token");

export function setToken(t: string | null) {
  token = t;
  if (t) localStorage.setItem("token", t);
  else localStorage.removeItem("token");
}

api.interceptors.request.use((config) => {
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
