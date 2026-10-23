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
    images: ["/shots/tycoon-ops.webp"],
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#a8a8aa" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
