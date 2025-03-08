import { NextConfig } from "next"

const nextConfig: NextConfig = {
    webpack: config => {
        config.resolve.fallback = {
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
        }
        return config
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ik.imagekit.io",
                port: "",
            },
        ],
    },
}

export default nextConfig
