module.exports = {
  async headers() {
    return [
      {
        source: '/_next/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  },
  // Coba taruh di luar experimental juga
  allowedDevOrigins: ['192.168.18.17'],
  experimental: {
    allowedDevOrigins: ['192.168.18.17'],
  },
}