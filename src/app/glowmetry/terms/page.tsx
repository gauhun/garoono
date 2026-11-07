import type { Metadata } from "next";
import LegalPage from "../../../components/LegalPage";

export const metadata: Metadata = {
  title: "Glowmetry Terms of Use · Garoono",
  description: "The terms for using the Glowmetry app and its Pro subscription.",
  alternates: { canonical: "/glowmetry/terms/" },
};

export default function GlowmetryTermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="7 Nov 2026">
      <p>
        These terms cover Glowmetry: Looksmaxxing AI (&quot;Glowmetry&quot;, &quot;the app&quot;), made by Gautam Singh Rathor, Delhi, India, trading as Garoono (&quot;Garoono&quot;, &quot;we&quot;). By using the app you agree to them. If you do not agree, please do not use the app.
      </p>

      <h2 id="who-can-use-glowmetry">Who can use Glowmetry</h2>

      <p>
        You must be 13 or older. If you are under the age of adulthood where you live, use the app only with a parent or guardian&apos;s OK. The app blocks anyone who says they are under 13.
      </p>

      <h2 id="what-glowmetry-is">What Glowmetry is</h2>

      <p>
        Glowmetry looks at your face photos and a few answers about you and gives scores, a skin report, a routine, hairstyle ideas and a plan. Part of it is measured on your phone and part is written by an AI model.
      </p>

      <ul>
        <li><strong>It is guidance, not medical advice.</strong> Glowmetry does not diagnose or treat anything. Talk to a doctor about any skin or health concern.</li>
        <li><strong>Scores are estimates.</strong> They come from an AI and a few measurements, can be wrong and can change with lighting, angle and camera. They are not a verdict on how attractive you are or what you are worth.</li>
        <li><strong>No promises.</strong> We cannot promise any result from following the plan or the chat replies.</li>
        <li>If a scan or a chat reply makes you feel low about how you look, or you think about harming yourself or have trouble with eating, please talk to someone you trust or a local helpline.</li>
      </ul>

      <h2 id="your-photos-and-content">Your photos and content</h2>

      <ul>
        <li>Upload only photos of yourself. Do not upload photos of other people, photos of children under 13, or anything illegal.</li>
        <li>You keep all rights to your photos. You give us a limited license to process them only to make your results, as described in the <a href="https://garoono.in/glowmetry/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
        <li>Before your first upload the app asks for your consent. You can withdraw it in Settings.</li>
        <li>The AI chat can make mistakes. Use the Report option on any reply that is wrong or harmful.</li>
      </ul>

      <h2 id="using-the-app-fairly">Using the app fairly</h2>

      <p>
        Please do not:
      </p>

      <ul>
        <li>break, reverse engineer or copy the app, or try to get around its limits, ads or paywall</li>
        <li>use bots, scripts or fake devices</li>
        <li>use the app to harass, impersonate or profile another person</li>
        <li>use results or chat replies to claim medical, legal or professional advice</li>
      </ul>

      <p>
        We may limit or block use that harms the app, other people or our costs.
      </p>

      <h2 id="free-use-and-ads">Free use and ads</h2>

      <p>
        Your first scan is free. After that, free scans need you to watch an optional rewarded ad, with a daily limit. The free report shows part of the results. Ads are shown through Google AdMob and never to Pro members.
      </p>

      <h2 id="glowmetry-pro">Glowmetry Pro</h2>

      <ul>
        <li><strong>What it is.</strong> Pro is an auto-renewing subscription, monthly or yearly. It gives the full report, the complete skin routine, hairstyles, the plan and the Glowmetry AI chat.</li>
        <li><strong>Price.</strong> The price is shown in your local currency in the app before you buy. Taxes may apply.</li>
        <li><strong>Payment and renewal.</strong> Payment is charged to your Apple ID or Google Play account when you confirm the purchase. The subscription renews automatically unless you cancel at least 24 hours before the end of the current period. Your account is charged for renewal within 24 hours before the period ends.</li>
        <li><strong>Cancel any time.</strong> On iPhone, open Settings, your name, Subscriptions. On Android, open Google Play, Payments and subscriptions, Subscriptions. You keep Pro until the end of the period you paid for. Deleting the app or your data does not cancel the subscription.</li>
        <li><strong>Refunds.</strong> Purchases are handled by Apple or Google, so refund requests go to them under their policies.</li>
        <li><strong>Limits.</strong> Pro includes a monthly scan allowance and a daily coach message allowance; when you reach one, the app tells you when it resets.</li>
        <li><strong>Creator codes.</strong> A creator code can give you a lower price. We can change or switch off a code at any time. One code applies per purchase.</li>
        <li><strong>Restore.</strong> Use Restore purchases in the app after moving to a new phone.</li>
        <li><strong>Apple.</strong> If you downloaded the app from the App Store, Apple&apos;s standard <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer">Licensed Application End User License Agreement</a> also applies to you. These terms are between you and Garoono only, not Apple.</li>
      </ul>

      <h2 id="our-rights">Our rights</h2>

      <p>
        The app, its design, text and code belong to Garoono. You may use the app for yourself for personal, non-commercial purposes. You may not copy or resell it.
      </p>

      <h2 id="availability-and-changes">Availability and changes</h2>

      <p>
        We run the app as a small team and may change, pause or stop features. The AI part may sometimes be unavailable or slow. We may update these terms. The date at the top changes when we do, and using the app after that means you accept the update.
      </p>

      <h2 id="liability">Liability</h2>

      <p>
        The app is provided as it is. To the extent the law allows, we are not responsible for decisions you make based on the app, and our total liability for any claim is limited to the amount you paid us in the 12 months before the claim. Nothing here limits rights you have under the law that cannot be waived.
      </p>

      <h2 id="law">Law</h2>

      <p>
        These terms are governed by the laws of India, with the courts in Delhi having jurisdiction. If you are a consumer, you also keep the rights you have under the laws of the country where you live.
      </p>

      <h2 id="contact">Contact</h2>

      <p>
        Gautam Singh Rathor (Garoono), Delhi, India. Email: <a href="mailto:garoonotech@gmail.com">garoonotech@gmail.com</a>
      </p>
    </LegalPage>
  );
}
