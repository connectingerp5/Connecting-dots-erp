"use client";

/**
 * TrainingProcessSection
 * — Outer wrapper (background, min-height) from the original chevron section.
 * — "— THE PROCESS / How it works." heading at the top.
 * — Inner content is the circuit-timeline "How it works" section, scaled
 *   down for desktop via a JS-measured, container-aware size.
 * — Step icons are lucide-react icons (ClipboardEdit, Users, Target,
 *   MessagesSquare, TrendingUp, Briefcase).
 * — Brand logo is loaded from Cloudinary (Connecting_Logo_New_skvsup_ohmdgr.webp).
 *   Since it's an external URL, add "res.cloudinary.com" to the
 *   images.domains (or remotePatterns) list in next.config.js, or next/image
 *   will refuse to optimize it.
 * — On mobile, the entire brand/logo block is hidden, and each step row
 *   fades/slides in the first time it scrolls into view, with the connector
 *   line filling in progressively alongside it.
 */

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ClipboardEdit, Users, Target, MessagesSquare, TrendingUp, Briefcase } from "lucide-react";
// import BackgroundAnimation from "@/components/Common/BackgroundAnimation";
import { Barlow_Condensed } from "next/font/google";


const STEPS = [
    {
        num: "01",
        title: "Enroll",
        desc: "Start your journey by enrolling in our industry-focused training programs.",
        color: "#8b2fd6",
        grad: ["#a855f7", "#6d28d9"],
        icon: <ClipboardEdit strokeWidth={1.8} />,
    },
    {
        num: "02",
        title: "Corporate Training",
        desc: "Gain real-world insights through corporate training led by industry experts.",
        color: "#2f6bf7",
        grad: ["#3b82f6", "#1d4ed8"],
        icon: <Users strokeWidth={1.8} />,
    },
    {
        num: "03",
        title: "Real-Time Projects Scenario",
        desc: "Work on live projects and real-time scenarios to build practical experience.",
        color: "#10b981",
        grad: ["#34d399", "#059669"],
        icon: <Target strokeWidth={1.8} />,
    },
    {
        num: "04",
        title: "Interview Preparation",
        desc: "Prepare with mock interviews, aptitude tests and soft skills training.",
        color: "#f97316",
        grad: ["#fb923c", "#ea580c"],
        icon: <MessagesSquare strokeWidth={1.8} />,
    },
    {
        num: "05",
        title: "Experience Alteration",
        desc: "Continuous feedback and performance enhancement to make you industry-ready.",
        color: "#ec2f79",
        grad: ["#f472b6", "#db2777"],
        icon: <TrendingUp strokeWidth={1.8} />,
    },
    {
        num: "06",
        title: "Job Assistance",
        desc: "Get dedicated placement support and connect with top hiring companies.",
        color: "#7c3aed",
        grad: ["#a855f7", "#6d28d9"],
        icon: <Briefcase strokeWidth={1.8} />,
    },
];

const barlow = Barlow_Condensed({
    subsets: ["latin"],
    weight: ["700", "800"],
});

const ROW_Y = [118, 266, 414, 562, 710, 858];
const HUB = { x: 1070, y: 476 };

const TRACES = [
    "M756 118 H940 l40 40 V406 l40 40 H1028",
    "M756 266 H890 l40 40 V422 l40 40 H1028",
    "M756 414 H882 l56 56 H1028",
    "M756 562 H876 l80 -80 H1028",
    "M756 710 H890 l40 -40 V530 l40 -40 H1028",
    "M756 858 H940 l40 -40 V546 l40 -40 H1028",
];

const PORTS = [446, 462, 470, 482, 490, 506];
const BUS_X = 1028;

const TRACE_DOTS = [
    [980, 158, 0], [980, 406, 0],
    [930, 306, 1], [930, 422, 1],
    [938, 470, 2],
    [956, 482, 3],
    [930, 670, 4], [930, 530, 4],
    [980, 818, 5], [980, 546, 5],
];

const COMPANIONS = [
    { d: "M850 104 H952 l40 40 V392", c: "#8b2fd6" },
    { d: "M880 252 H902 l40 40 V410", c: "#2f6bf7" },
    { d: "M880 400 H894 l56 56", c: "#10b981" },
    { d: "M862 548 H876 l60 -60", c: "#f97316" },
    { d: "M880 724 H902 l40 -40 V542", c: "#ec2f79" },
    { d: "M850 872 H952 l40 -40 V584", c: "#7c3aed" },
];

const COMPANION_PADS = [
    [992, 392, "#8b2fd6"],
    [942, 410, "#2f6bf7"],
    [950, 456, "#10b981"],
    [936, 488, "#f97316"],
    [942, 542, "#ec2f79"],
    [992, 584, "#7c3aed"],
];

function Chevrons({ y, color }) {
    return (
        <g stroke={color} strokeWidth={3} fill="none">
            <circle cx={686} cy={y} r={8} fill="#fff" />
            <path d={`M712 ${y - 10} l12 10 -12 10 M730 ${y - 10} l12 10 -12 10`} />
        </g>
    );
}

export default function TrainingProcessSection() {
    const rootRef = useRef(null);
    const svgRef = useRef(null);
    const mobileItemRefs = useRef([]);
    const stageScalerRef = useRef(null);

    // Desktop diagram width (design canvas is 1536 wide).
    const DESIGN_W = 1536;
    const DESIGN_H = 1024;
    // Sensible default so nothing flashes at full size before the first
    // measurement lands (matches the ~1180px cap used below).
    const [scale, setScale] = useState(1180 / DESIGN_W);

    // Mobile progress line: how many step rows have been scrolled into view.
    const [revealCount, setRevealCount] = useState(0);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        if (typeof IntersectionObserver === "undefined") {
            el.classList.add("cd-live");
            return;
        }
        const io = new IntersectionObserver(
            ([e]) => el.classList.toggle("cd-live", e.isIntersecting),
            { rootMargin: "100px" }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Measure the scaler's actual rendered width and scale the fixed-size
    // diagram to fit it exactly — robust regardless of parent layout
    // (flex/grid ancestors can break CSS container-query sizing, so we
    // measure directly instead of relying on cqw units).
    useEffect(() => {
        const el = stageScalerRef.current;
        if (!el) return;

        const update = () => {
            const width = el.offsetWidth;
            if (width > 0) setScale(width / DESIGN_W);
        };

        update();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", update);
            return () => window.removeEventListener("resize", update);
        }
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Mobile step rows: reveal one-by-one as each scrolls into view, and grow
    // the connecting progress line to match.
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") {
            mobileItemRefs.current.forEach((el) => el && el.classList.add("cd-m-visible"));
            setRevealCount(STEPS.length);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("cd-m-visible");
                        const idx = Number(entry.target.dataset.index);
                        setRevealCount((prev) => Math.max(prev, idx + 1));
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
        );
        mobileItemRefs.current.forEach((el) => el && io.observe(el));
        return () => io.disconnect();
    }, []);

    const setHot = (i) => {
        const svg = svgRef.current;
        if (!svg) return;
        svg.classList.toggle("cd-hovering", i !== null);
        svg.querySelectorAll(".cd-trace").forEach((t, k) => {
            t.classList.toggle("cd-hot", k === i);
        });
    };

    return (
        <div
            id="chevron-area"
            className="chevron-root overflow-visible flex items-center justify-center relative left-1/2 -translate-x-1/2 w-[100vw] "
            style={{ contain: "layout style paint" }}
        >

            <div className="max-w-[1800px] w-full mx-auto">
                {/* ---------- circuit-timeline section ---------- */}
                <section
                    ref={rootRef}
                    className="cd-process"
                    aria-label="How Connecting Dots ERP works"
                >
                    {/* Section heading */}
                    <div className={`cd-heading ${barlow.className}`}>
                        <h2 className={`cd-heading-title ${barlow.className}`}>
                            How it <span className="cd-heading-accent">works</span>
                        </h2>
                        <span className="cd-heading-underline" aria-hidden />
                    </div>

                    <div className="cd-desktop-shrink">
                        <div
                            ref={stageScalerRef}
                            className="cd-stage-wrap"
                            style={{ height: `${DESIGN_H * scale}px` }}
                        >
                            <div className="cd-stage" style={{ transform: `scale(${scale})` }}>
                                <svg ref={svgRef} className="cd-circuit" viewBox="0 0 1536 1024" fill="none" aria-hidden>
                                    <defs>
                                        <radialGradient id="cd-hubGlow" cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity=".35" />
                                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                                        </radialGradient>
                                        <linearGradient id="cd-hubRing" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#8b2fd6" />
                                            <stop offset="100%" stopColor="#2f6bf7" />
                                        </linearGradient>
                                    </defs>

                                    <g stroke="#cfcdec" strokeWidth={1.5} opacity=".7">
                                        <path d="M60 950 h120 l40 40 h160" />
                                        <path d="M40 990 h200 l30 -30 h120" />
                                        <path d="M1210 300 l60 -60 h90" />
                                        <path d="M1490 420 v80 l-30 30" />
                                    </g>
                                    <g fill="#cfcdec">
                                        <circle cx="180" cy="950" r="4" /><circle cx="380" cy="990" r="4" />
                                        <circle cx="240" cy="990" r="3" /><circle cx="1270" cy="240" r="4" />
                                        <circle cx="1490" cy="420" r="4" />
                                    </g>

                                    <g stroke="#d7d5ee" strokeWidth={2} opacity=".8" fill="none">
                                        <path d="M1050 1024 C 1150 940, 1330 980, 1536 880" />
                                        <path d="M1100 1024 C 1200 960, 1380 1000, 1536 920" />
                                        <path d="M1160 1024 C 1260 980, 1420 1020, 1536 960" />
                                    </g>

                                    {TRACES.map((d, i) => {
                                        const dur = [3.4, 3.0, 2.4, 2.4, 3.0, 3.4][i];
                                        const delay = -(i * 0.55);
                                        return (
                                            <g key={i} className="cd-trace" fill="none">
                                                <path d={d} stroke={STEPS[i].color} strokeWidth={9} opacity={0.1} strokeLinecap="round" strokeLinejoin="round" />
                                                <path d={d} stroke={STEPS[i].color} strokeWidth={2.5} opacity={0.3} strokeLinecap="round" strokeLinejoin="round" />
                                                <path className="cd-hi" d={d} stroke={STEPS[i].color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={0} />
                                                <path
                                                    className="cd-flow"
                                                    d={d}
                                                    stroke={STEPS[i].color}
                                                    strokeWidth={3.5}
                                                    style={{ animationDelay: `${delay}s` }}
                                                />
                                                <circle className="cd-pulse" r={5.5} fill={STEPS[i].color} opacity={0.9}>
                                                    <animateMotion keyPoints="1;0" keyTimes="0;1" calcMode="linear" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={d} />
                                                </circle>
                                            </g>
                                        );
                                    })}
                                    {TRACE_DOTS.map(([x, y, i], k) => (
                                        <g key={k}>
                                            <circle cx={x} cy={y} r={8} fill={STEPS[i].color} opacity={0.18} />
                                            <circle cx={x} cy={y} r={4.5} fill="#fff" stroke={STEPS[i].color} strokeWidth={2.5} />
                                        </g>
                                    ))}

                                    <g strokeWidth={1.5} opacity={0.5} fill="none" strokeLinejoin="round">
                                        {COMPANIONS.map((t, k) => (
                                            <path key={k} d={t.d} stroke={t.c} />
                                        ))}
                                    </g>
                                    <g opacity={0.55}>
                                        {COMPANION_PADS.map(([x, y, c], k) => (
                                            <circle key={k} cx={x} cy={y} r={3.5} fill={c} />
                                        ))}
                                    </g>

                                    <path d={`M${BUS_X} ${PORTS[0]} V${PORTS[5]}`} stroke="#8b5cf6" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
                                    {PORTS.map((y, i) => (
                                        <circle key={i} cx={BUS_X} cy={y} r={4} fill="#fff" stroke={STEPS[i].color} strokeWidth={2.5} />
                                    ))}
                                    <path d={`M${BUS_X} 476 H1040`} stroke="#6d28d9" strokeWidth={4} />

                                    <circle className="cd-hubring" cx={HUB.x} cy={HUB.y} r={70} fill="url(#cd-hubGlow)" />
                                    <circle cx={HUB.x} cy={HUB.y} r={44} fill="none" stroke="#b9a7f2" strokeWidth={1.5} strokeDasharray="3 7" className="cd-hubspin" />
                                    <circle cx={HUB.x} cy={HUB.y} r={32} fill="#fff" stroke="#e4e1f6" strokeWidth={2} />
                                    <circle cx={HUB.x} cy={HUB.y} r={20} fill="none" stroke="url(#cd-hubRing)" strokeWidth={10} />
                                    <circle cx={HUB.x} cy={HUB.y} r={6} fill="#6d28d9" />
                                    <path d={`M${HUB.x + 32} ${HUB.y} h54`} stroke="#2f6bf7" strokeWidth={3} strokeLinecap="round" />
                                    <circle cx={HUB.x + 88} cy={HUB.y} r={5} fill="#2f6bf7" />

                                    {ROW_Y.map((y, i) => (
                                        <Chevrons key={i} y={y} color={STEPS[i].color} />
                                    ))}
                                </svg>

                                <div className="cd-dots" aria-hidden>
                                    {Array.from({ length: 12 }).map((_, i) => <i key={i} />)}
                                </div>

                                {STEPS.map((s, i) => (
                                    <div
                                        key={s.num}
                                        className="cd-row"
                                        onMouseEnter={() => setHot(i)}
                                        onMouseLeave={() => setHot(null)}
                                        style={
                                            {
                                                top: `${ROW_Y[i] - 58}px`,
                                                "--c": s.color,
                                                "--c1": s.grad[0],
                                                "--c2": s.grad[1],
                                            }
                                        }
                                    >
                                        <div className="cd-node"><span /></div>
                                        <div className="cd-stem" />
                                        <div className="cd-badge">{s.icon}</div>
                                        <div className="cd-card">
                                            <div className="cd-head">
                                                <span className="cd-num">{s.num}</span>
                                                <h3>{s.title}</h3>
                                            </div>
                                            <p>{s.desc}</p>
                                            <div className="cd-cicon">{s.icon}</div>
                                        </div>
                                    </div>
                                ))}

                                <div className="cd-brand">
                                    <Image
                                        src="https://res.cloudinary.com/bropujss/image/upload/v1783687480/Connecting_Logo_New_skvsup_ohmdgr.webp"
                                        alt="Connecting Dots ERP"
                                        width={220}
                                        height={220}
                                        className="cd-mark-img"
                                    />
                                    <h2>
                                        CONNECTING<br />DOTS <span className="cd-erp">ERP</span>
                                    </h2>
                                    <div className="cd-tag">
                                        CONNECTING OPPORTUNITIES,<br />DELIVERING EXCELLENCE
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ---------- mobile stacked timeline (shown under 768px) ---------- */}
                    {/* Brand/logo block intentionally omitted on mobile per request. */}
                    <div className="cd-mobile">
                        <div className="cd-m-timeline">
                            <div className="cd-m-track" aria-hidden>
                                <div
                                    className="cd-m-track-fill"
                                    style={{
                                        clipPath: `inset(0 0 ${100 - (revealCount / STEPS.length) * 100}% 0)`,
                                    }}
                                />
                            </div>
                            <ol className="cd-m-list">
                                {STEPS.map((s, i) => (
                                    <li
                                        key={s.num}
                                        ref={(el) => {
                                            mobileItemRefs.current[i] = el;
                                            if (el) el.dataset.index = i;
                                        }}
                                        className="cd-m-item"
                                        style={{ "--c": s.color, "--c1": s.grad[0], "--c2": s.grad[1] }}
                                    >
                                        <div className="cd-m-badge">{s.icon}</div>
                                        <div className="cd-m-card">
                                            <div className="cd-head">
                                                <span className="cd-num">{s.num}</span>
                                                <h3>{s.title}</h3>
                                            </div>
                                            <p>{s.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <style jsx>{`
          .cd-process {
            background: linear-gradient(135deg, #ececf9 0%, #e7e9f7 50%, #eceaf8 100%);
            font-family: "Nunito", "Segoe UI", system-ui, -apple-system, sans-serif;
            overflow: hidden;
            padding-top: 8px;
          }

          /* ---- section heading ---- */
        .cd-heading {
                max-width: 1180px;
                margin: 0 auto;
                text-align: center;
                padding: 40px 40px 8px;
        }
        .cd-heading-title {
                margin: 0;
                font-weight: 800;
                font-size: 40px;
                line-height: 1.15;
                color: #0f172a;
        }
        .cd-heading-accent {
                color: #2b5cff;
        }
        .cd-heading-underline {
                display: block;
                width: 72px;
                height: 4px;
                border-radius: 2px;
                background: #2b5cff;
                margin: 16px auto 0;
        }
        .cd-heading-label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #2b5cff;
        }
          .cd-heading-dash {
            width: 22px;
            height: 2px;
            background: #2b5cff;
            display: inline-block;
          }
          .cd-heading-title {
            margin: 10px 0 0;
            font-family: Georgia, "Times New Roman", serif;
            font-weight: 800;
            font-size: 40px;
            line-height: 1.1;
            color: #101426;
          }

          /* ---- desktop size cap (shrinks the whole stage proportionally) ---- */
          .cd-desktop-shrink {
            max-width: 1180px;
            margin: 0 auto;
          }

          .cd-stage-wrap {
            position: relative;
            width: 100%;
            overflow: hidden;
          }
          .cd-stage {
            position: relative;
            width: 1536px;
            height: 1024px;
            transform-origin: top left;
          }

          .cd-circuit { position: absolute; inset: 0; pointer-events: none; }

          .cd-circuit :global(.cd-flow) {
            stroke-dasharray: 14 226;
            stroke-linecap: round;
            animation: cd-flowmove 3.2s linear infinite;
            animation-play-state: paused;
          }
          .cd-live .cd-circuit :global(.cd-flow) { animation-play-state: running; }

          .cd-circuit :global(.cd-trace) { transition: opacity 0.2s linear; }
          .cd-circuit.cd-hovering :global(.cd-trace) { opacity: 0.35; }
          .cd-circuit.cd-hovering :global(.cd-trace.cd-hot) { opacity: 1; }
          .cd-circuit :global(.cd-hi) { transition: opacity 0.2s linear; }
          .cd-circuit :global(.cd-trace.cd-hot .cd-hi) { opacity: 0.55; }
          .cd-circuit :global(.cd-pulse) { visibility: hidden; }
          .cd-live .cd-circuit :global(.cd-pulse) { visibility: visible; }
          @keyframes cd-flowmove {
            to { stroke-dashoffset: 240; }
          }
          .cd-circuit :global(.cd-hubring) {
            animation: cd-hubpulse 2.4s ease-in-out infinite;
            animation-play-state: paused;
            transform-origin: 1070px 476px;
          }
          .cd-live .cd-circuit :global(.cd-hubring) { animation-play-state: running; }
          @keyframes cd-hubpulse {
            0%, 100% { opacity: 0.35; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.12); }
          }
          .cd-circuit :global(.cd-hubspin) {
            animation: cd-hubspin 14s linear infinite;
            animation-play-state: paused;
            transform-origin: 1070px 476px;
          }
          .cd-live .cd-circuit :global(.cd-hubspin) { animation-play-state: running; }
          @keyframes cd-hubspin { to { transform: rotate(360deg); } }
          @media (prefers-reduced-motion: reduce) {
            .cd-circuit :global(.cd-flow),
            .cd-circuit :global(.cd-hubring) { animation: none; }
          }

          .cd-dots {
            position: absolute; top: 34px; right: 250px;
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
          }
          .cd-dots i { width: 6px; height: 6px; border-radius: 50%; background: #c9c6ea; display: block; }

          .cd-row { position: absolute; left: 40px; width: 640px; height: 116px; cursor: default; }
          .cd-node {
            position: absolute; left: 8px; top: 50%; transform: translateY(-50%);
            width: 36px; height: 36px; border-radius: 50%;
            background: #fff; box-shadow: 0 4px 12px rgba(80, 60, 180, 0.18);
            display: flex; align-items: center; justify-content: center;
          }
          .cd-node span {
            width: 16px; height: 16px; border-radius: 50%;
            border: 5px solid var(--c); background: #fff; display: block;
          }
          .cd-stem {
            position: absolute; left: 44px; top: 50%; width: 48px; height: 3px;
            background: var(--c); transform: translateY(-50%);
          }
          .cd-badge {
            position: absolute; left: 82px; top: 50%; transform: translateY(-50%);
            width: 98px; height: 98px; border-radius: 50%;
            background: linear-gradient(135deg, var(--c1), var(--c2));
            box-shadow: 0 0 0 8px #fff, 0 10px 26px rgba(80, 60, 180, 0.28);
            display: flex; align-items: center; justify-content: center; z-index: 3;
          }
          .cd-badge :global(svg) { width: 44px; height: 44px; stroke: #fff; }
          .cd-card {
            position: absolute; left: 118px; top: 0; right: 0; height: 116px;
            background: #fff; border-radius: 26px;
            box-shadow: 0 14px 34px rgba(90, 70, 190, 0.13), 0 2px 6px rgba(90, 70, 190, 0.06);
            padding: 18px 88px 16px 84px;
            display: flex; flex-direction: column; justify-content: center;
            transition: transform 0.25s ease;
          }
          .cd-card::after {
            content: ""; position: absolute; inset: 0; border-radius: 26px;
            box-shadow: 0 22px 44px rgba(90, 70, 190, 0.2), 0 4px 10px rgba(90, 70, 190, 0.08);
            opacity: 0; transition: opacity 0.25s ease; pointer-events: none;
          }
          .cd-row:hover .cd-card { transform: translateY(-4px); }
          .cd-row:hover .cd-card::after { opacity: 1; }
          .cd-badge { transition: transform 0.25s ease; }
          .cd-row:hover .cd-badge { transform: translateY(-50%) scale(1.07); }
          .cd-head { display: flex; align-items: baseline; gap: 14px; margin-bottom: 6px; }
          .cd-num { font-size: 26px; font-weight: 800; color: var(--c); letter-spacing: 0.5px; }
          .cd-head h3 { font-size: 21px; font-weight: 800; color: #1e2340; margin: 0; }
          .cd-card p { font-size: 15px; line-height: 1.45; color: #5b6178; max-width: 400px; margin: 0; }
          .cd-cicon { position: absolute; right: 26px; top: 50%; transform: translateY(-50%); }
          .cd-cicon :global(svg) { width: 42px; height: 42px; stroke: var(--c); }

          .cd-brand { position: absolute; left: 1150px; top: 340px; width: 320px; text-align: center; }
          .cd-brand :global(.cd-mark-img) { width: 190px; height: 190px; margin: 0 auto 26px; display: block; object-fit: contain; }
          .cd-brand h2 {
            font-size: 36px; line-height: 1.15; font-weight: 900;
            color: #101426; letter-spacing: 0.5px; margin: 0;
          }
          .cd-erp {
            background: linear-gradient(90deg, #7b2ff7, #2f6bf7);
            -webkit-background-clip: text; background-clip: text; color: transparent;
          }
          .cd-tag {
            margin-top: 14px; font-size: 12.5px; font-weight: 700;
            letter-spacing: 2.6px; color: #3a4060;
          }

          /* ---- mobile stacked timeline ---- */
          .cd-mobile { display: none; }
          @media (max-width: 768px) {
            .cd-desktop-shrink { display: none; }
            .cd-heading { padding: 28px 20px 4px; }
            .cd-heading-title { font-size: 26px; }
            .cd-mobile { display: block; padding: 24px 20px 48px; }
            .cd-m-timeline { position: relative; }
            .cd-m-list {
              list-style: none; margin: 0; padding: 0;
              position: relative;
            }
            /* Base (unfilled) track — always visible, faint, marks the full path. */
            .cd-m-track {
              position: absolute; left: 31px; top: 8px; bottom: 8px;
              width: 3px; border-radius: 2px;
              background: linear-gradient(180deg, #8b2fd6, #2f6bf7, #10b981, #f97316, #ec2f79, #7c3aed);
              opacity: 0.18;
              overflow: hidden;
            }
            /* Progress fill — same gradient, same position, revealed from the
               top down via clip-path as steps scroll into view, so segments
               "load in" one at a time instead of showing the whole line at once. */
            .cd-m-track-fill {
              position: absolute; inset: 0;
              background: linear-gradient(180deg, #8b2fd6, #2f6bf7, #10b981, #f97316, #ec2f79, #7c3aed);
              transition: clip-path 0.6s ease;
            }
            .cd-m-item {
              position: relative; display: flex; gap: 16px; align-items: flex-start;
              padding: 0 0 26px 0;
              opacity: 0;
              transform: translateX(-24px);
              transition: opacity 0.5s ease, transform 0.5s ease;
            }
            .cd-m-item.cd-m-visible {
              opacity: 1;
              transform: translateX(0);
            }
            .cd-m-badge {
              flex: none; width: 64px; height: 64px; border-radius: 50%;
              background: linear-gradient(135deg, var(--c1), var(--c2));
              box-shadow: 0 0 0 5px #fff, 0 8px 18px rgba(80, 60, 180, 0.25);
              display: flex; align-items: center; justify-content: center;
              position: relative; z-index: 1;
            }
            .cd-m-badge :global(svg) { width: 30px; height: 30px; stroke: #fff; }
            .cd-m-card {
              flex: 1; background: #fff; border-radius: 18px;
              box-shadow: 0 10px 24px rgba(90, 70, 190, 0.12);
              padding: 14px 16px;
            }
            .cd-m-card .cd-num { font-size: 19px; }
            .cd-m-card h3 { font-size: 16.5px; }
            .cd-m-card p { font-size: 13.5px; max-width: none; }
          }
          @media (max-width: 768px) and (prefers-reduced-motion: reduce) {
            .cd-m-track-fill { transition: none; }
            .cd-m-item { transition: none; opacity: 1; transform: none; }
          }
                `}</style>
                </section>
            </div>
        </div>
    );
}