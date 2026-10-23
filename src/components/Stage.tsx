"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { byId, reel, type Project } from "@/data/projects";
import { useSite } from "@/lib/store";
import { fmt } from "@/lib/stats";
import { LanguageChart } from "./LanguageChart";

/** The sticky half of the page. It shows the window of whatever the reading column is talking about. */
export function Stage() {
  const { mode, projectId } = useSite();
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (mode !== "reel" || reduce) return;
    let id: ReturnType<typeof setInterval> | undefined;
    const start = () => (id = setInterval(() => setTick((t) => t + 1), 5200));
    const stop = () => id && clearInterval(id);
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode, reduce]);

  const project: Project | null =
    mode === "reel" ? reel[tick % reel.length] : mode === "project" && projectId ? byId[projectId] : null;
  const key = mode === "languages" ? "languages" : project?.id ?? "none";
  const slow = mode === "reel";

  return (
    <div className="relative h-full overflow-hidden rounded-[var(--radius)] bg-field text-field-ink">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={key}
          className="absolute inset-0 flex flex-col"
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : slow ? 1.6 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {mode === "languages" ? <LanguageChart /> : project ? <Window project={project} /> : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Window({ project }: { project: Project }) {
  const shot = project.shot;
  return (
    <>
      <div className="relative min-h-0 flex-1">
        {shot ? (
          // The whole capture, never cropped: it sits on the field with room around it.
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shot.src}
              alt={shot.alt}
              width={shot.w}
              height={shot.h}
              className="h-auto max-h-full w-auto max-w-full rounded-[8px] object-contain"
            />
          </div>
        ) : (
          <Sheet project={project} />
        )}
      </div>
      <div className="flex items-baseline justify-between gap-6 bg-ink px-6 py-4 text-[15px]">
        <p>
          <span className="font-semibold">{project.name}</span>
          <span className="text-field-soft"> — {project.kind}</span>
        </p>
        <p className="tnum hidden shrink-0 text-field-soft sm:block">
          {project.stack.slice(0, 3).join(" · ")}
          {project.lines ? ` · ${fmt(project.lines)} lines` : ""}
        </p>
      </div>
    </>
  );
}

/** For projects with no capture: its name set large, with its numbers. */
function Sheet({ project }: { project: Project }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
      <p className="text-[15px] text-field-soft">{project.group}</p>
      <div>
        <h3 className="max-w-[12ch] text-[clamp(44px,5.2vw,88px)]">{project.name}</h3>
        <p className="mt-6 max-w-[40ch] text-[17px] leading-[1.5] text-field-soft">{project.blurb}</p>
      </div>
      <dl className="tnum grid grid-cols-3 gap-6 text-[15px]">
        <div>
          <dt className="text-field-soft">Lines</dt>
          <dd className="mt-1 text-[28px]">{project.lines ? fmt(project.lines) : "—"}</dd>
        </div>
        <div>
          <dt className="text-field-soft">Commits</dt>
          <dd className="mt-1 text-[28px]">{project.commits ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-field-soft">Main language</dt>
          <dd className="mt-1 text-[28px]">{project.stack[0]}</dd>
        </div>
      </dl>
    </div>
  );
}
