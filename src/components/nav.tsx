"use client";

import { Menu, Wallet, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";

const links = [
  ["Explore", "/explore"],
  ["Launch", "/launch"],
  ["How it works", "/how-it-works"],
  ["Docs", "/docs"],
];

export function Nav({ demoMode }: { demoMode: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Logo />
        <nav className={open ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
          {links.map(([label, href]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link className="mobile-wallet" href="/profile"><Wallet size={15} /> Connect wallet</Link>
        </nav>
        <div className="nav-actions">
          {demoMode && <span className="demo-chip"><i /> Demo mode</span>}
          <Link className="wallet-button" href="/profile"><Wallet size={15} /> Connect</Link>
          <button
            className="menu-button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
