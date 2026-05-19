import { galleryGroups, statsData } from "@/config/gallery";
import { Gallery } from "@/components/gallery";

export default function Home() {
  return (
    <div className="relative z-10 mx-auto max-w-[1480px] px-4 py-7 sm:px-5 sm:py-7">
      <section className="mb-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
          <div className="rounded-[34px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] backdrop-blur-lg shadow-[0_24px_80px_rgba(0,0,0,0.45)] p-[clamp(1.375rem,3vw,2.125rem)]">
            <p className="mb-4 text-xs uppercase tracking-[0.24em] font-bold text-[var(--accent-2)]">
              Vancouver short-term rental media deck
            </p>
            <h1 className="m-0 font-serif text-[clamp(3rem,6vw,5.9rem)] leading-[0.92] tracking-[-0.05em] max-w-[12ch] text-[var(--foreground)]">
              Photo frames for the Surrey property.
            </h1>
            <p className="mt-4.5 max-w-[68ch] text-[clamp(1rem,1.5vw,1.08rem)] leading-relaxed text-[var(--muted-foreground)]">
              A cinematic carousel for the uploaded condo and environment shots, designed for fast
              browsing on desktop and mobile. The gallery loads images from Cloudflare R2 using the
              flattened filenames.
            </p>
          </div>

          <Gallery groups={galleryGroups} stats={statsData} />
        </div>
      </section>

      <div className="mt-4.5 rounded-xl border border-[var(--line)] bg-[rgba(255,255,255,0.04)] px-4.5 py-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
        Images are loaded from Cloudflare R2 Object Storage. If you change where images are served
        from, update the <code className="text-[var(--foreground)] border-b border-[rgba(255,255,255,0.22)]">NEXT_PUBLIC_R2_PUBLIC_URL</code> environment variable.
      </div>
    </div>
  );
}
