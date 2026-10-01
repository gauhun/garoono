"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import type { AppPage } from "../../data/appPages";
import type { Product } from "../../data/products";
import StoreButtons from "./StoreButtons";

const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 } }),
};

// Real store screenshots cycling inside a phone frame
function PhoneCarousel({ shots, name }: { shots: string[]; name: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % shots.length), 2800);
    return () => clearInterval(id);
  }, [shots.length]);

  return (
    <div className="phone">
      <div className="phone-screen">
        <AnimatePresence initial={false}>
          <motion.img
            key={shots[index]}
            src={shots[index]}
            alt={`${name} screenshot ${index + 1}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>
      </div>
      <div className="phone-dots">
        {shots.map((s, i) => (
          <span key={s} className={i === index ? "is-on" : ""} />
        ))}
      </div>
    </div>
  );
}

export default function AppLanding({
  page,
  product,
  others,
  qrSvg,
}: {
  page: AppPage;
  product: Product;
  others: Product[];
  qrSvg: string;
}) {
  const accent = product.color;
  const users = product.stat.replace(/\s*users/i, "");

  return (
    <MotionConfig reducedMotion="user">
      <main className="app-page" style={{ "--app-accent": accent } as React.CSSProperties}>
        <Link href="/" className="docs-back">
          ← Gautam
        </Link>

        {/* Hero */}
        <section className="app-hero">
          <motion.div className="app-hero-copy" initial="hidden" animate="visible">
            <motion.div
              className="app-icon"
              variants={rise}
              custom={0}
              animate={{ y: [0, -8, 0] }}
              transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.icon} alt={`${product.name} icon`} width={88} height={88} />
            </motion.div>
            <motion.h1 className="font-serif app-name" variants={rise} custom={1}>
              {product.name}
            </motion.h1>
            <motion.p className="app-tagline" variants={rise} custom={2}>
              {page.tagline}
            </motion.p>
            <motion.p className="app-users font-mono" variants={rise} custom={3}>
              👥 {users} people use it
            </motion.p>
            <motion.div variants={rise} custom={4}>
              <StoreButtons playUrl={page.playUrl} appStoreUrl={page.appStoreUrl} />
            </motion.div>
            {page.websiteUrl && (
              <motion.a variants={rise} custom={5} href={page.websiteUrl} target="_blank" rel="noopener noreferrer" className="app-site-link">
                Visit {page.websiteUrl.replace(/^https?:\/\//, "")} →
              </motion.a>
            )}
          </motion.div>

          <div className="app-hero-visual">
            <motion.span
              className="app-blob app-blob-1"
              animate={{ scale: [1, 1.12, 1], rotate: [0, 20, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="app-blob app-blob-2"
              animate={{ scale: [1, 0.9, 1], x: [0, 16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div initial={{ opacity: 0, y: 40, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <PhoneCarousel shots={page.screenshots} name={product.name} />
            </motion.div>
          </div>
        </section>

        {/* Before and after */}
        <section className="app-section">
          <h2 className="app-h2">The problem it solves</h2>
          <div className="app-ba">
            <motion.div className="app-ba-card is-before" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5 }}>
              <span className="app-ba-label">Before</span>
              <ul>
                {page.problem.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div className="app-ba-arrow" initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              →
            </motion.div>
            <motion.div className="app-ba-card is-after" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, delay: 0.15 }}>
              <span className="app-ba-label">With {product.name}</span>
              <ul>
                {page.result.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="app-section">
          <h2 className="app-h2">How it works</h2>
          <div className="app-steps">
            {page.steps.map((step, i) => (
              <motion.div key={step.title} className="app-step" variants={rise} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
                <span className="app-step-num font-mono">{i + 1}</span>
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="app-section">
          <h2 className="app-h2">What you get</h2>
          <div className="app-benefits">
            {page.benefits.map((b, i) => (
              <motion.div key={b.title} className="app-benefit" variants={rise} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} whileHover={{ y: -4 }}>
                <span className="app-benefit-icon" aria-hidden="true">
                  {b.icon}
                </span>
                <strong>{b.title}</strong>
                <span>{b.text}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Screenshot strip */}
        <section className="app-section">
          <h2 className="app-h2">Inside the app</h2>
          <div className="app-strip">
            <div className="app-strip-track">
              {[0, 1].map((copy) =>
                page.screenshots.map((shot) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={`${copy}-${shot}`} src={shot} alt="" aria-hidden={copy === 1 || undefined} loading="lazy" />
                )),
              )}
            </div>
          </div>
        </section>

        {/* Final call to action */}
        <motion.section className="app-cta" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5 }}>
          <div className="app-cta-copy">
            <h2 className="font-serif">Get {product.name}</h2>
            <p>{page.tagline}</p>
            <StoreButtons playUrl={page.playUrl} appStoreUrl={page.appStoreUrl} />
          </div>
          <div className="app-qr">
            <div className="app-qr-code" dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <span>Scan to install on your phone</span>
          </div>
        </motion.section>

        {/* More apps */}
        <section className="app-section">
          <h2 className="app-h2">More apps by Gautam</h2>
          <div className="app-more">
            {others.map((p) => (
              <a
                key={p.id}
                href={p.link}
                target={p.link.startsWith("/") ? undefined : "_blank"}
                rel={p.link.startsWith("/") ? undefined : "noopener noreferrer"}
                className="app-bar-chip"
                style={{ background: `${p.color}1F` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.icon} alt="" width={22} height={22} loading="lazy" />
                {p.name}
              </a>
            ))}
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}
