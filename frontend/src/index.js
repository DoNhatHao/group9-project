import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";        // <-- phải trỏ tới ./App, KHÔNG phải ./Ứng dụng
import "./styles.css";          // nếu bạn có file styles

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
