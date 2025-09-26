// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // allow images from Facebook CDNs (any region), plus a few common sources
    remotePatterns: [
      { protocol: 'https', hostname: '**.fbcdn.net' },       // scontent.*.fbcdn.net variants
      { protocol: 'https', hostname: '**.facebook.com' },    // if any direct facebook image links
      // optional extras you might use:
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
