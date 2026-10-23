"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/cn";
import { stats, fmt } from "@/lib/stats";

/** Alternating ink and ground bars, each one as wide as a language's share of all lines written. */
export function Ribbon({ className, labelled = false }: { className?: string; labelled?: boolean }) {
  const bars = stats.languages.map((l) => (
    <span
      key={l.name}
      data-bar
      style={{ flexGrow: l.lines }}
      aria-label={labelled ? `${l.name}: ${fmt(l.lines)} lines` : undefined}
    />
  ));
  if (!labelled) return <div className={cn("ribbon", className)} aria-hidden>{bars}</div>;

  return (
    <Tooltip.Provider delayDuration={80}>
      <div className={cn("ribbon", className)} role="img" aria-label="Lines of code by language">
        {stats.languages.map((l) => (
          <Tooltip.Root key={l.name}>
            <Tooltip.Trigger asChild>
              <span data-bar style={{ flexGrow: l.lines }} />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                sideOffset={6}
                className="tnum z-[var(--z-tooltip)] rounded-[6px] bg-ink px-3 py-2 text-[13px] text-paper"
              >
                {l.name} · {fmt(l.lines)} lines
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}
