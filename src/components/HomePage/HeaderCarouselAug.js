'use client';

/**
 * IndependenceHero
 * ----------------------------------------------------------------------------
 * Pixel recreation of the 79th Independence Day campaign banner.
 *
 * Design canvas .......... 1563 x 1006 px
 * Scaling ................ every dimension is authored in SOURCE PIXELS and
 *                          multiplied by the CSS var --u (1px === 0.0639795cqw)
 *                          so the whole composition scales perfectly with the
 *                          container at any width.
 * Layers ................. bg.jpg (scenery plate)  →  jets.png  →  chakra.png
 *                          →  robot.png  →  HTML/CSS UI
 * Motion ................. mouse + scroll parallax, floating robot, spinning
 *                          chakra, drifting jets, falling confetti, live
 *                          countdown to 15 August, staggered entrance reveals.
 *
 * Props
 *   offerDeadline  Date | string  target for the countdown (default: next 15 Aug)
 *   onPrimary      () => void     "Start My Journey" click
 *   onSecondary    () => void     "Book A Free Demo Class" click
 *   assetPath      string         folder holding bg.jpg / jets.png / chakra.png / robot.png
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import s from '@/styles/HomePage/IndependenceHero.module.css';
import { Barlow_Condensed } from 'next/font/google';
import { ChevronRight } from 'lucide-react';
/* ------------------------------------------------------------------ data -- */

const CONFETTI = [
  { l: 6.4, s: 9, c: '#f2a03c', d: 13, delay: 0 },
  { l: 12.1, s: 7, c: '#3f9d4a', d: 17, delay: 3.4 },
  { l: 33.5, s: 8, c: '#f4801f', d: 15, delay: 1.2 },
  { l: 41.8, s: 6, c: '#ffffff', d: 19, delay: 5.6 },
  { l: 52.3, s: 9, c: '#3f9d4a', d: 14, delay: 2.1 },
  { l: 60.4, s: 7, c: '#f2a03c', d: 18, delay: 7.3 },
  { l: 67.2, s: 8, c: '#ffffff', d: 16, delay: 4.4 },
  { l: 71.6, s: 6, c: '#f4801f', d: 21, delay: 0.8 },
  { l: 79.5, s: 9, c: '#3f9d4a', d: 15, delay: 6.2 },
  { l: 84.9, s: 7, c: '#f2a03c', d: 20, delay: 2.9 },
  { l: 89.3, s: 8, c: '#ffffff', d: 17, delay: 8.1 },
  { l: 94.6, s: 6, c: '#f4801f', d: 14, delay: 3.7 },
  { l: 22.8, s: 7, c: '#ffffff', d: 22, delay: 9.4 },
  { l: 47.1, s: 6, c: '#f2a03c', d: 19, delay: 11.2 },
];

/* --------------------------------------------------------------- helpers -- */

const CHAKRA_SPOKES = Array.from({ length: 24 }, (_, i) => ({
  x2: Number((20 + 17 * Math.cos((i * Math.PI) / 12)).toFixed(4)),
  y2: Number((20 + 17 * Math.sin((i * Math.PI) / 12)).toFixed(4)),
}));

const ChakraGlyph = () => (
  <svg
    viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      cx="20"
      cy="20"
      r="17"
      fill="none"
      stroke="#1b3f9c"
      strokeWidth="2.4"
    />

    <circle cx="20" cy="20" r="3.4" fill="#1b3f9c" />

    {CHAKRA_SPOKES.map(({ x2, y2 }, i) => (
      <line
        key={i}
        x1={20}
        y1={20}
        x2={x2}
        y2={y2}
        stroke="#1b3f9c"
        strokeWidth="1.1"
      />
    ))}
  </svg>
);

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

function nextIndependenceDay() {
  const now = new Date();
  const y = now.getFullYear();
  const target = new Date(y, 7, 15, 0, 0, 0);
  if (target.getTime() < now.getTime()) target.setFullYear(y + 1);
  return target;
}

function diffParts(target) {
  const ms = Math.max(0, target - Date.now());
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
  };
}

/* ------------------------------------------------------------- component -- */

export default function HeaderCarouselAug({
  offerDeadline,
  onOpenForm
}) {
  const rootRef = useRef(null);
  const bgRef = useRef(null);
  const jetsRef = useRef(null);
  const chakraRef = useRef(null);
  const robotRef = useRef(null);
  const leftRef = useRef(null);
  const cardsRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState(null);

  const target = useRef(
    offerDeadline ? new Date(offerDeadline) : nextIndependenceDay()
  ).current;

  /* countdown ------------------------------------------------------------- */
  useEffect(() => {
    setTime(diffParts(target));
    const id = setInterval(() => setTime(diffParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  /* entrance -------------------------------------------------------------- */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* parallax (mouse + scroll), rAF-batched -------------------------------- */
  const state = useRef({ mx: 0, my: 0, sy: 0, raf: 0 });

  const apply = useCallback(() => {
    state.current.raf = 0;
    const { mx, my, sy } = state.current;
    const set = (ref, kx, ky, ks, extra = '') => {
      if (ref.current) {
        ref.current.style.transform = `translate3d(${mx * kx}px, ${my * ky + sy * ks}px, 0) ${extra}`;
      }
    };
    set(bgRef, -8, -5, 0.06, 'scale(1.06)');
    set(jetsRef, 26, 16, -0.16);
    set(chakraRef, 18, 12, -0.1);
    set(robotRef, -14, -9, 0.12);
    set(leftRef, 7, 4, 0.04);
    set(cardsRef, -10, -6, 0.09);
  }, []);

  const schedule = useCallback(() => {
    if (!state.current.raf) state.current.raf = requestAnimationFrame(apply);
  }, [apply]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 900px)').matches) return;

    const el = rootRef.current;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      state.current.mx = (e.clientX - r.left) / r.width - 0.5;
      state.current.my = (e.clientY - r.top) / r.height - 0.5;
      state.current.mx *= 2;
      state.current.my *= 2;
      schedule();
    };
    const onLeave = () => {
      state.current.mx = 0;
      state.current.my = 0;
      schedule();
    };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      state.current.sy = -r.top;
      schedule();
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      if (state.current.raf) cancelAnimationFrame(state.current.raf);
    };
  }, [schedule]);

  /* ------------------------------------------------------------- blocks -- */

  const Headline = (
    <h1 className={s.headline}>
      <span className={`${s.hLine} ${s.h1} ${s.reveal} ${s.d2}`}>from "just applying" to</span>
      <span className={`${s.hLine} ${s.h2} ${s.reveal} ${s.d3}`}>
        <span className={s.lead}>" Just</span> <span className={s.tomorrow}>Got Hired"</span>
      </span>
      {/* <span className={`${s.hLine} ${s.h3} ${s.reveal} ${s.d4}`}>Build India&rsquo;s Future</span> */}
    </h1>
  );

  const Desc = (
    <div className={s.desc}>
      <p className="mt-4 text-[12px] xs:text-[16px] leading-relaxed text-gray-800">
        Real SAP, IT & HR training — taught by people who've done the job.
        Online or offline batches, built around your schedule.
      </p>
    </div>
  )

  const Divider = (
    <div className={`${s.divider} ${s.reveal} ${s.d5}`} aria-hidden="true">
      <span className={`${s.divLine} ${s.saffron}`} />
      <span className={s.divDot}><ChakraGlyph /></span>
      <span className={`${s.divLine} ${s.greenL}`} />
    </div>
  );


  // staricon
  const StarIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
    </svg>
  );

  // Button
  const Buttons = (
    <div className="flex flex-wrap items-center gap-3">
  <button
    className="rounded-lg border-1 border-blue-600 bg-[#593adc] text-white
               p-2 text-[8px]
               md:px-8 md:py-6 md:text-[12px]
               lg:px-7"
    onClick={() =>
      window.open(
        "https://wa.me/9004001938?text=Hi%20I'm%20interested%20in%20your%20courses.",
        "_blank"
      )
    }
  >
    Book a Free Demo Class
  </button>

  <button
    onClick={onOpenForm}
    className="inline-flex items-center justify-center gap-1
               rounded-lg border-1 border-[#593adc]
               text-[#593adc]
               hover:bg-[#593adc] hover:text-white transition
               p-2 text-[8px]
               md:px-8 md:py-6 md:md:text-[12px]
               lg:px-7"
  >
    Start My Journey
    <ChevronRight className="h-3 w-3 md:h-5 md:w-5" />
  </button>
</div>
  )

  /* --------------------------------------------------------------- view -- */

  return (
    <section
      ref={rootRef}
      className={`${s.hero} ${visible ? s.in : ''}`}
      aria-label="Celebrating India's 79th Independence Day"
    >
      {/* ---------- scenery ---------- */}
      <img
        ref={bgRef}
        className={`${s.layer} ${s.bg}`}
        src={`/bg.jpg`}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
      />

      <div className={s.confetti} aria-hidden="true">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className={s.flake}
            style={{
              left: `${c.l}%`,
              width: `calc(${c.s} * var(--u))`,
              height: `calc(${c.s * 1.5} * var(--u))`,
              background: c.c,
              animationDuration: `${c.d}s`,
              animationDelay: `-${c.delay}s`,
            }}
          />
        ))}
      </div>

      <img ref={jetsRef} className={s.jets} src={`/jets.png`} alt="" aria-hidden="true" />
      <img ref={chakraRef} className={s.chakra} src={`/Chakra.png`} alt="" aria-hidden="true" />

      {/* offer card */}
      <img className={`${s.offerCard} ${s.offerCardDesktop}`} src='/image.png' alt='offer card' />
      <img className={`${s.offerCard} ${s.offerCardMobile}`} src='/mobileOffer.png' alt='offer card' />

      <div className={s.beam} aria-hidden="true" />
      <div ref={robotRef} className={s.robotWrap}>
        <img className={s.robot} src={`/pngRobo.png`} alt="Friendly AI learning robot" />
      </div>
      <div className='w-[400px]'>
        <img className={s.cards} src={'/AICards.png'} alt='ai cards' />
      </div>
      {/* ---------- desktop composition (absolute, 1563x1006 canvas) ---------- */}
      <div className={s.desktop}>
        <div ref={leftRef} className={s.layer} style={{ pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            {/* white badge */}
            <div className={`${s.badge} inline-flex max-w-full items-center gap-1 rounded-full bg-white text-[10px] shadow-sm ring-1 ring-purple-100 mb-4 px-2 py-2.5 md:px-3 md:py-4`}>
              <StarIcon className="h-3 w-3 shrink-0 text-purple-600" />
              <span className="min-w-0 font-semibold text-gray-800 sm:text-sm">
                India&apos;s Leading SAP &amp; IT Training with AI Institute
              </span>
            </div>

            {/* heading */}
            {Headline}
            {Divider}
            {Desc}
            <div className={`flex items-center gap-3 ${s.consultBtn}`}>
              {Buttons}
            </div>
          </div>
        </div>

      </div>

      {/* ---------- mobile composition (stacked) ---------- */}
      <div className={s.mobile}>
        {Headline}
        {Divider}
        {Desc}

        <div className={`flex items-center gap-3 consultBtn`}>
          {Buttons}
        </div>
      </div>
    </section>
  );
}
