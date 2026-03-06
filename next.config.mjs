import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: true,
  },
  // Limit parallel compilation
  webpack: (config, { dev }) => {
    if (!dev) {
      config.optimization.splitChunks.maxAsyncRequests = 30;
      config.optimization.splitChunks.maxInitialRequests = 30;
    }
    return config;
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/photos/**',
      },
      {
        pathname: '/api/equipment/photos/**',
      },
      {
        pathname: '/api/company/photos/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Accel-Buffering',
            value: 'no',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/sign-in',
        permanent: false,
      },
    ];
  },
  serverExternalPackages: ['pino', 'pino-pretty'],
};

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl(nextConfig);
