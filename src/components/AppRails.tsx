import { products, type Product } from "../data/products";

// TrustMRR-style promo for my apps around blog pages:
// vertical scrolling card columns on wide screens, horizontal chip bars top and bottom on small ones

const half = Math.ceil(products.length / 2);
const leftApps = products.slice(0, half);
const rightApps = products.slice(half);

// Soft tint from each app's accent colour
const tint = (hex: string) => `${hex}1F`;

function AppCard({ app, hidden }: { app: Product; hidden?: boolean }) {
  return (
    <a
      href={app.link}
      target={app.link.startsWith("/") ? undefined : "_blank"}
      rel={app.link.startsWith("/") ? undefined : "noopener noreferrer"}
      className="app-rail-card"
      style={{ background: tint(app.color) }}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={app.icon} alt="" width={40} height={40} loading="lazy" />
      <strong>{app.name}</strong>
      <span>{app.description.replace(/\s*[\u2013\u2014]\s*/g, ", ").replace(/\.$/, "")}</span>
    </a>
  );
}

function AppChip({ app, hidden }: { app: Product; hidden?: boolean }) {
  return (
    <a
      href={app.link}
      target={app.link.startsWith("/") ? undefined : "_blank"}
      rel={app.link.startsWith("/") ? undefined : "noopener noreferrer"}
      className="app-bar-chip"
      style={{ background: tint(app.color) }}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={app.icon} alt="" width={22} height={22} loading="lazy" />
      {app.name}
    </a>
  );
}

// Two copies of each list so the -50% loop is seamless
function Column({ apps, reverse, side }: { apps: Product[]; reverse?: boolean; side: "left" | "right" }) {
  return (
    <aside className={`app-rail app-rail-${side}`} aria-label="Apps by Gautam">
      <div className={`app-rail-track ${reverse ? "is-reverse" : ""}`}>
        {[0, 1].map((copy) => apps.map((app) => <AppCard key={`${copy}-${app.id}`} app={app} hidden={copy === 1} />))}
      </div>
    </aside>
  );
}

function Bar({ apps, reverse, position }: { apps: Product[]; reverse?: boolean; position: "top" | "bottom" }) {
  return (
    <div className={`app-bar app-bar-${position}`} aria-label="Apps by Gautam">
      <div className={`app-bar-track ${reverse ? "is-reverse" : ""}`}>
        {[0, 1].map((copy) => apps.map((app) => <AppChip key={`${copy}-${app.id}`} app={app} hidden={copy === 1} />))}
      </div>
    </div>
  );
}

// `wide` pages (the blog list) need more room before the side columns fit.
// `barsOnly` keeps the top and bottom chip bars at every width, for pages whose sides are taken (docs)
export default function AppRails({ wide = false, barsOnly = false }: { wide?: boolean; barsOnly?: boolean }) {
  return (
    <div className={`app-rails ${wide ? "is-wide" : ""} ${barsOnly ? "bars-only" : ""}`}>
      {!barsOnly && <Column apps={leftApps} side="left" />}
      {!barsOnly && <Column apps={rightApps} side="right" reverse />}
      <Bar apps={leftApps} position="top" />
      <Bar apps={rightApps} position="bottom" reverse />
    </div>
  );
}
