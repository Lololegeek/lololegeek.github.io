"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "./Button";
import { useSite } from "@/lib/store";
import { byId } from "@/data/projects";
import { fmt } from "@/lib/stats";

export function ProjectDialog() {
  const openId = useSite((s) => s.openId);
  const open = useSite((s) => s.open);
  const p = openId ? byId[openId] : null;

  return (
    <Dialog.Root open={!!p} onOpenChange={(o) => !o && open(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay fixed inset-0 z-[var(--z-backdrop)] bg-ink/55" />
        {p && (
          <Dialog.Content className="sheet fixed inset-x-3 top-3 bottom-3 z-[var(--z-modal)] mx-auto flex max-w-[1200px] flex-col overflow-hidden rounded-[var(--radius)] bg-paper lg:flex-row">
            <div className="relative min-h-[34svh] flex-[1.6] bg-field">
              {p.shot ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.shot.src}
                  width={p.shot.w}
                  height={p.shot.h}
                  alt={p.shot.alt}
                  className="absolute inset-0 size-full object-contain p-4 md:p-8"
                />
              ) : (
                <p className="absolute inset-0 grid place-items-center p-8 text-center text-[clamp(40px,6vw,88px)] leading-[0.9] tracking-[-0.03em] text-field-ink">
                  {p.name}
                </p>
              )}
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6 md:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Dialog.Title className="text-[clamp(28px,2.4vw,36px)] leading-none tracking-[-0.02em]">
                    {p.name}
                  </Dialog.Title>
                  <p className="mt-2 text-[15px] text-soft">
                    {p.kind} · {p.year}
                  </p>
                </div>
                <Dialog.Close asChild>
                  <Button tone="plain" size="round" aria-label="Close">
                    <X size={18} aria-hidden />
                  </Button>
                </Dialog.Close>
              </div>

              <Tabs.Root defaultValue="overview" className="mt-8">
                <Tabs.List aria-label="Project details" className="inline-flex gap-1 rounded-full bg-surface p-1">
                  {["Overview", "Numbers"].map((t) => (
                    <Tabs.Trigger
                      key={t}
                      value={t.toLowerCase()}
                      className="h-9 rounded-full px-4 text-[14px] font-semibold data-[state=active]:bg-ink data-[state=active]:text-paper"
                    >
                      {t}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
                <Tabs.Content value="overview" className="mt-6 outline-none">
                  <Dialog.Description className="max-w-[46ch] text-[18px] leading-[1.55]">{p.blurb}</Dialog.Description>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <li key={s} className="rounded-full bg-surface px-3 py-1.5 text-[14px]">
                        {s}
                      </li>
                    ))}
                  </ul>
                </Tabs.Content>
                <Tabs.Content value="numbers" className="mt-6 outline-none">
                  <dl className="tnum grid grid-cols-2 gap-x-6 gap-y-5 text-[15px]">
                    <div>
                      <dt className="text-soft">Lines</dt>
                      <dd className="text-[28px]">{p.lines ? fmt(p.lines) : "Not counted"}</dd>
                    </div>
                    <div>
                      <dt className="text-soft">Commits</dt>
                      <dd className="text-[28px]">{p.commits ?? (p.privateRepo ? "Private" : "Local only")}</dd>
                    </div>
                    <div>
                      <dt className="text-soft">Main language</dt>
                      <dd className="text-[28px]">{p.stack[0]}</dd>
                    </div>
                    <div>
                      <dt className="text-soft">Year</dt>
                      <dd className="text-[28px]">{p.year}</dd>
                    </div>
                  </dl>
                </Tabs.Content>
              </Tabs.Root>

              {(p.repo || p.site || p.privateRepo) && (
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 items-center gap-2 bg-accent px-6 text-[15px] font-semibold text-accent-ink hover:bg-[oklch(0.38_0.07_167)]"
                    >
                      Source on GitHub <ArrowUpRight size={17} aria-hidden />
                    </a>
                  )}
                  {p.site && (
                    <a
                      href={p.site.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 items-center gap-2 bg-surface px-6 text-[15px] font-semibold hover:bg-ink hover:text-paper"
                    >
                      {p.site.label} <ArrowUpRight size={17} aria-hidden />
                    </a>
                  )}
                  {!p.repo && p.privateRepo && <p className="text-[15px] text-soft">Source in a private repository</p>}
                </div>
              )}
            </div>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
