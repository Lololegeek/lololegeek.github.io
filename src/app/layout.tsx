import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lololegeek — native apps, games and tools",
  description:
    "Projects, numbers and stack of Lololegeek: offline desktop apps, games and developer tools in Rust, C++, C#, Java and TypeScript.",
  metadataBase: new URL("https://lololegeek.github.io"),
  openGraph: {
    title: "Lololegeek",
    description: "Desktop apps, games and the tools between.",
    images: [{ url: "/brand/social-preview.png", width: 1280, height: 640 }],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = { themeColor: "#111317" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
