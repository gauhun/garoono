// Branded cover drawn in SVG from the title, so every post gets one without image tools
const TINTS = ["#FFE8DC", "#E9F9EE", "#EAF0FF", "#FDEBF3", "#FFF8DB", "#F4EEFF"];

function wrap(title: string, max = 24, maxLines = 4) {
  const lines: string[] = [];
  let current = "";
  for (const word of title.split(/\s+/)) {
    if (current && `${current} ${word}`.length > max) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines.length > maxLines ? [...lines.slice(0, maxLines - 1), `${lines.slice(maxLines - 1).join(" ").slice(0, max - 1)}…`] : lines;
}

function hash(text: string) {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

export default function BlogCover({ slug, title, className }: { slug: string; title: string; className?: string }) {
  const lines = wrap(title);
  const tint = TINTS[hash(slug) % TINTS.length];
  const top = 315 - (lines.length * 78) / 2 + 58;

  return (
    <svg viewBox="0 0 1200 630" className={className} role="img" aria-label={title} preserveAspectRatio="xMidYMid slice">
      <rect width="1200" height="630" fill="#F8F6F1" />
      <circle cx="1080" cy="110" r="260" fill={tint} />
      <circle cx="140" cy="600" r="180" fill={tint} opacity="0.6" />
      <rect x="80" y="80" width="64" height="8" rx="4" fill="#FF6B35" />
      <text x="80" y="136" fontFamily="'JetBrains Mono', monospace" fontSize="26" letterSpacing="4" fill="#999999">
        GAROONO · BLOG
      </text>
      {lines.map((line, i) => (
        <text key={i} x="80" y={top + i * 78} fontFamily="'Instrument Serif', Georgia, serif" fontSize="72" fill="#1A1A1A">
          {line}
        </text>
      ))}
      <text x="80" y="570" fontFamily="Inter, sans-serif" fontSize="26" fontWeight="600" fill="#555555">
        garoono.in
      </text>
    </svg>
  );
}
