import type { Metadata } from "next";
import { HomepageComparison } from "@/components/homepage-comparison";
import { getChains, getFeaturedChains } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  const chains = getChains();
  return (
    <HomepageComparison
      chains={chains.slice(0, 40)}
      featuredChains={getFeaturedChains()}
      totalCount={chains.length}
    />
  );
}
