/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: { domains: ["apod.nasa.gov", "img.youtube.com"] },
  env: { NASA_API_KEY: process.env.NASA_API_KEY },
};
