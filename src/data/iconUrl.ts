// 264px WebP copy of a logo made by `npm run web-images`; `icon` stays the full-size original.
// Kept apart from products.ts so client components don't bundle the whole app list.
export const iconUrl = (p: { icon: string }) => p.icon.replace(/^\/logos\/(.+)\.\w+$/, "/logos/web/$1.webp");
