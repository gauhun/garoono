import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gautam — Indie App Maker | XLSheet AI, Habitide, FocusOn",
  description:
    "Indie app maker from Delhi. Building apps that people actually use. 25,000+ users across XLSheet AI, Habitide, FocusOn, and more.",
  keywords: [
    "indie app maker",
    "flutter developer",
    "Gautam Singh Rathor",
    "garoono",
    "XLSheet AI",
    "Habitide",
    "FocusOn",
    "Delhi",
  ],
  authors: [{ name: "Gautam Singh Rathor", url: "https://garoono.in" }],
  metadataBase: new URL("https://garoono.in"),
  openGraph: {
    title: "Gautam — Indie App Maker",
    description: "Shipped 30+ apps. 4 make money. Building in public.",
    url: "https://garoono.in",
    siteName: "Garoono",
    type: "website",
    images: [
      {
        url: "/logos/garoono-latest-logo.jpg",
        width: 400,
        height: 400,
        alt: "Garoono",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@xgaroono",
    title: "Gautam — Indie App Maker",
    description: "Shipped 30+ apps. 4 make money. Building in public.",
    images: ["/logos/garoono-latest-logo.jpg"],
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
