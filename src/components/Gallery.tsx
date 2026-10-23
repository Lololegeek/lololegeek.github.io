"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { useSite } from "@/lib/store";
import { projects } from "@/data/projects";

const extra = [
  { src: "/shots/tycoon-room.webp", w: 1262, h: 650, alt: "Server Tycoon datacenter floor", id: "server-tycoon", caption: "Server Tycoon, the datacenter floor" },
  { src: "/shots/valombre-maps.webp", w: 752, h: 696, alt: "Valombre region maps", id: "valombre", caption: "Valombre, region maps" },
  { src: "/shots/valoria-jobs.webp", w: 1600, h: 900, alt: "Valoria jobs screen with the miner level and rewards", id: "valoria", caption: "Valoria RP, jobs and levels" },
  { src: "/shots/nexolume-site.webp", w: 1440, h: 900, alt: "The Nexolume website home page", id: "nexolume", caption: "Nexolume, its website" },
  { src: "/shots/copieca-mascot.webp", w: 740, h: 720, alt: "COPIE ÇA! menu mascot", id: "copieca", caption: "COPIE ÇA!, the menu" },
];

const slides = [
  ...projects.filter((p) => p.shot).map((p) => ({ ...p.shot!, id: p.id, caption: `${p.name}, ${p.kind.toLowerCase()}` })),
  ...extra,
];

export function Gallery() {
  const [ref, api] = useEmblaCarousel({ align: "start", dragFree: true, containScroll: "trimSnaps" });
  const [edge, setEdge] = useState({ prev: false, next: true });
  const open = useSite((s) => s.open);

  const sync = useCallback(() => {
    if (api) setEdge({ prev: api.canScrollPrev(), next: api.canScrollNext() });
  }, [api]);

  useEffect(() => {
    if (!api) return;
    sync();
    api.on("select", sync).on("reInit", sync).on("scroll", sync);
  }, [api, sync]);

  return (
    <section aria-labelledby="gallery-title" className="pt-28 md:pt-40">
      <div className="mx-3 flex items-end justify-between gap-6 px-3 pb-10 md:px-9">
        <div>
          <h2 id="gallery-title" className="text-[clamp(32px,2.8vw,40px)]">Screens from the work</h2>
          <p className="mt-4 max-w-[46ch] text-[17px]">
            Real captures, taken from the apps themselves. Some of them still speak French.
          </p>
        </div>
        <div className="hidden gap-2 md:flex">
          <Button tone="plain" size="round" aria-label="Previous screens" disabled={!edge.prev} onClick={() => api?.scrollPrev()}>
            <ArrowLeft size={18} aria-hidden />
          </Button>
          <Button tone="plain" size="round" aria-label="Next screens" disabled={!edge.next} onClick={() => api?.scrollNext()}>
            <ArrowRight size={18} aria-hidden />
          </Button>
        </div>
      </div>

      <div ref={ref} className="overflow-hidden px-3" role="region" aria-roledescription="carousel" aria-label="Project screens">
        <div className="flex gap-3">
          {slides.map((s) => (
            <figure key={s.src} className="min-w-0 shrink-0 basis-[86%] sm:basis-[60%] lg:basis-[42%]">
              <button
                type="button"
                onClick={() => open(s.id)}
                className="block aspect-[16/10] w-full overflow-hidden rounded-[var(--radius)] bg-field"
                aria-label={`Open ${s.caption}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  width={s.w}
                  height={s.h}
                  alt={s.alt}
                  loading="lazy"
                  draggable={false}
                  className="size-full object-contain p-3"
                />
              </button>
              <figcaption className="mt-3 px-1 text-[15px]">{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
