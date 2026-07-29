"use client";

import type { ReactNode } from "react";
import Link from "next/link";

export function HomeLogoLink({ children }: { children: ReactNode }) {
  return (
    <Link
      className="editorial-brand"
      href="/"
      aria-label="ChainIndex home"
      onClick={() => window.dispatchEvent(new Event("chainindex:clear-search"))}
    >
      {children}
    </Link>
  );
}
