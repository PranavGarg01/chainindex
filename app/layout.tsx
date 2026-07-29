import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { EditorialSidebar } from "@/components/editorial-sidebar";
import { CopyFeedbackProvider } from "@/components/copy-feedback";
import "./tokens.css";
import "./globals.css";

const geist = localFont({
  src: "../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-geist",
  display: "swap",
});
const geistMono = localFont({
  src: "../node_modules/next/dist/next-devtools/server/font/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.chainindex.dev"),
  title: { default: "ChainIndex", template: "%s | ChainIndex" },
  description:
    "Find EVM chain IDs, public RPC endpoints, block explorers, native currencies, and wallet network settings for mainnets and testnets.",
  keywords: [
    "EVM chains",
    "chain ID",
    "public RPC",
    "RPC endpoint",
    "block explorer",
    "add network to wallet",
  ],
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml", sizes: "any" }] },
  openGraph: {
    title: "ChainIndex",
    description: "Open-source EVM chain ID and public RPC directory",
    siteName: "ChainIndex",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ChainIndex",
    description: "Open-source EVM chain ID and public RPC directory",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <CopyFeedbackProvider>
          <div className="site-shell">
            <div className="app-frame">
              <EditorialSidebar />
              <div className="app-content">
                <SiteHeader />
                <main>{children}</main>
              </div>
            </div>
          </div>
        </CopyFeedbackProvider>
        <Analytics />
      </body>
    </html>
  );
}
