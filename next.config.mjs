/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/:id.jpg', destination: '/api/thumbnail/:id' },
      { source: '/:id.png', destination: '/api/thumbnail/:id' }
    ]
  }
}
export default nextConfig;
