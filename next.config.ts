import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
<<<<<<< HEAD
  allowedDevOrigins: [
    "https://postwar-daybreak-theology.ngrok-free.dev",
    "http://esatets.test"
  ],
=======
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
>>>>>>> 8a7656b51bbfd3b2e14c9060d491551422e3bbe6
};

export default nextConfig;
