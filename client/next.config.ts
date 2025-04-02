import { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true, 
  },
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
  },
};

export default nextConfig;
