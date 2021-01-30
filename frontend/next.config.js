const target = process.env.NEXT_PUBLIC_PROXY_HOST || "http://localhost:8000";

module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*/`,
      },
    ];
  },
};
