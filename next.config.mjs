/** @type {import('next').NextConfig} */
const NGROK_URL = 'https://6d29-140-213-217-131.ngrok-free.app';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: NGROK_URL.replace('https://', ''),
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${NGROK_URL}/api/:path*`
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, ngrok-skip-browser-warning" },
        ]
      }
    ]
  }
};

export default nextConfig;
