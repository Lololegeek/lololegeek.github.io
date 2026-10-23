"use client";

import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import useMeasure from "react-use-measure";
import { motion, useReducedMotion } from "motion/react";
import { stats, fmt } from "@/lib/stats";

/** The stage while the reader is in the stack: every line counted, by language. */
export function LanguageChart() {
  const [ref, { width }] = useMeasure();
  const reduce = useReducedMotion();
  const langs = stats.languages;
  const x = scaleLinear().domain([0, max(langs, (d) => d.lines) ?? 1]).range([0, Math.max(width - 8, 1)]);

  return (
    <div className="flex h-full flex-col justify-between p-8 md:p-12">
      <div>
        <p className="text-[15px] text-field-soft">Lines of code by language</p>
        <p className="tnum mt-2 text-[clamp(36px,3.6vw,56px)] leading-none tracking-[-0.02em]">
          {fmt(stats.lines)}
        </p>
      </div>
      <ul ref={ref} className="tnum flex flex-col gap-[10px] text-[15px]">
        {langs.map((l, i) => (
          <li key={l.name}>
            <div className="flex justify-between">
              <span>{l.name}</span>
              <span className="text-field-soft">{fmt(l.lines)}</span>
            </div>
            <motion.div
              className="mt-1 h-[6px] origin-left bg-field-ink"
              style={{ width: x(l.lines), opacity: l.name === "Other" ? 0.4 : 1 }}
              initial={{ scaleX: reduce ? 1 : 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: reduce ? 0 : 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
