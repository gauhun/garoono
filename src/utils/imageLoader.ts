export default function imageLoader({ src }: { src: string }): string {
    const basePath = process.env.NODE_ENV === 'production' ? '/garoono' : '';
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    return `${basePath}/${cleanSrc}`;
} 