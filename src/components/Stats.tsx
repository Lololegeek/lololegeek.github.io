"use client";

import dynamic from "next/dynamic";
import NumberFlow from "@number-flow/react";
import { useInView } from "react-intersection-observer";
import { useReducedMotion } from "motion/react";
import { area, curveMonotoneX } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { sum, max } from "d3-array";
import { format, subWeeks } from "date-fns";
import { stats, fmt } from "@/lib/stats";

const Skyline = dynamic(() => import("./Skyline"), { ssr: false });

const weekly = stats.github.weeks.map((w) => sum(w));
const end = new Date(stats.generated);
const start = subWeeks(end, stats.github.weeks.length);

function Spark() {
  const x = scaleLinear().domain([0, weekly.length - 1]).range([0, 300]);
  const y = scaleLinear().domain([0, max(weekly) ?? 1]).range([80, 4]);
  const d = area<number>().x((_, i) => x(i)).y0(80).y1((v) => y(v)).curve(curveMonotoneX)(weekly) ?? "";
  return (
    <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="h-16 w-full" aria-hidden>
      <path d={d} fill="currentColor" opacity={0.85} />
    </svg>
  );
}

export function Stats() {
  const { ref, inView } = useInView({ rootMargin: "100px 0px" });
  const { ref: countRef, inView: counted } = useInView({ triggerOnce: true, threshold: 0.4 });
  const reduce = !!useReducedMotion();
  const show = reduce || counted;

  return (
    <section id="numbers" aria-labelledby="numbers-title" className="pt-28 md:pt-40">
      <div className="mx-3 flex flex-col justify-between gap-4 px-3 pb-10 md:flex-row md:items-end md:px-9">
        <h2 id="numbers-title" className="text-[clamp(32px,2.8vw,40px)]">The numbers so far</h2>
        <p className="tnum max-w-[52ch] text-[17px] md:text-right">
          {fmt(stats.commits)} commits, {fmt(stats.files)} source files, {stats.allLanguages} languages and{" "}
          {stats.github.publicRepos} public repositories, scanned on {format(end, "d MMMM yyyy")}.
        </p>
      </div>

      <div ref={countRef} className="grid grid-cols-2 lg:h-[min(66vw,100svh)] lg:grid-cols-3">
        <figure ref={ref} className="relative col-span-2 aspect-[4/3] bg-field lg:aspect-auto">
          <Skyline active={inView} reduce={reduce} />
          <figcaption className="absolute bottom-0 left-0 p-6 text-[15px] text-field-soft md:p-8">
            GitHub contributions, one column per day, {format(start, "MMM yyyy")} to {format(end, "MMM yyyy")}.
          </figcaption>
        </figure>

        <div className="col-span-2 grid grid-cols-2 lg:col-span-1 lg:grid-cols-1 lg:grid-rows-2">
          <div className="flex aspect-square flex-col justify-between bg-field-light p-7 lg:aspect-auto">
            <NumberFlow
              value={show ? stats.lines : 0}
              className="tnum text-[13vw] leading-none tracking-[-0.02em] lg:text-[clamp(56px,5.6vw,96px)]"
              format={{ useGrouping: true }}
              locales="en-US"
            />
            <p className="max-w-[24ch] text-[17px] leading-[1.4]">
              lines of code across {stats.projects} projects, counted file by file.
            </p>
          </div>
          <div className="flex aspect-square flex-col justify-between bg-steel p-7 lg:aspect-auto">
            <NumberFlow
              value={show ? stats.github.contributions : 0}
              className="tnum text-[13vw] leading-none tracking-[-0.02em] lg:text-[clamp(56px,5.6vw,96px)]"
              locales="en-US"
            />
            <div>
              <Spark />
              <p className="mt-4 max-w-[24ch] text-[17px] leading-[1.4]">
                contributions on GitHub in the last twelve months.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
