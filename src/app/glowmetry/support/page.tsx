import type { Metadata } from "next";
import LegalPage from "../../../components/LegalPage";

export const metadata: Metadata = {
  title: "Glowmetry Support · Garoono",
  description: "Support, FAQs, and contact information for Glowmetry: Looksmaxxing AI.",
  alternates: { canonical: "/glowmetry/support/" },
};

export default function GlowmetrySupportPage() {
  return (
    <LegalPage title="Glowmetry Support" updated="9 Nov 2026">
      <p>
        Need help with Glowmetry: Looksmaxxing AI? We are here to assist with questions about scans, results, subscriptions, or your privacy.
      </p>

      <h2 id="contact-support">Contact us</h2>

      <p>
        For direct support, bug reports, or questions, reach out via email:
      </p>

      <ul>
        <li><strong>Email:</strong> <a href="mailto:garoonotech@gmail.com">garoonotech@gmail.com</a></li>
        <li><strong>Developer:</strong> Gautam Singh Rathor (Garoono), Delhi, India</li>
        <li><strong>Response time:</strong> We typically respond within 24 to 48 hours.</li>
      </ul>

      <h2 id="frequently-asked-questions">Frequently Asked Questions</h2>

      <h3>1. How does Glowmetry work?</h3>
      <p>
        Glowmetry uses camera-guided scans to measure facial ratios (such as symmetry, eye spacing, and jawline definition) on your device using Google ML Kit. A detailed cosmetic assessment, skin analysis, morning/evening routine, hairstyle suggestions, and custom plan are generated using an advanced AI model.
      </p>

      <h3>2. Are my photos safe and private?</h3>
      <p>
        Yes. Your photos are processed securely in memory only to generate your report. We do not store your face photos on our servers, we never sell your data, and we do not use your photos to train AI models. Your scan history is saved locally on your phone.
      </p>

      <h3>3. How do I restore my Pro subscription?</h3>
      <p>
        If you changed devices or reinstalled the app:
      </p>
      <ol>
        <li>Open Glowmetry and go to the <strong>Profile</strong> tab.</li>
        <li>Tap <strong>Settings</strong> (top right gear icon).</li>
        <li>Scroll to the <strong>Subscription</strong> section and tap <strong>Restore purchases</strong>.</li>
      </ol>

      <h3>4. How do I cancel or manage my subscription?</h3>
      <p>
        Subscriptions are managed directly by Apple or Google:
      </p>
      <ul>
        <li><strong>On iPhone / iPad:</strong> Open your device Settings &gt; tap your name / Apple ID &gt; <strong>Subscriptions</strong> &gt; select Glowmetry &gt; tap <strong>Cancel Subscription</strong>.</li>
        <li><strong>On Android:</strong> Open the Google Play Store &gt; tap your profile icon &gt; <strong>Payments &amp; subscriptions</strong> &gt; <strong>Subscriptions</strong> &gt; select Glowmetry &gt; tap <strong>Cancel</strong>.</li>
      </ul>

      <h3>5. How do I request a refund?</h3>
      <p>
        Because purchases are processed directly by Apple or Google:
      </p>
      <ul>
        <li><strong>Apple (iOS):</strong> Visit <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer">reportaproblem.apple.com</a>, sign in with your Apple ID, and request a refund.</li>
        <li><strong>Google Play (Android):</strong> Visit Google Play&apos;s refund page at <a href="https://support.google.com/googleplay/workflow/9813244" target="_blank" rel="noopener noreferrer">support.google.com/googleplay</a>.</li>
      </ul>

      <h3>6. How do I delete my data or account?</h3>
      <p>
        You have complete control over your data:
      </p>
      <ul>
        <li>Open Glowmetry &gt; <strong>Profile</strong> &gt; <strong>Settings</strong>.</li>
        <li>Under <strong>Your data</strong>, tap <strong>Delete my data</strong> (or <strong>Delete account</strong> if signed in).</li>
        <li>This permanently wipes all scan records, cached analysis, and associated account records.</li>
      </ul>

      <h3>7. Is Glowmetry medical advice?</h3>
      <p>
        No. Glowmetry provides cosmetic coaching and grooming guidance only. Scores and recommendations are estimates and do not constitute medical or dermatological diagnosis. For any skin conditions, health concerns, or medical issues, please consult a qualified healthcare professional.
      </p>

      <h2 id="helpful-links">Helpful links</h2>

      <ul>
        <li><a href="https://garoono.in/glowmetry/privacy">Privacy Policy</a></li>
        <li><a href="https://garoono.in/glowmetry/terms">Terms of Use</a></li>
      </ul>
    </LegalPage>
  );
}
