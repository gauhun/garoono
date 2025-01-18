export default function imageLoader({ src }: { src: string }): string {
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    return `/${cleanSrc}`;
} 