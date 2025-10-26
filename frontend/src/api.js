import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001", // Backend đang chạy ở port 3001
});
