import type {NextConfig} from 'next';
const nextConfig:NextConfig={
  transpilePackages:['@wm/renderer-webgl','@wm/governance','@wm/core','@wm/theme-iridescent'],
  experimental:{turbo:{rules:{'*.glsl':{loaders:['raw-loader'],as:'*.js'}}}},
};
export default nextConfig;
