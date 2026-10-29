import type { Metadata } from "next";
import CallBooking from "../../components/CallBooking";

export const metadata: Metadata = {
  title: "Book a call · Gautam | 30 minutes, ₹199",
  description: "Book a 30 minute call with Gautam about your app, launch, store listing or anything else. Tue, Thu, Sat, Sun 2 to 10 PM, Mon, Wed, Fri 8 to 10:30 PM IST.",
  alternates: { canonical: "/call/" },
};

export default function CallPage() {
  return <CallBooking />;
}
