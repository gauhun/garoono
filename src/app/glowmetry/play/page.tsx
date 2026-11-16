import type { Metadata } from "next";

// Bio link: straight to the Play listing. The referrer shows these installs as garoono / bio in Play Console
const PLAY = "https://play.google.com/store/apps/details?id=in.garoono.glowmetry&referrer=utm_source%3Dgaroono%26utm_medium%3Dbio";

export const metadata: Metadata = {
  title: "Glowmetry on Google Play",
  robots: { index: false },
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
