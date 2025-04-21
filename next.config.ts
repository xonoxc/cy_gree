import { NextConfig } from "next"

const nextConfig: NextConfig = {
	devIndicators: false,
	experimental: {
		reactCompiler: true,
	},
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	webpack: config => {
		config.resolve.fallback = {
			crypto: require.resolve("crypto-browserify"),
			stream: require.resolve("stream-browserify"),
			https: require.resolve("https-browserify"),
			http: require.resolve("http-browserify"),
			querystring: require.resolve("querystring-browser"),
			vm: require.resolve("vm-browserify"),
		}
		return config
	},
	images: {
		unoptimized: true,
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
