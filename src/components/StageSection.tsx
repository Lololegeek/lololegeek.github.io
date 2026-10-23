"use client";

import { InView } from "react-intersection-observer";
import type { ReactNode } from "react";
import { useSite, type StageMode } from "@/lib/store";

/** Tells the stage what to show while this block holds the middle of the viewport. */
export function StageSection({ mode, projectId, children, className, id, label }: {
  mode: StageMode;
  projectId?: string;
  children: ReactNode;
  className?: string;
  id?: string;
  label?: string;
}) {
  const setStage = useSite((s) => s.setStage);
  return (
    <InView
      as="section"
      id={id}
      aria-label={label}
      className={className}
      rootMargin="-50% 0px -50% 0px"
      onChange={(inView) => {
        if (!inView) return;
        const s = useSite.getState();
        if (mode === "project" && s.mode === "project") return;
        setStage(mode, projectId ?? (mode === "project" ? s.projectId ?? "nexolume" : null));
      }}
    >
      {children}
    </InView>
  );
}
