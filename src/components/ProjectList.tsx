"use client";

import { Command } from "cmdk";
import { CornerDownLeft } from "lucide-react";
import type { Project } from "@/data/projects";

/** The cmdk result list shared by the inline launcher and the Ctrl K palette. */
export function ProjectList({ items, onPick }: { items: Project[]; onPick: (id: string) => void }) {
  return (
    <Command.List className="max-h-[min(52svh,420px)] overflow-y-auto overscroll-contain">
      <Command.Empty className="px-4 py-6 text-[15px]">Nothing matches. Try a language, like Rust or C#.</Command.Empty>
      {items.map((p) => (
        <Command.Item
          key={p.id}
          value={p.id}
          onSelect={() => onPick(p.id)}
          className="group flex items-center justify-between gap-4 rounded-[8px] px-4 py-3"
        >
          <span className="min-w-0">
            <span className="block truncate text-[17px] font-semibold">{p.name}</span>
            <span className="block truncate text-[14px] text-soft">
              {p.kind} · {p.stack.join(", ")}
            </span>
          </span>
          <CornerDownLeft size={16} aria-hidden className="shrink-0 opacity-0 group-data-[selected=true]:opacity-100" />
        </Command.Item>
      ))}
    </Command.List>
  );
}
