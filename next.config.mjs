/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    nodeEnv: process.env.NODE_ENV,
    geminiApiEnabled: !!process.env.GEMINI_API_KEY,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Optional: For larger API requests
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  // Enable if you need experimental features
  experimental: {
    // serverActions: true, // Uncomment if needed
  }
};

// ES modules export
export default nextConfig;