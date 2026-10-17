import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Garoono | Indie Apps by Gautam Singh Rathor",
  description:
    "Gautam builds apps after his 9 to 5. PushPass, XLSheetAI, JapMala, GetUp and DressMirror, used by 100,000+ people, plus free guides on shipping apps",
  keywords: [
    "garoono",
    "Gautam Singh Rathor",
    "indie app maker",
    "flutter app developer",
    "PushPass",
    "XLSheetAI",
    "JapMala",
    "GetUp",
    "DressMirror",
  ],
  // Every other route sets its own canonical; this one covers the homepage (a client component, so it can't export metadata)
  alternates: { canonical: "/" },
  authors: [{ name: "Gautam Singh Rathor", url: "https://garoono.in" }],
  metadataBase: new URL("https://garoono.in"),
  openGraph: {
    title: "Garoono | Indie Apps by Gautam Singh Rathor",
    description: "14+ apps shipped, we build apps for you, building in public",
    url: "https://garoono.in",
    siteName: "Garoono",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Garoono: apps Gautam builds after his 9 to 5, 14 apps and 100,000+ users",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@xgaroono",
    title: "Garoono | Indie Apps by Gautam Singh Rathor",
    description: "14+ apps shipped, we build apps for you, building in public",
    images: ["/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/logos/garoono-latest-logo.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/logos/garoono-latest-logo.jpg", sizes: "16x16", type: "image/jpeg" },
    ],
    shortcut: "/logos/garoono-latest-logo.jpg",
    apple: "/logos/garoono-latest-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Gautam Singh Rathor",
              url: "https://garoono.in",
              jobTitle: "Indie App Maker",
              worksFor: { "@type": "Organization", name: "Capgemini" },
              sameAs: [
                "https://twitter.com/xgaroono",
                "https://www.linkedin.com/in/gauhun/",
                "https://github.com/gauhun",
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
