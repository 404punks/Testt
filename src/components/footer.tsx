import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-statement">
          <Logo />
          <p>Autonomous intelligence.<br />Deterministic control.</p>
        </div>
        <div>
          <span className="footer-label">Product</span>
          <Link href="/explore">Explore</Link>
          <Link href="/launch">Launch token</Link>
          <Link href="/programs">Programs</Link>
        </div>
        <div>
          <span className="footer-label">Learn</span>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/docs">Documentation</Link>
          <Link href="/docs#security">Security</Link>
        </div>
        <div>
          <span className="footer-label">System</span>
          <span className="system-online"><i /> All systems operational</span>
          <p className="fine-print">Built on Solana</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 FonsFamily</span>
        <span>Experimental software. Not financial advice.</span>
      </div>
    </footer>
  );
}
