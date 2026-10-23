export function Letter() {
  return (
    <section id="letter" aria-labelledby="letter-title" className="px-6 pt-28 md:pt-40">
      <div className="mx-auto max-w-[520px]">
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-[15px] font-semibold text-paper"
          >
            L
          </span>
          <h2 id="letter-title" className="text-[22px] tracking-[-0.01em]">Why most of this is offline</h2>
        </div>
        <div className="mt-8 space-y-5 text-[18px] leading-[1.6]">
          <p>
            I build the tools I want to use and could not find: a replay recorder that does not ask for an account, a
            video editor without a watermark, an office suite that opens a file without phoning home.
          </p>
          <p>
            The rule I keep coming back to is that a program should still do its job when it{" "}
            <span className="marker">works with the network cable pulled out</span>. So models run on the GPU in the
            machine, documents stay on the disk, and games ship as one download.
          </p>
          <p>
            That rule pulled me toward native code. C++ and Qt for anything that touches video, C# and WinUI for Windows
            apps, Rust where speed matters, Java for Minecraft, Godot and raylib for games.
          </p>
          <p>
            Not everything here is finished. Some of it is a weekend that turned into a month. All of it taught me
            something, and the counts on this page are real.
          </p>
        </div>
        <p className="mt-10 text-[18px] font-semibold">Lolo</p>
        <p className="text-[15px] text-soft">Lololegeek on GitHub</p>
      </div>
    </section>
  );
}
