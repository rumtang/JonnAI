import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Agentic — Knowledge Graph Visualization",
  description: "Interactive 3D visualization of AI-powered content production workflows with human-in-the-loop gates",
  openGraph: {
    title: "Agentic — Knowledge Graph Visualization",
    description: "Interactive 3D visualization of AI-powered content production workflows",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${caveat.variable} antialiased text-foreground relative`}
      >
        <div className="crystalline-bg">
          <div className="gradient-orb-1" />
          <div className="gradient-orb-2" />
          <div className="gradient-orb-3" />
        </div>
        <div className="relative z-10">{children}</div>
        {/* Cloudflare Web Analytics — free, privacy-friendly, no cookies */}
        {process.env.NEXT_PUBLIC_CF_BEACON_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_BEACON_TOKEN}"}`}
          />
        )}
      </body>
    </html>
  );
}
