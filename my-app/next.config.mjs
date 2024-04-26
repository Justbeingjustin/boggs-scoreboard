/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        outputFileTracingIncludes: {
            "/api/createScoreboard": ["./assets/**"] // i put my font files in a folder called assets in root
        }
    }
};

export default nextConfig;