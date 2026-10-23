"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Search } from "lucide-react";
import { Button } from "./Button";
import { Ribbon } from "./Ribbon";
import { useSite } from "@/lib/store";
import { stats, fmt } from "@/lib/stats";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const setPalette = useSite((s) => s.setPalette);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-bar]", { scaleY: 0, transformOrigin: "top", duration: 1, stagger: 0.04 })
          .from("[data-rise]", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.25);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative z-[var(--z-raised)] flex min-h-[calc(100svh-24px)] flex-col overflow-hidden rounded-[var(--radius)] bg-paper"
    >
      <Ribbon labelled className="h-10 md:h-14" />

      <div className="flex flex-1 flex-col px-6 pt-8 pb-7 md:px-12 md:pt-12">
        <p data-rise className="text-[26px] leading-none font-semibold tracking-[-0.02em] md:text-[34px]">
          lololegeek
        </p>

        <div className="mt-auto pt-16 md:pt-24">
          <h1 id="hero-title" data-rise className="max-w-[16ch] text-[8.6vw] sm:text-[clamp(40px,3.6vw,56px)]">
            Desktop apps, games and the tools between.
          </h1>
          <p data-rise className="mt-8 max-w-[36ch] text-[17px] leading-[1.5]">
            {stats.projects} projects and {fmt(stats.lines)} lines of code. Most of it runs offline, on the machine in
            front of you.
          </p>
          <div data-rise className="mt-8 flex flex-wrap items-center gap-4">
            <Button onClick={() => setPalette(true)}>
              <Search size={17} strokeWidth={2.2} aria-hidden />
              Search the projects
            </Button>
            <kbd className="hidden text-[13px] text-soft md:inline">or press Ctrl K</kbd>
          </div>
        </div>

        <nav aria-label="Sections" className="mt-14 flex flex-wrap gap-x-8 gap-y-2 text-[15px]">
          <a href="#work" className="underline-offset-4 hover:underline">Work</a>
          <a href="#stack" className="underline-offset-4 hover:underline">Stack</a>
          <a href="https://github.com/Lololegeek" className="underline-offset-4 hover:underline">
            GitHub
          </a>
        </nav>
      </div>
    </section>
  );
}
