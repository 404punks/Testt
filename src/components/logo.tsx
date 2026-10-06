import Link from "next/link";

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="FonsFamily home">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>FONS<span>FAMILY</span></span>
    </Link>
  );
}
