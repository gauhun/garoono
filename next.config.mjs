/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
        loader: 'custom',
        loaderFile: './src/utils/imageLoader.ts',
    },
    trailingSlash: true,
    assetPrefix: process.env.NODE_ENV === 'production' ? 'https://garoono.in' : '',
    basePath: '',
};

export default nextConfig; 