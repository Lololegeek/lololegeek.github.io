"use client";

import { useInView } from "react-intersection-observer";
import { groups, projects, type Project } from "@/data/projects";
import { useSite } from "@/lib/store";
import { stats } from "@/lib/stats";
import { StageSection } from "./StageSection";

export function Ledger() {
  return (
    <StageSection mode="project" projectId="nexolume" id="work" label="Work" className="px-6 py-24 md:px-12 md:py-32 lg:px-[clamp(48px,5vw,72px)]">
      <div className="max-w-[560px]">
        <h2 className="text-[clamp(24px,2vw,28px)] leading-[1.15]">The ones worth opening</h2>
        <p className="mt-4 max-w-[46ch] text-[17px]">
          Out of {stats.projects} folders on two disks, these {projects.length} are far enough along to show. Point at a
          row and its window comes up beside it.
        </p>

        <div className="ledger mt-8">
          {groups.map((g) => (
            <div key={g} className="mt-7 first:mt-0">
              <h3 className="py-2 text-[14px] leading-[1.4] tracking-normal text-soft">{g}</h3>
              <ul>
                {projects.filter((p) => p.group === g).map((p) => <Row key={p.id} project={p} />)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </StageSection>
  );
}

function Row({ project }: { project: Project }) {
  const setStage = useSite((s) => s.setStage);
  const open = useSite((s) => s.open);
  const { ref } = useInView({
    rootMargin: "-50% 0px -50% 0px",
    onChange: (inView) => inView && setStage("project", project.id),
  });
  const show = () => setStage("project", project.id);

  return (
    <li ref={ref}>
      <button
        type="button"
        onClick={() => open(project.id)}
        onMouseEnter={show}
        onFocus={show}
        className="ledger-row grid min-h-[52px] w-full grid-cols-[1fr_auto] items-center gap-x-4 py-2 text-left md:min-h-[44px] md:grid-cols-[55%_1fr_auto] md:py-0"
      >
        <span className="text-[16px] font-semibold md:font-normal">{project.name}</span>
        <span className="col-start-1 row-start-2 text-[13px] text-soft md:col-start-2 md:row-start-1 md:text-[14px]">
          {project.kind}
        </span>
        <span className="tnum row-span-2 text-right text-[14px] text-soft md:row-span-1">{project.year}</span>
      </button>
    </li>
  );
}
