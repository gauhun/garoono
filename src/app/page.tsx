"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  description: string;
  stat: string;
  icon: string;
  link: string;
  color: string; // wave accent color
}

// ─── Data ────────────────────────────────────────────────────────────────────

const products: Product[] = [
  {
    id: 1,
    name: "Apna RSS",
    description: "Content & organisation app for volunteers",
    stat: "21,000+ users",
    icon: "/logos/rss_transparent.png",
    link: "https://play.google.com/store/apps/details?id=com.garoono.apnarss",
    color: "#F59E0B",
  },
  {
    id: 2,
    name: "XLSheet AI",
    description: "AI spreadsheet assistant — formulas, SQL, regex & templates",
    stat: "7,000+ users",
    icon: "/logos/app_logo_compressed.png",
    link: "https://xlsheetai.com",
    color: "#FF6B35",
  },
  {
    id: 3,
    name: "Habitide",
    description: "Build habits with friends. Track, prove, grow.",
    stat: "6,300+ users",
    icon: "/logos/habitide_logo.png",
    link: "https://habitide.in",
    color: "#3B82F6",
  },
  {
    id: 4,
    name: "BhaktiDhun",
    description: "Devotional music — bhajans, aartis, mantras",
    stat: "2,800+ users",
    icon: "/logos/bhakti_dhun_logo.png",
    link: "https://play.google.com/store/apps/details?id=com.garoono.bhaktidhunsanatan",
    color: "#EF4444",
  },
  {
    id: 5,
    name: "FocusOn",
    description: "Minimalist flip clock focus timer for deep work",
    stat: "1,960+ users",
    icon: "/logos/focuson_icon.png",
    link: "https://linktr.ee/focusontimer",
    color: "#8B5CF6",
  },
  {
    id: 6,
    name: "JSON View : Editor",
    description: "Lightweight, privacy-first offline JSON editor and formatter",
    stat: "10+ users",
    icon: "/logos/json_viewer.png",
    link: "https://play.google.com/store/apps/details?id=in.garoono.jsonviewer",
    color: "#10B981",
  },
  {
    id: 7,
    name: "XML Viewer",
    description: "XML editor, tree viewer, and converter",
    stat: "10+ users",
    icon: "/logos/xml_viewer.png",
    link: "https://play.google.com/store/apps/details?id=in.garoono.xmlviewer",
    color: "#06B6D4",
  },
  {
    id: 8,
    name: "TomyLov",
    description: "Shareable romantic websites — went viral across countries",
    stat: "Viral 🌍",
    icon: "/logos/circle_garoono_logo.png",
    link: "https://tomylov.in",
    color: "#EC4899",
  },
];

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// ─── Decorative Wave SVG (mimicking chart area) ──────────────────────────────

function WaveSVG({ color }: { color: string }) {
  // Use the amber golden color for all graphs
  const unifiedColor = "#F5A548";
  return (
    <svg
      viewBox="0 0 400 80"
      fill="none"
      className="card-wave"
      preserveAspectRatio="none"
      style={{ width: "100%", height: 64, marginTop: 8 }}
    >
      <defs>
        <linearGradient id="grad-amber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={unifiedColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={unifiedColor} stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Subtle dashed grid mimicking chart axes */}
      <g stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.6">
        <line x1="0" y1="75" x2="400" y2="75" />
        <line x1="50" y1="10" x2="50" y2="80" />
        <line x1="150" y1="10" x2="150" y2="80" />
        <line x1="250" y1="10" x2="250" y2="80" />
        <line x1="350" y1="10" x2="350" y2="80" />
      </g>

      <path
        d={`M0,60 C40,55 60,20 100,35 C140,50 160,15 200,25 C240,35 260,10 300,20 C340,30 370,15 400,25 L400,80 L0,80 Z`}
        fill="url(#grad-amber)"
      />
      <path
        d={`M0,60 C40,55 60,20 100,35 C140,50 160,15 200,25 C240,35 260,10 300,20 C340,30 370,15 400,25`}
        stroke={unifiedColor}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

// ─── Framer Motion Variants ──────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.05 },
  }),
};

// ─── Product Card ────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.a
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="product-card"
      aria-label={`Visit ${product.name}`}
      id={`product-${product.id}`}
    >
      {/* Header: Icon + Name + Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            overflow: "hidden",
            flexShrink: 0,
            border: "1px solid var(--border)",
          }}
        >
          <Image
            src={product.icon}
            alt={product.name}
            width={44}
            height={44}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingTop: 2 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 900, fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
              {product.name}
            </span>
            <span className={`stat-badge ${product.stat.includes("Viral") ? "stat-badge-accent" : ""}`}>
              {product.stat.includes("Viral") ? "🌍" : "👥"} {product.stat.replace(" users", "")}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 16, fontWeight: 500, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 0, marginBottom: 8 }}>
        {product.description}
      </p>

      {/* Decorative Wave (like Marc Lou's chart) */}
      <WaveSVG color={product.color} />
    </motion.a>
  );
}

import { useState } from "react";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return;
    setSubscribing(true);

    // TODO: Paste your Google Apps Script Web App URL here!
    const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxfac9FCSAWR49zfBPFboTQd3e2riwOHXYPMdptkV7mPYImOT2IbgscwtYAs-hWBKS8/exec";

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }).toString(),
      });
      setSubscribed(true);
    } catch (e) {
      console.error(e);
      // Even if network hides cors response, no-cors works opaquely
      setSubscribed(true);
    }
    setSubscribing(false);
  };

  return (
    <div className="page-container">

      {/* ── Left Sidebar ──────────────────────────────────────────────────── */}
      <aside className="sidebar">

        {/* Avatar + Name */}
        <div className="sidebar-header" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            className="avatar"
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              overflow: "hidden",
              // background: "#F5A548",
              border: "4px solid var(--accent-light)",
              flexShrink: 0,
            }}
          >
            <Image
              src="/garoono_logo.png"
              alt="Gautam"
              width={88}
              height={88}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              priority
            />
          </div>

          <div className="meta">
            <h1
              className="name font-serif"
              style={{
                fontSize: 30,
                fontWeight: 400,
                color: "var(--text-primary)",
                lineHeight: 1.1,
                marginBottom: 6,
              }}
            >
              Gautam
            </h1>

            {/* Location + Users stat */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-secondary)" }}>
                <LocationIcon /> Delhi, India
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-secondary)" }}>
                <UsersIcon />
                <span className="font-mono" style={{ fontWeight: 600 }}>35,000+</span> total users
              </span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p
          className="font-serif"
          style={{
            fontStyle: "italic",
            fontSize: 17,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          Senior engineer by day, indie app maker by night.
        </p>

        {/* Newsletter */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
            Building in public — follow the journey ✌️
          </p>
          {subscribed ? (
            <div style={{ display: "flex", padding: "10px 14px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--color-primary)", fontSize: 14, fontWeight: 600 }}>
              🎉 Wrapped! You&apos;re on the list.
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email..."
                className="email-input"
                aria-label="Email for newsletter"
                id="newsletter-email"
                disabled={subscribing}
              />
              <button
                className="btn-subscribe"
                id="newsletter-subscribe"
                disabled={subscribing || !email}
                onClick={handleSubscribe}
              >
                {subscribing ? "..." : "Subscribe"}
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Social Icons */}
        <div style={{ display: "flex", gap: 8 }}>
          <a href="https://x.com/xgautamsingh" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X (Twitter)" id="social-x">
            <XIcon />
          </a>
          <a href="https://youtube.com/@garoono" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube" id="social-youtube">
            <YouTubeIcon />
          </a>
          <a href="https://www.linkedin.com/in/gauhun/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn" id="social-linkedin">
            <LinkedInIcon />
          </a>
          {/* <a href="https://github.com/gauhun" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub" id="social-github">
            <GitHubIcon />
          </a> */}
          <a href="https://instagram.com/garoonoo" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram" id="social-instagram">
            <InstagramIcon />
          </a>
        </div>

        {/* Experience (compact in sidebar) */}
        <div className="divider" />

        <div>
          <p className="section-label" style={{ marginBottom: 12 }}>Experience</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { role: "Senior Software Engineer", company: "Capgemini", period: "March 2025 – Present" },
              { role: "Software Engineer", company: "Kellton", period: "2022 – 2025" },
              { role: "Software Engineer", company: "Enbake Consultancy", period: "2020 – 2022" },
              { role: "Software Engineer", company: "GPS Gateway India", period: "2020" },
            ].map((e, idx) => (
              <div key={idx}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>
                  {e.role}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                  {e.company} · <span className="font-mono">{e.period}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="divider" />
        <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
          Built with ☕ and Flutter — © 2026 Garoono
        </p>
      </aside>

      {/* ── Right Content: Product Cards ───────────────────────────────────── */}
      <main className="content">
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Stats row below products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginTop: 24,
            textAlign: "center",
            padding: "24px 0",
            borderTop: "1px solid var(--border)",
          }}
        >
          {[
            { value: "30+", label: "Apps Shipped" },
            { value: "35K+", label: "Total Users" },
            { value: "6+", label: "Years Building" },
            { value: "4", label: "Revenue Apps" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
