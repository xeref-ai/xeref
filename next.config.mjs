
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Force SWC to transpile undici
    config.module.rules.push({
      test: /node_modules\/undici\/.+\.js$/,
      use: {
        loader: 'next-swc-loader',
      },
    });

    // Fallback for missing modules
    config.resolve.fallback = {
      "mongodb-client-encryption": false,
      "aws4": false
    };

    return config;
  }
};

export default nextConfig;
