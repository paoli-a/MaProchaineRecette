const target = process.env.REACT_APP_PROXY_HOST || "http://localhost:8000";

module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*`,
      },
    ];
  },
};
