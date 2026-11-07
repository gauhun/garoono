import type { Metadata } from "next";
import LegalPage from "../../../components/LegalPage";

export const metadata: Metadata = {
  title: "Glowmetry Privacy Policy · Garoono",
  description: "What the Glowmetry app collects, why, who gets it and how to delete it.",
  alternates: { canonical: "/glowmetry/privacy/" },
};

export default function GlowmetryPrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="7 Nov 2026">
      <p>
        Glowmetry: Looksmaxxing AI (&quot;Glowmetry&quot;, &quot;the app&quot;) is made by Gautam Singh Rathor, Delhi, India, trading as Garoono (&quot;Garoono&quot;, &quot;we&quot;). This page explains what the app collects, why, who gets it and how to delete it. We keep it to the minimum the app needs to work.
      </p>

      <h2 id="the-short-version">The short version</h2>

      <ul>
        <li>You do not need an account. The app uses an anonymous ID unless you choose to sign in with Apple or Google. We never ask for your phone number.</li>
        <li>Your scan history stays on your phone.</li>
        <li>Your photos are sent to an AI service only to make your results. We do not store them on our servers, and we ask the AI service not to keep them or train on them.</li>
        <li>We never sell your data and never use your face data for ads.</li>
        <li>You can delete everything in Settings, Delete my data (Delete account if you signed in).</li>
        <li>Glowmetry is for people aged 13 and over.</li>
      </ul>

      <h2 id="what-we-collect-and-why">What we collect and why</h2>

      <ul>
        <li><strong>Photos.</strong> The front photo and the optional side photo you scan or upload. They are resized on your phone, sent to our server and passed on to the AI service to make your results. The left and right photos from the guided scan are only used on your phone to check your angle and are never uploaded.</li>
        <li><strong>Face measurements.</strong> Numbers worked out on your phone from your front photo by Google ML Kit face detection, for example eye spacing, jaw width and symmetry ratios. They are sent together with the photo so the results use both the photo and the measurements.</li>
        <li><strong>About you.</strong> Gender, age, height, skin type and goals, as you answer them in the app. We send your age, not your birth date. These answers are stored on your phone and sent with each scan to tailor your results. An optional name stays on your phone.</li>
        <li><strong>Chat messages (Pro).</strong> When you use Glowmetry AI, your recent messages and a short summary of your profile and latest scan are sent to the same AI service to write the reply. We do not store chat text on our servers. The last 30 messages are kept on your phone only.</li>
        <li><strong>Results.</strong> Your scores and report are saved on your phone together with your front photo as your scan history. This history may also be included in your own phone backup (iCloud or Google backup) if you have backups turned on. On our server, a copy of the result (scores and text, no photo) is cached under an irreversible fingerprint of the inputs, so the same photos give the same score. It is automatically deleted after 30 days. See Face data below.</li>
        <li><strong>Anonymous ID and usage records.</strong> The app signs in silently with a random anonymous ID (Firebase Authentication). Our server keeps simple counters under that ID: how many scans and chat messages you used, your plan, and any creator code you applied. This is how we apply free and Pro limits. Our database also notes when the ID was created.</li>
        <li><strong>Sign-in (optional).</strong> If you choose Sign in with Apple or Google, Firebase Authentication links that account to your anonymous ID and keeps your email address and the account ID Apple or Google gives us. With Google it also keeps the name and profile photo link on your Google account. With Apple you can hide your email, and then we only get a private relay address from Apple. We use these only to sign you in again. If that Apple or Google account already used Glowmetry before, the app moves to it and deletes the anonymous ID it used until then, together with that ID&apos;s usage records. Your scans stay on this phone. You never need to sign in to use the app.</li>
        <li><strong>Purchase status.</strong> Subscriptions are sold by the App Store or Google Play and managed through RevenueCat. We see your plan, product, dates and your anonymous ID. We never see your card or bank details.</li>
        <li><strong>App usage events.</strong> Through PostHog we record things like which screens you reach, that a scan started or finished (with the overall score), paywall views and purchases. They are linked to a random ID, not to your name or email. They never contain your photos or face measurements.</li>
        <li><strong>Ads.</strong> Free users can watch optional rewarded ads through Google AdMob. AdMob receives your device&apos;s advertising ID, IP address and ad interactions, and where required by law it asks for your consent first. We never share photos, face data or your answers with ad networks.</li>
        <li><strong>Device checks and settings.</strong> Firebase App Check confirms the request comes from the real app on a real device (Apple App Attest or Google Play Integrity). Firebase Remote Config sends the app its settings.</li>
        <li><strong>Reminders.</strong> The daily reminder is a notification created on your phone. It does not use our servers.</li>
        <li><strong>If you email us.</strong> We keep your message and email address to reply.</li>
      </ul>

      <h2 id="face-data">Face data</h2>

      <ul>
        <li><strong>What.</strong> Your front photo, an optional side photo and numbers measured from the front photo (eye spacing, jaw width, symmetry and similar ratios). A face photo is sensitive, so we treat it with extra care.</li>
        <li><strong>Why.</strong> Only to produce your scores, skin report, plan and hairstyle ideas. We do not use it to identify or recognise you, to build a face template, to profile you or to decide anything about you.</li>
        <li><strong>Consent.</strong> Before your first upload the app asks you to confirm that the photos are of you, that you are 13 or older and that your photos go to the AI service to make your results. Without it nothing is uploaded. You can withdraw consent any time in Settings, Data consent. Withdrawing stops new uploads.</li>
        <li><strong>Where it goes.</strong> Photos and measurements travel over an encrypted connection to our server (Google Firebase Cloud Functions, region us-central1). Our server sends the photos, the face measurements and your profile answers to the AI model. The model is OpenAI GPT-6 Luna, accessed through OpenRouter, which routes the request to the model&apos;s host. We ask OpenRouter to use only providers that do not collect or train on your data. Our server holds the photos in memory while it works and does not write them to a database or file storage.</li>
        <li><strong>How long.</strong> Photos are not stored on our servers. The cached result (scores and text, no photo) is automatically deleted after 30 days, and it sits under a one-way fingerprint that cannot be turned back into a photo or tied to you. Your scan history on your phone stays until you delete it or delete your data, and may be part of your own iCloud or Google backup if backups are on.</li>
        <li><strong>Never sold, never used for ads.</strong> We do not sell face data, share it with advertisers or use it for advertising.</li>
        <li><strong>Under 13.</strong> If the analysis suggests the person in a photo is under 13, no results are made and the app tells you why.</li>
      </ul>

      <h2 id="who-else-is-involved">Who else is involved</h2>

      <p>
        We use these services to run the app. Each handles data under its own privacy policy.
      </p>

      <ul>
        <li><strong>OpenRouter and OpenAI.</strong> Cloud AI that reads your photos, measurements and profile answers (and chat text for Pro) and writes the results. OpenRouter is set to deny data collection. <a href="https://openrouter.ai/privacy" target="_blank" rel="noopener noreferrer">openrouter.ai/privacy</a> and <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">openai.com/policies/privacy-policy</a></li>
        <li><strong>Google ML Kit.</strong> Face detection that runs on your phone. Your photo is not sent to Google for this step. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></li>
        <li><strong>Google Firebase.</strong> Sign in (anonymous, or with Apple or Google if you choose), Cloud Functions, Firestore database, App Check and Remote Config. <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">firebase.google.com/support/privacy</a></li>
        <li><strong>Apple and Google sign-in.</strong> Only if you choose to sign in. Apple or Google confirms it is you and shares your email with us. <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">apple.com/legal/privacy</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></li>
        <li><strong>RevenueCat.</strong> Subscription status and purchase records. <a href="https://www.revenuecat.com/privacy/" target="_blank" rel="noopener noreferrer">revenuecat.com/privacy</a></li>
        <li><strong>PostHog.</strong> App usage analytics. <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">posthog.com/privacy</a></li>
        <li><strong>Google AdMob.</strong> Optional rewarded ads for free users. <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/ads</a></li>
        <li><strong>Apple App Store and Google Play.</strong> Payments, subscriptions and app delivery.</li>
      </ul>

      <p>
        We do not sell your data. We may share it if the law requires it or to protect the app from abuse.
      </p>

      <h2 id="where-it-is-processed">Where it is processed</h2>

      <p>
        Our server runs in the United States (Google Cloud). The AI model is accessed through OpenRouter, so data may be processed in the United States or in other countries where OpenRouter&apos;s providers operate. We are based in India. If you are in the EEA, UK or elsewhere, your data is therefore processed outside your country, under the safeguards our providers offer such as standard contractual clauses.
      </p>

      <h2 id="how-long-we-keep-data">How long we keep data</h2>

      <ul>
        <li><strong>On your phone:</strong> until you delete a scan, delete your data or uninstall the app. Scan history may also sit in your own phone backup (iCloud or Google backup) if you have backups turned on, and stays there under your backup settings.</li>
        <li><strong>Photos on our servers:</strong> not stored.</li>
        <li><strong>Cached results:</strong> automatically deleted after 30 days.</li>
        <li><strong>Usage records and creator code redemption:</strong> until you delete your data.</li>
        <li><strong>Sign-in details (email and account ID):</strong> until you delete your account. Sign out does not delete them.</li>
        <li><strong>Purchase records:</strong> RevenueCat customer data is deleted when you delete your data. Apple and Google keep their own purchase records under their rules.</li>
        <li><strong>Usage events:</strong> kept in PostHog for as long as we need them to improve the app, linked only to a random ID.</li>
        <li><strong>Emails to us:</strong> until the matter is closed.</li>
      </ul>

      <h2 id="your-choices-and-rights">Your choices and rights</h2>

      <ul>
        <li><strong>Delete my data.</strong> In Settings you can delete everything: scans on your phone, our server records, the RevenueCat customer and your anonymous ID. This also resets the anonymous ID used for analytics, so earlier events cannot be tied to you any more. Cached results cannot be tied to you and are automatically deleted after 30 days. Deleting your data does not cancel a subscription, so cancel that in the App Store or Google Play first.</li>
        <li><strong>Delete account.</strong> If you signed in, Settings shows Delete account in place of Delete my data. It asks you to sign in again with the same Apple or Google account, then deletes everything Delete my data deletes plus your sign-in details (email and account ID) from Firebase Authentication. For Apple it also tells Apple to remove Glowmetry&apos;s access to your Apple ID. It does not cancel a subscription.</li>
        <li><strong>Sign out.</strong> Your scans stay on this phone and the app goes back to a new anonymous ID.</li>
        <li><strong>Export my data.</strong> In Settings you can export your data as a JSON file.</li>
        <li><strong>Data consent.</strong> In Settings you can see when you agreed and withdraw.</li>
        <li><strong>Ads.</strong> On iPhone, change tracking in Settings, Privacy and Security, Tracking. On Android, reset or delete your advertising ID in Settings, Google, Ads.</li>
        <li><strong>Legal rights.</strong> Under India&apos;s DPDP Act, the EU and UK GDPR and similar laws you can ask to access, correct or delete your data, object to processing, take your data with you, withdraw consent and complain to your data protection authority. Email us and we will reply within 30 days. Our legal bases are your consent (photos and face data), providing the service you asked for (scans, subscription) and our legitimate interest in keeping the app safe and working.</li>
      </ul>

      <h2 id="security">Security</h2>

      <p>
        Data travels over HTTPS. Our AI keys and secrets stay on the server, never in the app. Our database records are meant to be reached only by our own server code, and every request to our server is checked by Firebase App Check. No system is perfectly safe, but we keep what we hold small on purpose.
      </p>

      <h2 id="children">Children</h2>

      <p>
        Glowmetry is not for children under 13. The app asks for your birthday during setup and blocks anyone under 13. We do not knowingly collect data from children under 13. If you think a child has used the app, email us and we will delete the data.
      </p>

      <h2 id="not-medical-advice">Not medical advice</h2>

      <p>
        Glowmetry gives general cosmetic guidance. It is not medical advice and does not diagnose anything. See a doctor for any skin or health concern.
      </p>

      <h2 id="changes">Changes</h2>

      <p>
        If this policy changes, the date at the top changes too. For big changes we will tell you in the app.
      </p>

      <h2 id="contact">Contact</h2>

      <p>
        Gautam Singh Rathor (Garoono), Delhi, India. Email: <a href="mailto:garoonotech@gmail.com">garoonotech@gmail.com</a>
      </p>
    </LegalPage>
  );
}
