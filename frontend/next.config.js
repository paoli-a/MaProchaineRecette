const target = process.env.NEXT_PUBLIC_PROXY_HOST || "http://localhost:8000";

module.exports = {
  async rewrites() {
    // Redirects only client side calls to the correct backend address
    // for server side calls it needs to be done where the calls are.
    // (behavior to be checked regularly as next.js evolves)
    return [
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*/`,
      },
    ];
  },
};
