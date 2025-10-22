import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // hoặc dùng proxy như mình đã hướng dẫn
});
