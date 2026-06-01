import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins:[
    "https://postwar-daybreak-theology.ngrok-free.dev"
  ],   
async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false, // 307 redirect
      },
    ];
  },
};

export default nextConfig;
