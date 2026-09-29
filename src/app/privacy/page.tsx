import type { Metadata } from "next";
import LegalPage from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy · Garoono",
  description: "What garoono.in collects, why, and how to get it deleted.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="30 Sept 2026">
      <p>
        garoono.in is run by Gautam Singh Rathor (&quot;Garoono&quot;, &quot;I&quot;). This page explains what the site
        collects when you read, download or buy docs, and what I do with it. I keep it to the minimum the site needs to work.
      </p>

      <h2>What I collect</h2>
      <ul>
        <li>
          <strong>Google sign-in.</strong> If you sign in, Google shares your name, email address and profile photo with the
          site. I use your email to match you to your purchase. Your name and photo are only shown back to you on the page,
          unless you choose to join the Pro wall.
        </li>
        <li>
          <strong>Pro wall (optional).</strong> If you tap &quot;Show my photo and first name on the Pro wall&quot;, your
          first name and Google profile photo are shown publicly on the docs page. You can remove yourself at any time with
          one tap, and refunds remove you automatically.
        </li>
        <li>
          <strong>Purchases.</strong> Payments are handled by Dodo Payments, the merchant of record. I receive your email, the
          payment ID, the amount and the payment status. I never see or store your card, UPI or bank details.
        </li>
        <li>
          <strong>Newsletter.</strong> If you subscribe, I store your email to send you updates. Every email has a way to
          unsubscribe.
        </li>
        <li>
          <strong>Doc counters.</strong> Views, downloads and likes are counted anonymously. Your browser remembers which docs
          you already counted or liked (local storage), so you are not counted twice. This is not linked to your identity.
        </li>
        <li>
          <strong>Visitor count.</strong> The home page shows how many browsers have visited. Each browser is counted once,
          anonymously, using a flag in local storage. No IP address or identity is stored.
        </li>
        <li>
          <strong>Ads and analytics.</strong> The home page uses Google AdSense, which may set cookies to show and measure ads.
          See Google&apos;s policy at{" "}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            policies.google.com/technologies/ads
          </a>
          .
        </li>
      </ul>

      <h2>Why</h2>
      <ul>
        <li>To give you access to the docs you paid for, on any device where you sign in</li>
        <li>To handle refunds and payment disputes</li>
        <li>To show which docs people find useful</li>
        <li>To send the newsletter you asked for</li>
      </ul>
      <p>I do not sell your data and I do not use it for advertising profiles.</p>

      <h2>Where it is stored</h2>
      <p>
        Account and purchase records are stored in Google Firebase (Google Cloud). Paid docs are served through short-lived
        private links. Payment data stays with Dodo Payments under their own privacy policy.
      </p>

      <h2>How long I keep it</h2>
      <p>
        Purchase records are kept for as long as you have access, and afterwards as long as tax and accounting law requires.
        Everything else is deleted when you ask.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete your data at any time. Deleting your account removes your access record. Write
        to <a href="mailto:garoonotech@gmail.com">garoonotech@gmail.com</a> from the email you signed in with and I will reply
        within 7 days. This applies under India&apos;s DPDP Act, the EU GDPR and similar laws.
      </p>

      <h2>Children</h2>
      <p>The site is meant for people aged 18 and over. I do not knowingly collect data from children.</p>

      <h2>Changes</h2>
      <p>If this policy changes, the date at the top changes too. Big changes will be announced on the site.</p>

      <h2>Contact</h2>
      <p>
        Gautam Singh Rathor, Delhi, India · <a href="mailto:garoonotech@gmail.com">garoonotech@gmail.com</a>
      </p>
    </LegalPage>
  );
}
