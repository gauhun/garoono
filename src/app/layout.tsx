import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "App Dev Company",
  description: "5.5 yrs of experience in app development",
  icons: {
    icon: [
      {
        url: '/logos/circle_garoono_logo.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/logos/circle_garoono_logo.png',
        sizes: '16x16',
        type: 'image/png',
      }
    ],
    shortcut: '/logos/circle_garoono_logo.png',
    apple: '/logos/circle_garoono_logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
