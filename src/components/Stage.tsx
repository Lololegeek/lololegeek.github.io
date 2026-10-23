"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { byId, type Project } from "@/data/projects";
import { useSite } from "@/lib/store";
import { fmt } from "@/lib/stats";
import { LanguageChart } from "./LanguageChart";

/** The sticky half of the page. It shows the window of whatever the reading column is talking about. */
export function Stage() {
  const { mode, projectId } = useSite();
  const reduce = useReducedMotion();

  const project: Project | null = mode === "project" && projectId ? byId[projectId] : null;
  const key = mode === "languages" ? "languages" : project?.id ?? "intro";

  return (
    <div className="relative h-full overflow-hidden rounded-[var(--radius)] bg-field text-field-ink">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={key}
          className="absolute inset-0 flex flex-col"
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {mode === "languages" ? <LanguageChart /> : project ? <Window project={project} /> : <Intro />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Before the reader reaches a project there is no picture yet, only the name. */
function Intro() {
  return (
    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
      <h3 className="max-w-[12ch] text-[clamp(44px,5.2vw,88px)]">lololegeek</h3>
      <p className="mt-6 max-w-[40ch] text-[17px] leading-[1.5] text-field-soft">
        Projects, stats and stacks. Scroll to open each one.
      </p>
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
