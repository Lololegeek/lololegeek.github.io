"use client";

import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { ProjectList } from "./ProjectList";
import { useSite } from "@/lib/store";
import { searchProjects } from "@/lib/search";

export function CommandPalette() {
  const paletteOpen = useSite((s) => s.paletteOpen);
  const setPalette = useSite((s) => s.setPalette);
  const open = useSite((s) => s.open);
  const [q, setQ] = useState("");
  const items = useMemo(() => searchProjects(q), [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPalette(!useSite.getState().paletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPalette]);

  return (
    <Dialog.Root
      open={paletteOpen}
      onOpenChange={(o) => {
        setPalette(o);
        if (!o) setQ("");
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="overlay fixed inset-0 z-[var(--z-backdrop)] bg-ink/45" />
        <Dialog.Content className="sheet fixed top-[12svh] left-1/2 z-[var(--z-modal)] w-[min(640px,calc(100vw-24px))] -translate-x-1/2 rounded-[var(--radius)] bg-paper p-2">
          <Dialog.Title className="sr-only">Search the projects</Dialog.Title>
          <Dialog.Description className="sr-only">Type a project name, a kind of app or a language.</Dialog.Description>
          <Command shouldFilter={false} label="Search the projects">
            <div className="flex items-center gap-3 px-4">
              <Search size={18} aria-hidden />
              <Command.Input
                autoFocus
                value={q}
                onValueChange={setQ}
                placeholder="Search by name, kind or language"
                className="h-14 min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-soft"
              />
              <kbd className="text-[13px] text-soft">Esc</kbd>
            </div>
            <div className="mt-1">
              <ProjectList items={items} onPick={open} />
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
