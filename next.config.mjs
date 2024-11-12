/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
<<<<<<< HEAD
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
=======
    basePath: process.env.NODE_ENV === 'production' ? '/portfolio' : '',
    images: {
        unoptimized: true,
    },
    assetPrefix: process.env.NODE_ENV === 'production' ? '/portfolio/' : '',
    trailingSlash: true,
>>>>>>> 26bea40 (changes)
};

export default nextConfig; 