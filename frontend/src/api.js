import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001", // đổi nếu backend của nhóm bạn chạy cổng khác
});
