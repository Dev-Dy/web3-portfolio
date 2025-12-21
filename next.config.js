/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Performance optimizations
  compress: true, // Enable compression for all environments
  poweredByHeader: false, // Remove X-Powered-By header
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Production source maps (for debugging in production)
  productionBrowserSourceMaps: false, // Set to true if you need production debugging
  
  // Disable experimental features in dev for faster compilation
  experimental: {
    // optimizeCss requires critters package - disabled to avoid build errors
    // optimizeCss: process.env.NODE_ENV === 'production',
  },
  
  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
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

    // Optimize bundle splitting for both dev and production
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          // Separate framer-motion (heavy animation library)
          framerMotion: {
            name: 'framer-motion',
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            priority: 30,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Separate Solana libraries
          solana: {
            name: 'solana',
            test: /[\\/]node_modules[\\/]@solana[\\/]/,
            priority: 20,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Separate wallet adapters
          walletAdapter: {
            name: 'wallet-adapter',
            test: /[\\/]node_modules[\\/]@solana[\\/]wallet-adapter[\\/]/,
            priority: 15,
            reuseExistingChunk: true,
            enforce: true,
          },
          // React and React DOM
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 25,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Common vendor chunk (smaller libraries)
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      },
    }
    
    if (dev) {
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

