import type { Metadata } from "next";

// Bio link: straight to the Play listing. The referrer shows these installs as garoono / bio in Play Console
const PLAY = "https://play.google.com/store/apps/details?id=in.garoono.glowmetry&referrer=utm_source%3Dgaroono%26utm_medium%3Dbio";

export const metadata: Metadata = {
  title: "Glowmetry on Google Play",
  description: "Rate your face with AI and get a daily glow up plan. Get it on Google Play",
  robots: { index: false },
  // Own share image so the bio link previews the app, not the redirect
  openGraph: {
    title: "Glowmetry on Google Play",
    description: "Rate your face with AI and get a daily glow up plan",
    url: "/glowmetry/play/",
    images: [{ url: "/og-glowmetry-play.jpg", width: 1200, height: 630, alt: "Glowmetry app icon with a Get it on Google Play badge" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-glowmetry-play.jpg"] },
};

// Static hosting has no server redirects, so this page forwards with a script and a meta refresh fallback
export default function GlowmetryPlayRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${PLAY}`} />
      <script dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(PLAY)})` }} />
      <p style={{ padding: 24 }}>
        Opening <a href={PLAY}>Glowmetry on Google Play</a>
      </p>
    </>
  );
}
