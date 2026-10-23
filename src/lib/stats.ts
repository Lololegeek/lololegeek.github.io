import { z } from "zod";
import raw from "@/data/stats.json";

const Stats = z.object({
  allLanguages: z.number(),
  generated: z.string(),
  projects: z.number(),
  lines: z.number(),
  commits: z.number(),
  files: z.number(),
  years: z.record(z.string(), z.number()),
  languages: z.array(z.object({ name: z.string(), lines: z.number() })),
  deps: z.array(z.object({ name: z.string(), projects: z.number() })),
  github: z.object({
    contributions: z.number(),
    publicRepos: z.number(),
    since: z.string(),
    weeks: z.array(z.array(z.number())),
  }),
});

export const stats = Stats.parse(raw);

export const fmt = (n: number) => n.toLocaleString("en-US");

export const depCount = (name: string) => stats.deps.find((d) => d.name === name)?.projects;
