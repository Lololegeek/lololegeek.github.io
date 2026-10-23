import { Toaster } from "sonner";
import { Hero } from "@/components/Hero";
import { Ledger } from "@/components/Ledger";
import { StackList } from "@/components/StackList";
import { Stage } from "@/components/Stage";
import { Stats } from "@/components/Stats";
import { Gallery } from "@/components/Gallery";
import { Letter } from "@/components/Letter";
import { Launcher } from "@/components/Launcher";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";
import { ProjectDialog } from "@/components/ProjectDialog";
import { SmoothScroll } from "@/components/SmoothScroll";

export default function Page() {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <SmoothScroll />
      <main id="main">
        <div className="grid gap-3 p-3 lg:grid-cols-2">
          <aside
            aria-label="Project preview"
            className="sticky top-0 z-[var(--z-sticky)] h-[42svh] lg:order-2 lg:top-3 lg:h-[calc(100svh-24px)]"
          >
            <Stage />
          </aside>
          <div className="min-w-0 lg:order-1">
            <Hero />
            <Ledger />
            <StackList />
          </div>
        </div>
        <Stats />
        <Gallery />
        <Letter />
        <Launcher />
      </main>
      <Footer />
      <CommandPalette />
      <ProjectDialog />
      <Toaster position="bottom-center" toastOptions={{ style: { zIndex: "var(--z-toast)" } }} />
    </>
  );
}
