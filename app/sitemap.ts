import type { MetadataRoute } from "next";
import { getChains } from "@/lib/data";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.chainindex.dev";
  return ["", "/chains", "/chains/all", "/testnets", "/submit", "/about"]
    .map((route) => ({ url: `${base}${route}` }))
    .concat(getChains().map((chain) => ({ url: `${base}/chains/${chain.slug}` })));
}
