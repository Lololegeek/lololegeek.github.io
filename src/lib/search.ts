import Fuse from "fuse.js";
import { projects } from "@/data/projects";

const fuse = new Fuse(projects, {
  keys: [
    { name: "name", weight: 3 },
    { name: "kind", weight: 2 },
    { name: "stack", weight: 2 },
    { name: "blurb", weight: 1 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
});

export const searchProjects = (q: string) => (q.trim() ? fuse.search(q).map((r) => r.item) : projects);
