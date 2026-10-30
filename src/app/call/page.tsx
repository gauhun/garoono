import type { Metadata } from "next";
import CallBooking from "../../components/CallBooking";

export const metadata: Metadata = {
  title: "Book a call · Gautam | 30 minutes, ₹399",
  description: "Book a 30 minute call with Gautam about your app, launch, store listing or anything else. Tue, Thu, Sat, Sun 2 to 10 PM, Mon, Wed, Fri 8 to 10:30 PM IST.",
  alternates: { canonical: "/call/" },
  // Page-level openGraph replaces the layout's whole block, so it repeats siteName and type
  openGraph: {
    title: "Book a 1:1 call with Gautam | ₹399, 30 min",
    description: "30 minutes on Google Meet about your idea, launch, store listing or anything stuck",
    url: "https://garoono.in/call/",
    siteName: "Garoono",
    type: "website",
    images: [{ url: "/og-call.jpg", width: 1200, height: 630, alt: "Book a 30 minute call with Gautam for ₹399" }],
  },
  twitter: { card: "summary_large_image", site: "@xgaroono", title: "Book a 1:1 call with Gautam | ₹399, 30 min", description: "30 minutes on Google Meet about your idea, launch, store listing or anything stuck", images: ["/og-call.jpg"] },
};

export default function CallPage() {
  return <CallBooking />;
}
