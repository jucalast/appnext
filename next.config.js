module.exports = {
  // ...existing code...
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://generativelanguage.googleapis.com/:path*', // URL da API Gemini
      },
    ];
  },
};

console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("GEMINI_API_KEY:", process.env.NEXT_PUBLIC_GEMINI_API_KEY);
