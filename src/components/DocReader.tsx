"use client";

import { previewOf, previewPageUrl, previewTeaserUrl, type SharedDoc } from "../data/docs";
import { useModal } from "../lib/useModal";
import { DownloadIcon } from "./DocCard";
import { ProOffer } from "./ProOffer";

type Props = {
  doc: SharedDoc;
  onClose: () => void;
  onDownload: () => void; // opens the Pro dialog
  onBuy: () => void;
  onSignIn?: () => void;
  covered: boolean; // the Pro dialog is open on top
};

// Full-screen reader for a locked doc: the free pages, then the rest blurred behind the offer
export default function DocReader({ doc, onClose, onDownload, onBuy, onSignIn, covered }: Props) {
  useModal(onClose, !covered);
  const preview = previewOf(doc);
  if (!preview) return null;

  const locked = preview.pages - preview.shown;
  const pages = Array.from({ length: preview.shown }, (_, i) => i + 1);

  return (
    <div className="reader" role="dialog" aria-modal="true" aria-label={doc.title}>
      <div className="reader-bar">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <strong className="reader-title">{doc.title}</strong>
        <button type="button" className="doc-btn doc-btn-primary reader-download" onClick={onDownload}>
          <DownloadIcon /> Download
        </button>
      </div>

      <div className="reader-scroll">
        <div className="reader-pages">
          {pages.map((n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={n} src={previewPageUrl(doc, n)} alt={`${doc.title}, page ${n}`} className="reader-page" loading={n > 1 ? "lazy" : undefined} />
          ))}

          <div className="reader-gate">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewTeaserUrl(doc)} alt="" aria-hidden className="reader-gate-blur" />
            <ProOffer
              title={locked === 1 ? "Read the last page" : `Read the other ${locked} pages`}
              onBuy={onBuy}
              onSignIn={onSignIn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
