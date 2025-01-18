/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: process.env.NODE_ENV === 'production' ? '/garoono' : '',
    images: {
        unoptimized: true,
        loader: 'custom',
        loaderFile: './src/utils/imageLoader.ts',
    },
    assetPrefix: process.env.NODE_ENV === 'production' ? '/garoono' : '',
    trailingSlash: true,
    distDir: 'out',
    // Add this to ensure proper static file serving
    webpack: (config) => {
        config.resolve.fallback = { fs: false };
        return config;
    },
};

export default nextConfig; 