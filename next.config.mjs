/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // ImageLightbox requests quality 90; Next 16 warns for any value not listed.
    qualities: [75, 90],
  },
}

export default nextConfig
