const { createProxyMiddleware } = require("http-proxy-middleware");
const pkg = require("../package.json");
const target = process.env.REACT_APP_PROXY_HOST || "http://localhost:8000";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
    })
  );
};
