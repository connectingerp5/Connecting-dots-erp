import Image from "next/image";
import dynamic from "next/dynamic";
import { Barlow_Condensed } from "next/font/google";

const ConsultationButton = dynamic(() => import("./ConsultationButton"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="h-11 w-40 rounded-xl bg-purple-200/40 animate-pulse"
    />
  ),
});

/* ---------- Inline SVG icons ---------- */
const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
  </svg>
);

/* ---------- Layered parallax blob background (mobile only) ----------
   Purely decorative, absolute + pointer-events-none, sits behind the
   mobile content (z-0) so it never interferes with layout or clicks.
   Different sizes/durations per blob so they drift out of sync. */
const ParallaxBlobs = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-0 overflow-hidden sm:hidden"
  >
    <span className="blob blob-a" />
    <span className="blob blob-b" />
    <span className="blob blob-c" />
    {/* <span className="blob blob-d" /> */}

    <style jsx>{`
      .blob {
        position: absolute;
        border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%;
        filter: blur(2px);
        will-change: transform;
      }
      .blob-a {
        width: 220px;
        height: 220px;
        top: -50px;
        left: -50px;
        background: #bfdbfe80;
        animation: blobFloatA 9s ease-in-out infinite;
      }
      .blob-b {
        width: 170px;
        height: 170px;
        top: 8%;
        right: -55px;
        background: #ddd6fe80;
        animation: blobFloatB 11s ease-in-out infinite;
      }
      .blob-c {
        width: 190px;
        height: 190px;
        bottom: -60px;
        left: 6%;
        background: #fbcfe880;
        animation: blobFloatC 8s ease-in-out infinite;
      }
      .blob-d {
        width: 150px;
        height: 150px;
        bottom: -30px;
        right: 10%;
        background: #c4b5fd80;
        animation: blobFloatD 10s ease-in-out infinite;
      }

      @keyframes blobFloatA {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(18px, 22px) scale(1.06); }
      }
      @keyframes blobFloatB {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-16px, 18px) scale(1.08); }
      }
      @keyframes blobFloatC {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(14px, -16px) scale(1.05); }
      }
      @keyframes blobFloatD {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-14px, -14px) scale(1.07); }
      }

      @media (prefers-reduced-motion: reduce) {
        .blob {
          animation: none !important;
        }
      }
    `}</style>
  </div>
);

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const heroBackgroundImage = "/new.png";

export default function CareerHeroSlide({ onOpenForm }) {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* ================================================================
        MOBILE-ONLY: no image here anymore — animated parallax blobs
        fill the background instead, content sits in normal flow above.
      ================================================================ */}
      <div className="relative sm:hidden bg-[#eaf5ff]">
        <ParallaxBlobs />

        <div className="relative z-10 px-4 pt-8 pb-8 xs:px-5 xs:pt-10">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 xs:px-3.5 xs:py-2 shadow-sm ring-1 ring-purple-100 backdrop-blur-sm">
            <StarIcon className="h-3.5 w-3.5 xs:h-4 xs:w-4 shrink-0 text-purple-600" />
            <span className="min-w-0 text-[11px] xs:text-xs font-semibold text-gray-800">
              India&apos;s Leading SAP &amp; IT Training with AI Institute
            </span>
          </div>

          <h1
            className={`${barlow.className} mt-5 text-[30px] xs:text-[36px] leading-[0.95] xs:leading-[0.9] font-extrabold uppercase tracking-[0.05em] text-[#1b3a6d]`}
          >
            From <span className="font-normal">&#x22;</span>Just applying&#x22;
            <br />
            <span>to</span>
            <br />
            <span className="bg-gradient-to-r from-[#ff9a3d] via-[#ff5b7b] to-[#b17dff] bg-clip-text text-transparent">
              <span className="font-normal">&#x22;</span>just got hired&#x22;
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-600 text-transparent bg-clip-text">
              TRAINING
            </span>
          </h1>

          <p className="mt-4 text-[14px] xs:text-[15px] leading-relaxed text-gray-700">
            Real SAP, IT & HR training — taught by people who've done the job.
            Online or offline batches, built around your schedule.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <ConsultationButton onOpenForm={onOpenForm} />
            <button className="rounded-xl border border-blue-600 px-3 py-2.5 capitalize text-[#1b3a6d] bg-white/70 backdrop-blur-sm">
              Book a free demo class
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================
        DESKTOP (sm+) — UNCHANGED: image with text overlaid on top of it.
      ================================================================ */}
      <div className="relative hidden w-full overflow-hidden sm:block sm:aspect-[16/9] lg:aspect-[14/9] xl:aspect-[2.4/1]">
        <Image
          src={heroBackgroundImage}
          alt="Stairs graphic showing SAP, AI, IT and HR training path"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 1920px"
          className="object-cover object-left"
        />

        <div className="absolute inset-0 z-10 mx-auto flex max-w-[1400px] items-center px-5 sm:px-8 lg:px-10">
          <div className="grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="relative z-10 max-w-2xl lg:col-span-5">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-2 text-xs shadow-sm ring-1 ring-purple-100 sm:px-4 mb-4">
                <StarIcon className="h-4 w-4 shrink-0 text-purple-600" />
                <span className="min-w-0 text-xs font-semibold text-gray-800 sm:text-sm">
                  India&apos;s Leading SAP &amp; IT Training with AI Institute
                </span>
              </div>

              <h1
                className={`${barlow.className} text-[36px] lg:text-[58px] xl:text-[65px] leading-[0.9] font-extrabold uppercase tracking-[0.05em] text-[#1b3a6d] heroHeading`}
              >
                From <span className="font-normal">&#x22;</span>Just applying&#x22;
                <br />
                <span>to</span>
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
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

              <p className="mt-4 max-w-md rounded-3xl py-2 md:text-md font-thin leading-relaxed text-[#1b3a6d] sm:mt-6 sm:text-lg">
                Real SAP, IT & HR training — taught by people who've done the
                job. Online or offline batches, built around your schedule.
              </p>

              <div className="mt-8 flex items-center justify-start gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
                <ConsultationButton onOpenForm={onOpenForm} />
                <button className="rounded-xl border-1 border-blue-600 px-3 py-2.5 capitalize text-[#1b3a6d] sm:w-auto sm:px-7 sm:py-3">
                  Book a free demo class
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}