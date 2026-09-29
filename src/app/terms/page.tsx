import type { Metadata } from "next";
import LegalPage from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service · Garoono",
  description: "The terms for using garoono.in and buying lifetime access to docs.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="29 Sept 2026">
      <p>
        These terms cover garoono.in, run by Gautam Singh Rathor (&quot;Garoono&quot;, &quot;I&quot;). By using the site or
        buying access, you agree to them.
      </p>

      <h2>Docs</h2>
      <p>
        Some docs are free. The rest need lifetime access. The docs share what I have learned building apps. They are not
        legal, financial or security advice, and results depend on your situation.
      </p>

      <h2>Lifetime access</h2>
      <ul>
        <li>A one-time payment unlocks every paid doc on garoono.in, including docs published later.</li>
        <li>&quot;Lifetime&quot; means for as long as garoono.in offers docs. If the site ever shuts down, I will give at least 30 days&apos; notice so you can download what you bought.</li>
        <li>Access is personal and tied to the Google account you sign in with.</li>
      </ul>

      <h2>Payments</h2>
      <p>
        Payments are processed by Dodo Payments, who act as the merchant of record and handle taxes and invoices. Prices are
        shown before you pay.
      </p>

      <h2>Refunds</h2>
      <p>
        If the docs are not useful to you, email <a href="mailto:garoonotech@gmail.com">garoonotech@gmail.com</a> within 7 days
        of buying for a full refund. Access ends when the refund goes through.
      </p>

      <h2>What you can do with the docs</h2>
      <ul>
        <li>Read, download and use them for your own work and projects</li>
        <li>Quote short parts with a link back to garoono.in</li>
      </ul>
      <p>
        Please do not resell, re-upload or share the paid docs or your download links. Access used this way may be removed
        without a refund.
      </p>

      <h2>Your account</h2>
      <p>
        Keep your Google account secure. If you think someone else is using your access, email me and I will help.
      </p>

      <h2>Liability</h2>
      <p>
        The site and docs are provided as they are. To the extent the law allows, my total liability for any claim is limited
        to the amount you paid.
      </p>

      <h2>Changes</h2>
      <p>If these terms change, the date at the top changes too. Continuing to use the site means you accept the update.</p>

      <h2>Law</h2>
      <p>These terms are governed by the laws of India, with courts in Delhi having jurisdiction.</p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:garoonotech@gmail.com">garoonotech@gmail.com</a>
      </p>
    </LegalPage>
  );
}
