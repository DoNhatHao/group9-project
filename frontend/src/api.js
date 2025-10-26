import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // Backend chạy ở port 3000
});
