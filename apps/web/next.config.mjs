/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/%5Bobject%20Object%5D',
        destination: '/',
        permanent: false,
      },
      {
        source: '/:path*%5Bobject%20Object%5D:rest*',
        destination: '/',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
