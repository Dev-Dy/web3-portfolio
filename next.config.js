/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Performance optimizations (only for production)
  swcMinify: true,
  compress: process.env.NODE_ENV === 'production',
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Disable experimental features in dev for faster compilation
  experimental: {
    // optimizeCss requires critters package - disabled to avoid build errors
    // optimizeCss: process.env.NODE_ENV === 'production',
  },
  
  // Faster TypeScript checking in dev
  typescript: {
    // Don't type check during build in dev (faster)
    ignoreBuildErrors: false,
  },
  
  // Faster ESLint in dev
  eslint: {
    // Don't run ESLint during build in dev
    ignoreDuringBuilds: false,
  },
  
  webpack: (config, { isServer, dev }) => {
    // Fallbacks for Node.js modules in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    }

    // Optimize bundle size - externalize heavy dependencies for server
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      })
    }

    // Only apply complex optimizations in production
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Separate Solana libraries
            solana: {
              name: 'solana',
              test: /[\\/]node_modules[\\/]@solana[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Separate wallet adapters
            walletAdapter: {
              name: 'wallet-adapter',
              test: /[\\/]node_modules[\\/]@solana[\\/]wallet-adapter[\\/]/,
              priority: 15,
              reuseExistingChunk: true,
            },
            // Common vendor chunk
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      }
    } else {
      // Faster dev builds - simpler optimization
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false, // Disable code splitting in dev for faster compilation
      }
      
      // Better error handling for chunk loading in dev
      config.output = {
        ...config.output,
        chunkLoadTimeout: 20000,
      }
    }

    // Faster module resolution in dev
    if (dev) {
      config.resolve.symlinks = false
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      }
    }

    return config
  },
}

module.exports = nextConfig

