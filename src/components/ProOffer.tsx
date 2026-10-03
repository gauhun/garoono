"use client";

import { useModal } from "../lib/useModal";
import { LaunchCountdown, LaunchPrice } from "./LaunchOffer";

type OfferProps = {
  title: string;
  onBuy: () => void;
  onSignIn?: () => void; // shown to signed-out visitors who may have bought already
  autoFocus?: boolean; // only in the dialog; inside the reader it would scroll to the bottom
};

// One title, the price, the countdown and one button
export function ProOffer({ title, onBuy, onSignIn, autoFocus }: OfferProps) {
  return (
    <div className="pro-offer">
      <strong className="pro-offer-title">{title}</strong>
      <p className="pro-offer-price">
        <LaunchPrice /> <span>lifetime</span>
      </p>
      <LaunchCountdown />
      <button type="button" className="doc-btn doc-btn-primary pro-offer-buy" onClick={onBuy} autoFocus={autoFocus}>
        Get lifetime access
      </button>
      {onSignIn && (
        <button type="button" className="unlock-link" onClick={onSignIn}>
          Already bought? Sign in
        </button>
      )}
      <span className="pro-offer-note">Pro members show on the Pro wall</span>
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
