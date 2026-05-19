import { galleryGroups, statsData } from "@/config/gallery";
import { Gallery } from "@/components/gallery";
import { InquiryForm } from "@/components/inquiry-form";

export default function Home() {
  return (
    <main className="shell">
      <section className="hero" aria-label="Property photo gallery">
        <div className="title-block">
          <p className="kicker">Vancouver short-term rental media deck</p>
          <h1>Photo frames for the Surrey property.</h1>
          <p className="lede">
            A cinematic carousel for the uploaded condo and environment shots, designed for fast
            browsing on desktop and mobile. The gallery loads images from Cloudflare R2 using the
            flattened filenames.
          </p>
          <div className="stats">
            {statsData.map((stat) => (
              <div key={stat.label} className="stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <Gallery groups={galleryGroups} />
      </section>

      <div className="footer-note">
        Images are loaded from Cloudflare R2 Object Storage. If you change where images are served
        from, update the NEXT_PUBLIC_R2_PUBLIC_URL environment variable.
      </div>

      <section className="mt-10 space-y-6">
        <div className="rounded-[34px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] backdrop-blur-lg shadow-[0_24px_80px_rgba(0,0,0,0.45)] p-6 sm:p-8">
          <p className="mb-4 text-xs uppercase tracking-[0.24em] font-bold text-[var(--primary)]">
            Contact
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-[var(--foreground)] m-0">
            William
          </h2>
          <a
            href="tel:+12369923846"
            className="inline-block mt-3 text-xl text-[var(--primary)] hover:opacity-80 transition-opacity"
          >
            236-992-3846
          </a>
        </div>

        <div className="rounded-[34px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] backdrop-blur-lg shadow-[0_24px_80px_rgba(0,0,0,0.45)] p-6 sm:p-8">
          <p className="mb-4 text-xs uppercase tracking-[0.24em] font-bold text-[var(--accent-2)]">
            Book a viewing
          </p>
          <h3 className="font-serif text-2xl tracking-tight text-[var(--foreground)] m-0 mb-6">
            Send us an inquiry
          </h3>
          <InquiryForm />
        </div>
      </section>
    </main>
  );
}
