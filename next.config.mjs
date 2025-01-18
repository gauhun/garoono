/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '',
    images: {
        unoptimized: true,
        loader: 'custom',
        loaderFile: './src/utils/imageLoader.ts',
    },
    assetPrefix: '',
    trailingSlash: true,
    distDir: 'out',
    webpack: (config) => {
        config.resolve.fallback = { fs: false };
        return config;
    },
};

export default nextConfig; 