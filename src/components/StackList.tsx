"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Plus } from "lucide-react";
import { depCount, fmt, stats } from "@/lib/stats";
import { StageSection } from "./StageSection";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const lines = (name: string) => stats.languages.find((l) => l.name === name)?.lines ?? 0;
const used = (name: string) => {
  const n = depCount(name);
  return n ? `${n} projects` : "";
};

type Row = [string, string];
const bars: { name: string; rows: Row[] }[] = [
  {
    name: "TypeScript and the web",
    rows: [
      ["TypeScript", `${fmt(lines("TypeScript"))} lines`],
      ["JavaScript", `${fmt(lines("JavaScript"))} lines`],
      ["CSS and HTML", `${fmt(lines("CSS") + lines("HTML"))} lines`],
      ["React", used("react")],
      ["Electron", used("electron")],
      ["Tailwind CSS", used("tailwindcss")],
      ["Express", used("express")],
      ["Next.js", used("next")],
      ["VS Code API", "Live Server Speed Edition"],
    ],
  },
  {
    name: "C# and .NET",
    rows: [
      ["C#", `${fmt(lines("C#"))} lines`],
      ["Avalonia", "Nexolume"],
      ["WinUI 3", "ProjectHub, NovaExplorer"],
      ["WPF", "LoloProductivity, Gogol Mager"],
      ["Chromium Embedded", "Gogol Mager"],
      [".NET 10", "Nexolume, NovaExplorer"],
    ],
  },
  {
    name: "C and C++",
    rows: [
      ["C++", `${fmt(lines("C++"))} lines`],
      ["C", `${fmt(lines("C"))} lines`],
      ["Qt Quick and QML", "ClipForge, LCut"],
      ["libobs and FFmpeg", "ClipForge"],
      ["MLT", "LCut"],
      ["raylib", "Valombre, GF2D"],
      ["PS3 homebrew", "GreenVita PS3"],
    ],
  },
  {
    name: "Rust",
    rows: [
      ["Rust", `${fmt(lines("Rust"))} lines`],
      ["Tauri", "Basic Pitch Live, LoloRGB"],
      ["Document engines", "Nexolume, the larger half of it"],
      ["Game server", "COPIE ÇA!"],
    ],
  },
  {
    name: "Swift",
    rows: [
      ["Swift", `${fmt(lines("Swift"))} lines`],
      ["SwiftUI on Windows", "WinSwiftUI"],
    ],
  },
  {
    name: "Python and models",
    rows: [
      ["Python", `${fmt(lines("Python"))} lines`],
      ["PyTorch", "MyAI"],
      ["TripoSR and FastAPI", "LoloModelsAI"],
      ["Services", "LoloServer, LoloProductivity licences"],
    ],
  },
  {
    name: "Godot and Java",
    rows: [
      ["GDScript", `${fmt(lines("GDScript"))} lines`],
      ["Java", `${fmt(lines("Java"))} lines`],
      ["Godot 4", "Server Tycoon, COPIE ÇA!"],
      ["Fabric 1.21.1", "UMCE, LoloMC GUI"],
      ["Fabric 1.20.1", "Valoria RP"],
    ],
  },
  {
    name: "This page",
    rows: [
      ["Next.js, React", "static export"],
      ["Tailwind CSS, class-variance-authority", "styling"],
      ["clsx, tailwind-merge", "class names"],
      ["GSAP, @gsap/react, Lenis", "scroll"],
      ["Motion", "the stage crossfade"],
      ["three, @react-three/fiber, drei", "the contribution skyline"],
      ["d3-scale, d3-array, d3-shape", "charts"],
      ["cmdk, Fuse.js", "search"],
      ["Radix Dialog, Tabs, Tooltip", "overlays"],
      ["Embla Carousel", "the screens strip"],
      ["Number Flow", "counting figures"],
      ["Zustand, Zod", "state and data checks"],
      ["date-fns, Sonner, Lucide", "dates, toasts, icons"],
      ["react-intersection-observer, react-use-measure", "layout signals"],
      ["Archivo", "the only typeface"],
    ],
  },
];

export function StackList() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-letter]", {
          yPercent: 60,
          opacity: 0.15,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 30%", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <StageSection mode="languages" id="stack" label="Stack" className="px-6 pt-12 pb-24 md:px-12 md:pb-32 lg:px-[clamp(48px,5vw,72px)]">
      <div ref={root} className="giant overflow-hidden">
        <h2 className="giant-word" aria-label="Stack">
          {"STACK".split("").map((c, i) => (
            <span key={i} data-letter className="inline-block">{c}</span>
          ))}
        </h2>
      </div>
      <p className="mt-8 max-w-[46ch] text-[17px]">
        {stats.allLanguages} languages in total. The tool is picked for the job: C++ close to the GPU, C# at home on
        Windows, Rust for engines, Java for Minecraft, Godot when it is a game.
      </p>

      <div className="mt-10 flex flex-col gap-[6px]">
        {bars.map((b, i) => (
          <details key={b.name} className="bar rounded-[6px] bg-surface" open={i === 0}>
            <summary className="flex h-14 items-center justify-between px-[18px] text-[17px]">
              {b.name}
              <Plus className="plus" size={18} strokeWidth={1.8} aria-hidden />
            </summary>
            <dl className="tnum px-[18px] pt-1 pb-5 text-[15px]">
              {b.rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-[7px]">
                  <dt>{k}</dt>
                  <dd className="text-right text-soft">{v}</dd>
                </div>
              ))}
            </dl>
          </details>
        ))}
      </div>
    </StageSection>
  );
}
