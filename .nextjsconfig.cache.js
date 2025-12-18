// This file helps Next.js cache configuration
// Delete .next folder if you modify this

module.exports = {
  // Enable persistent caching
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
}

