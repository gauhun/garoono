/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: process.env.NODE_ENV === 'production' ? '/portfolio' : '',
    images: {
        unoptimized: true,
        loader: 'custom',
        loaderFile: './src/utils/imageLoader.ts',
    },
    assetPrefix: process.env.NODE_ENV === 'production' ? '/portfolio/' : '',
    trailingSlash: true,
    distDir: 'out',
    webpack: (config) => {
        config.resolve.fallback = { fs: false };
        return config;
    },
};

export default nextConfig; 