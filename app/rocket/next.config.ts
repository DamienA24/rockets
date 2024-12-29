import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/static/**",
      },
    ],
    loader: "custom",
    loaderFile: "./utils/image-loader.ts",
  },
};

export default nextConfig;
