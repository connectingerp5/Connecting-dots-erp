import Image from "next/image";
import dynamic from "next/dynamic";
import { Barlow_Condensed } from "next/font/google";
import TrustBar from "./TrustBar";
const ConsultationButton = dynamic(
  () => import("./ConsultationButton"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="h-11 w-40 rounded-xl bg-purple-200/40 animate-pulse"
      />
    ),
  }
);

/* ---------- Inline SVG icons (no extra deps needed) ---------- */

const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
  </svg>
);

/* ---------- Lavender orbital-ring background ----------
   Only rendered on lg+ (desktop), so it never costs mobile
   any paint/layout work. */
const OrbitBackground = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 600 600"
    fill="none"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    <g stroke="#a78bfa" strokeOpacity="0.9" strokeWidth="1.4" strokeDasharray="2 8" strokeLinecap="round">
      <ellipse cx="300" cy="300" rx="150" ry="120" transform="rotate(-25 300 300)" />
      <ellipse cx="300" cy="300" rx="220" ry="180" transform="rotate(-25 300 300)" />
      <ellipse cx="300" cy="300" rx="290" ry="235" transform="rotate(-25 300 300)" />
    </g>
    <g stroke="#c4b5fd" strokeOpacity="0.85" strokeWidth="1.2" fill="none">
      <ellipse cx="300" cy="300" rx="255" ry="205" transform="rotate(-25 300 300)" />
      <ellipse cx="300" cy="300" rx="185" ry="150" transform="rotate(-25 300 300)" />
    </g>
    <circle cx="150" cy="120" r="28" fill="#c4b5fd" fillOpacity="0.7" />
    <g fill="#8b5cf6">
      <circle cx="92" cy="300" r="4.5" />
      <circle cx="470" cy="150" r="3.5" fillOpacity="0.9" />
      <circle cx="520" cy="360" r="4" fillOpacity="0.85" />
      <circle cx="210" cy="500" r="3.5" fillOpacity="0.9" />
      <circle cx="120" cy="430" r="3" fillOpacity="0.8" />
    </g>
    <g fill="#a78bfa" fillOpacity="0.95">
      <path d="M540 90l5 10 10 5-10 5-5 10-5-10-10-5 10-5z" />
      <path d="M70 200l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" />
    </g>
  </svg>
);

// font for hero section
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

/* ---------- Data ---------- */

const heroBackgroundImage =
  "https://res.cloudinary.com/bropujss/image/upload/v1784808224/updated_heroSection_lflaw1.webp";

/* ---------- Component (Server Component — no "use client") ---------- */

export default function CareerHeroSlide({ onOpenForm }) {
  return (
    <>
      <section className="relative w-full bg-white min-h-[800px] xs:min-h-[520px] sm:min-h-[560px] md:min-h-[800px] lg:min-h-[820px] sm:bg-purple-50">
        {/* ================================================================
          IMAGE BLOCK
          Mobile: fluid aspect-ratio box (no fixed px height — scales
          cleanly across small/large phones instead of one hardcoded size)
          Desktop (sm+): absolute inset-0, exactly as before
      ================================================================ */}
        <div className="w-full overflow-hidden relative aspect-[3/2] xs:aspect-[4/3] sm:aspect-auto sm:absolute sm:inset-0 sm:h-full">
          <Image
            src={heroBackgroundImage}
            alt="Connecting Dots ERP building"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
            className="w-full -z-0 object-cover h-auto sm:object-cover object-bottom translate-y-[-18%]"
          />

          {/* ---------- MOBILE-ONLY: smooth white fade at bottom of image ---------- */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 xs:h-28 bg-gradient-to-b from-transparent via-white/70 to-white sm:hidden" />

          {/* ---------- MOBILE-ONLY: badge + heading overlaid on the image ---------- */}
          <div className="relative z-10 px-4 pt-6 xs:px-5 xs:pt-10 sm:hidden">
            {/* premium glass pill badge */}
            <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 xs:px-3.5 xs:py-2 shadow-[0_8px_24px_rgba(124,58,237,0.18)] ring-1 ring-purple-100 backdrop-blur-md">
              <StarIcon className="h-3.5 w-3.5 xs:h-4 xs:w-4 shrink-0 text-purple-600" />
              <span className="min-w-0 text-[11px] xs:text-xs font-semibold text-gray-800">
                India&apos;s Leading SAP &amp; IT Training with AI Institute
              </span>
            </div>

            {/* heading, with a subtle radial glow behind it */}
            <div className="relative mt-6 xs:mt-8">
              <h1
                className={`${barlow.className}
              text-[30px]
              xs:text-[40px]
              leading-[0.95]
              xs:leading-[0.9]
              font-extrabold
              uppercase
              tracking-[0.05em]
              text-white`}
              >
                From <span className="font-normal">&#x22;</span>Just applying&#x22;
                <br />
                <span>to</span>
                <br />
                <span className="bg-gradient-to-r from-[#ff9a3d] via-[#ff5b7b] to-[#b17dff] bg-clip-text text-transparent">
                  <span className="font-normal">&#x22;</span>just got hired&#x22;
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-600 text-transparent bg-clip-text">TRAINING</span>
              </h1>
            </div>
          </div>
        </div>

        {/* ================================================================
          MOBILE-ONLY: floating glass card
      ================================================================ */}
        <div className="relative z-20 mt-2 px-4 xs:px-5 sm:hidden">
          <div className="rounded-[22px] xs:rounded-[28px] border border-purple-200/60 bg-white/80 p-5 xs:p-6 shadow-[0_20px_55px_-12px_rgba(124,58,237,0.28)] backdrop-blur-xl">
            <p className="text-[14px] xs:text-[15px] leading-relaxed text-gray-700">
              For over{" "}
              <span className="font-bold text-purple-600">10+ Years</span> we&apos;ve
              helped professionals build successful careers through engaging
              instructor-led SAP &amp; AI training.
            </p>

            <div className="mt-5 xs:mt-6">
              <ConsultationButton onOpenForm={onOpenForm} />
            </div>
          </div>
        </div>

        {/* ---------------- spacer below the floating card on mobile ---------------- */}
        <div className="h-6 xs:h-8 sm:hidden" aria-hidden="true" />

        {/* ================================================================
          DESKTOP CONTENT BLOCK — UNCHANGED
      ================================================================ */}
        <div className="relative h-full z-10 mx-auto hidden max-w-[1400px] px-5 pb-8 pt-5 sm:block sm:px-8 sm:pb-0 sm:pt-12 lg:px-10 lg:pt-14">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            {/* ---------------- Left column ---------------- */}
            <div className="relative z-10 max-w-2xl lg:col-span-5">
              {/* badge */}
              <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-purple-100 sm:px-4 mb-5">
                <StarIcon className="h-4 w-4 shrink-0 text-purple-600" />
                <span className="min-w-0 text-xs font-semibold text-gray-800 sm:text-sm">
                  India&apos;s Leading SAP &amp; IT Training with AI Institute
                </span>
              </div>

              {/* heading */}
              <h1
                className={`${barlow.className}
              text-[40px]
              lg:text-[65px]
              leading-[0.9]
              font-extrabold
              uppercase
              tracking-[0.05em]
              text-white heroHeading`}
              >
                From <span className="font-normal">&#x22;</span>Just applying&#x22;
                <br />
                <span>to</span>
                <br />
                <span className="bg-gradient-to-r from-[#ff9a3d] via-[#ff5b7b] to-[#b17dff] bg-clip-text text-transparent">
                  <span className="font-normal">&#x22;</span>just got hired&#x22;
                </span>
                <br />
              </h1>

              <style jsx>{`
              .heroHeading {
                position: relative;
                display: inline-block;
              }

              .heroHeading::after {
                content: "";
                position: absolute;
                left: 0;
                bottom: -18px;
                width: 120px;
                height: 5px;
                border-radius: 999px;
                background: linear-gradient(
                  90deg,
                  #ff9f43 0%,
                  #ff5e62 50%,
                  #b16cea 100%
                );
              }
            `}</style>

              {/* sub copy */}
              <p className="mt-4 max-w-md rounded-3xl py-2 md:text-md font-thin leading-relaxed text-white sm:mt-6 sm:text-lg">
                Real SAP, IT & HR training — taught by people who've done the job. Online or offline batches, built around your schedule.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex justify-start items-center gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
                <ConsultationButton onOpenForm={onOpenForm} />
                <button className="py-2.5 px-3 border rounded-xl capitalize sm:w-auto sm:px-7 sm:py-3 text-white">Book a free demo class</button>
              </div>
            </div>

            {/* ---------------- Right column (building) ---------------- */}
            <div className="relative hidden lg:col-span-7 lg:block">
              {/* lavender orbital-ring background */}
              <OrbitBackground className="absolute left-1/2 top-1/2 -z-10 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2" />

              {/* soft radial glow behind building */}
              <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-purple-300/30 blur-3xl" />
            </div>
          </div>
        </div>

      </section>

      {/* <div className="relative z-20 w-full">
        <TrustBar />
      </div> */}
    </>
  );
}