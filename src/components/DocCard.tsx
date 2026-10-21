"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { freePdfUrl, previewOf, thumbUrl, type SharedDoc } from "../data/docs";
import { openPaidDoc } from "../lib/access";
import { isLiked, recordDownload, recordView, toggleLike } from "../lib/docStats";
import type { DocStats } from "../lib/rankDocs";

type Props = {
  doc: SharedDoc;
  index: number;
  stats: DocStats | null; // null while loading or if Firestore is unreachable
  onCount: (slug: string, counter: keyof DocStats, by: number) => void;
  locked: boolean; // paid doc and the visitor has no lifetime access
  onRead: () => void; // opens the reader: every page of a free doc, the preview of a locked one
  onBuy: () => void; // opens the Pro dialog
};

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function DocCard({ doc, index, stats, onCount, locked, onRead, onBuy }: Props) {
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [opening, setOpening] = useState(false);
  const thumbRef = useRef<HTMLImageElement>(null);

  useEffect(() => setLiked(isLiked(doc.slug)), [doc.slug]);

  // An image that failed before hydration never fires React's onError
  useEffect(() => {
    const img = thumbRef.current;
    if (img?.complete && img.naturalWidth === 0) setThumbFailed(true);
  }, []);

  const count = (n: number | undefined) => (stats ? (n ?? 0).toLocaleString("en-US") : "–");

  const onView = () => {
    if (recordView(doc.slug)) onCount(doc.slug, "views", 1);
  };

  // Pro members open paid docs through a 10-minute signed link
  const openPaid = async (download: boolean) => {
    if (opening) return;
    setOpening(true);
    try {
      await openPaidDoc(doc.slug, download);
      if (download ? recordDownload(doc.slug) : recordView(doc.slug)) onCount(doc.slug, download ? "downloads" : "views", 1);
    } catch {
      alert("Couldn't open this doc. Please try again.");
    } finally {
      setOpening(false);
    }
  };

  // Free docs and locked docs open in the reader; without page images, fall back to the PDF or the offer
  const read = () => {
    if (!previewOf(doc)) return doc.free ? window.open(freePdfUrl(doc), "_blank", "noopener") : onBuy();
    onView();
    onRead();
  };

  const onDownload = () => {
    if (recordDownload(doc.slug)) onCount(doc.slug, "downloads", 1);
  };

  const onLike = async () => {
    if (pending) return;
    const next = !liked;
    setPending(true);
    setLiked(next);
    onCount(doc.slug, "likes", next ? 1 : -1);
    try {
      await toggleLike(doc.slug);
    } catch {
      setLiked(!next);
      onCount(doc.slug, "likes", next ? -1 : 1);
    } finally {
      setPending(false);
    }
  };

  const cover = thumbFailed ? (
    <div className="doc-cover-fallback">
      <DocIcon />
    </div>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={thumbRef} src={thumbUrl(doc)} alt="" loading="lazy" onError={() => setThumbFailed(true)} />
  );

  return (
    <motion.article
      id={doc.slug}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05, layout: { duration: 0.35, ease: "easeOut" } }}
      className="doc-card"
    >
      <button
        type="button"
        className="doc-cover"
        onClick={() => (doc.free || locked ? read() : openPaid(false))}
        aria-label={`Open ${doc.title}`}
      >
        {cover}
      </button>

      <div className="doc-body">
        <h2 className="doc-title">{doc.title}</h2>
        <p className="doc-blurb">{doc.blurb}</p>
        <p className="doc-date font-mono">{formatDate(doc.addedOn)}</p>

        <div className="doc-stats">
          <span title="Views">
            <EyeIcon /> {count(stats?.views)}
          </span>
          <span title="Downloads">
            <DownloadIcon /> {count(stats?.downloads)}
          </span>
          <button
            type="button"
            className={`doc-like ${liked ? "is-liked" : ""}`}
            onClick={onLike}
            disabled={pending}
            aria-pressed={liked}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <HeartIcon filled={liked} /> {count(stats?.likes)}
          </button>
        </div>

        {locked ? (
          <div className="doc-actions">
            <button type="button" className="doc-btn" onClick={read}>
              View
            </button>
            <button type="button" className="doc-btn doc-btn-primary doc-btn-icon" onClick={onBuy}>
              <LockIcon /> Download
            </button>
          </div>
        ) : doc.free ? (
          <div className="doc-actions">
            <button type="button" className="doc-btn" onClick={read}>
              View
            </button>
            <a href={freePdfUrl(doc)} download onClick={onDownload} className="doc-btn doc-btn-primary">
              Download
            </a>
          </div>
        ) : (
          <div className="doc-actions">
            <button type="button" className="doc-btn" onClick={() => openPaid(false)} disabled={opening}>
              View
            </button>
            <button type="button" className="doc-btn doc-btn-primary" onClick={() => openPaid(true)} disabled={opening}>
              Download
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}
