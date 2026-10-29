"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { joinWaitlist } from "../lib/access";
import { CALL, COURSE, COURSE_STAGE, KIT_PRICE, KITS } from "../data/offers";

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      await joinWaitlist(email);
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") return <p className="offer-done">You&apos;re on the list. I&apos;ll email you the {COURSE.price.waitlist} code</p>;
  return (
    <form className="offer-form" onSubmit={submit}>
      <input
        type="email"
        required
        className="docs-search offer-input"
        placeholder="you@email.com"
        aria-label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="btn-primary" disabled={state === "sending"}>
        {state === "sending" ? "Joining…" : "Join waitlist"}
      </button>
      {state === "error" && <p className="offer-error">Couldn&apos;t join. Try again</p>}
    </form>
  );
}

export default function Products() {
  return (
    <div className="docs-page">
      <Link href="/" className="docs-back">
        ← Gautam
      </Link>
      <h1 className="font-serif docs-title">Products</h1>

      <section className="offer-card offer-course">
        <span className="offer-tag">{COURSE_STAGE === "waitlist" ? "Waitlist open" : COURSE_STAGE === "presale" ? "Presale" : "Course"}</span>
        <h2 className="offer-title">{COURSE.title}</h2>
        <p className="offer-line">{COURSE.line}</p>
        <ul className="offer-includes">
          {COURSE.includes.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p className="offer-price">
          {COURSE.price[COURSE_STAGE]}
          {COURSE_STAGE === "waitlist" && <span> for the waitlist · then {COURSE.price.presale}</span>}
          <span> · {COURSE.international} outside India</span>
        </p>
        {/* Presale/launch checkout is the next build; until then the stage stays "waitlist" */}
        {COURSE_STAGE === "waitlist" && <WaitlistForm />}
      </section>

      <div className="offer-grid">
        <section className="offer-card">
          <h2 className="offer-title">1:1 call</h2>
          <p className="offer-line">
            {CALL.minutes} min · {CALL.hours}
          </p>
          <p className="offer-price">{CALL.price}</p>
          <Link href="/call/" className="btn-primary">
            Book a call
          </Link>
        </section>

        <section className="offer-card">
          <h2 className="offer-title">Docs lifetime pass</h2>
          <p className="offer-line">Every paid doc, now and later</p>
          <p className="offer-price">₹99</p>
          <Link href="/docs/" className="btn-primary">
            See the docs
          </Link>
        </section>

        {KITS.map((k) => (
          <section key={k.title} className="offer-card">
            <span className="offer-tag">Coming soon</span>
            <h2 className="offer-title">{k.title}</h2>
            <p className="offer-line">{k.line}</p>
            <p className="offer-price">
              {KIT_PRICE.inr}
              <span> · {KIT_PRICE.usd}</span>
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
