"use client";

import { useMemo, useState } from "react";
import { Command } from "cmdk";
import { ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { ProjectList } from "./ProjectList";
import { useSite } from "@/lib/store";
import { searchProjects } from "@/lib/search";

export function Launcher() {
  const [q, setQ] = useState("");
  const [value, setValue] = useState("");
  const open = useSite((s) => s.open);
  const items = useMemo(() => searchProjects(q).slice(0, 6), [q]);

  return (
    <section id="search" aria-labelledby="search-title" className="px-6 pt-28 pb-28 md:pt-40 md:pb-40">
      <div className="mx-auto max-w-[620px]">
        <h2 id="search-title" className="text-[clamp(32px,2.8vw,40px)]">Looking for one project?</h2>
        <p className="mt-4 text-[17px]">Type its name or its stack.</p>

        <Command
          shouldFilter={false}
          value={value}
          onValueChange={setValue}
          label="Search the projects"
          className="mt-8 rounded-[var(--radius)] bg-paper p-2"
        >
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const id = value || items[0]?.id;
              if (id) open(id);
            }}
          >
            <Command.Input
              value={q}
              onValueChange={setQ}
              placeholder="Rust, Godot, video editor…"
              className="h-12 min-w-0 flex-1 bg-transparent px-4 text-[17px] outline-none placeholder:text-soft"
            />
            <Button type="submit" size="round" aria-label="Open the selected project">
              <ArrowRight size={18} aria-hidden />
            </Button>
          </form>
          {q && (
            <div className="mt-2">
              <ProjectList items={items} onPick={open} />
            </div>
          )}
        </Command>

        <p className="mt-4 text-[13px] text-soft">
          Enter opens the project&apos;s window. Ctrl K works from anywhere on the page.
        </p>
      </div>
    </section>
  );
}
