const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(
    ["/api", "/users"], // liệt kê path cần proxy
    createProxyMiddleware({
      target: "http://localhost:3000", // đúng cổng backend
      changeOrigin: true,
    })
  );
};
