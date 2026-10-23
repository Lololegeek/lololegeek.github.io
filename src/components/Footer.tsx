"use client";

import { toast } from "sonner";
import { Ribbon } from "./Ribbon";
import { useSite } from "@/lib/store";

const links = [
  { label: "Work", href: "#work" },
  { label: "Numbers", href: "#numbers" },
  { label: "Stack", href: "#stack" },
  { label: "Letter", href: "#letter" },
  { label: "GitHub", href: "https://github.com/Lololegeek" },
];

export function Footer() {
  const setPalette = useSite((s) => s.setPalette);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText("https://github.com/Lololegeek");
      toast("Profile link copied");
    } catch {
      toast("Copy blocked by the browser. The link is github.com/Lololegeek");
    }
  };

  return (
    <footer>
      <Ribbon className="h-2" />
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="relative min-h-[50svh] overflow-hidden bg-field">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/shots/tycoon-bedroom.webp"
            width={1262}
            height={650}
            alt="Server Tycoon, the first rack in a bedroom"
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-between bg-field p-6 text-field-ink md:p-12">
          <nav aria-label="Footer" className="menu flex flex-col items-start gap-1 text-[clamp(40px,2.6vw+16px,64px)] leading-[1.05] tracking-[-0.02em]">
            {links.map((l) => (
              <a key={l.label} href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                <span>{l.label}</span>
              </a>
            ))}
            <button type="button" onClick={() => setPalette(true)} className="text-left">
              <span>Search</span>
            </button>
          </nav>

          <div className="mt-16 flex flex-col gap-6">
            <button
              type="button"
              onClick={copy}
              className="self-start text-[15px] font-semibold underline decoration-2 underline-offset-4"
            >
              Copy profile link
            </button>
            <div className="flex flex-wrap items-end justify-between gap-4 text-[13px] text-field-soft">
              <p>© 2026 Lololegeek. Set in Archivo. Built with Next.js.</p>
              <p className="text-[22px] leading-none font-semibold tracking-[-0.02em] text-field-ink">lololegeek</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
