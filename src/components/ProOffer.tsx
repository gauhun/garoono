"use client";

import { useModal } from "../lib/useModal";
import { DOC_PRICE_LABEL } from "../lib/checkout";
import { ProofStats } from "./DocsWelcome";

type OfferProps = {
  title: string;
  onBuy: () => void;
  onSignIn?: () => void; // shown to signed-out visitors who may have bought already
  autoFocus?: boolean; // only in the dialog; inside the reader it would scroll to the bottom
};

// One title, the price, the proof and one button
export function ProOffer({ title, onBuy, onSignIn, autoFocus }: OfferProps) {
  return (
    <div className="pro-offer">
      <strong className="pro-offer-title">{title}</strong>
      <p className="pro-offer-price">
        {DOC_PRICE_LABEL} <span>one time</span>
      </p>
      <p className="pro-offer-includes">View and download it anytime</p>
      <ProofStats className="is-compact" />
      <button type="button" className="doc-btn doc-btn-primary pro-offer-buy" onClick={onBuy} autoFocus={autoFocus}>
        Unlock for {DOC_PRICE_LABEL}
      </button>
      {onSignIn && (
        <button type="button" className="unlock-link" onClick={onSignIn}>
          Already bought? Sign in
        </button>
      )}
    </div>
  );
}

export function ProDialog({ onClose, ...offer }: OfferProps & { onClose: () => void }) {
  useModal(onClose);
  return (
    <div className="pro-dialog-backdrop" onClick={onClose}>
      <div className="pro-dialog" role="dialog" aria-modal="true" aria-label={offer.title} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <ProOffer {...offer} autoFocus />
      </div>
    </div>
  );
}
