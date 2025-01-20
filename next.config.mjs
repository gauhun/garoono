/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '',
    assetPrefix: '',
    images: {
        unoptimized: true,
        loader: 'custom',
        loaderFile: './src/utils/imageLoader.ts',
    },
    trailingSlash: true,
    distDir: 'out',
    // Add this to ensure proper static file serving
    webpack: (config) => {
        config.resolve.fallback = { fs: false };
        return config;
    },
};

export default nextConfig; 