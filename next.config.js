/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "avatars.githubusercontent.com",
                protocol: "https",
                pathname: "/u/**",
            }
        ]
    }
}

module.exports = nextConfig
