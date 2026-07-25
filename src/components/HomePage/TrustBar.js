const STATS = [
  {
    color: "#2563eb",
    value: "10+",
    label: "Years Of Legacy",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2  10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    color: "#f97316",
    value: "5,000+",
    label: "Students Trained",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    color: "#7c3aed",
    value: "200+",
    label: "Hiring Partners",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    color: "#16a34a",
    value: "100%",
    label: "Placement Assistance",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
];

// Multi-color Google "G" logo (inline, no external asset)
function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.4 7.4 24 12 24z" />
      <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.6.4-2.4V6.5H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.5l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.5l4 3.1C6.3 6.8 8.9 4.8 12 4.8z" />
    </svg>
  );
}

function StatItem({ s }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex-none w-10 h-10 xl:w-11 xl:h-11 rounded-full flex items-center justify-center shadow-[0_6px_14px_rgba(15,23,42,0.18)]"
        style={{ backgroundColor: s.color }}
      >
        {s.icon}
      </span>
      <span className="flex flex-col leading-tight text-left">
        <strong className="text-base xl:text-lg font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
          {s.value}
        </strong>
        <span className="text-[11px] xl:text-xs font-medium text-slate-500 whitespace-nowrap">
          {s.label}
        </span>
      </span>
    </div>
  );
}

export default function TrustBar() {
  return (
    <section className="w-full flex flex-col items-center box-border" aria-label="Institute highlights">
      <div
        className="
          w-full
          grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5
          divide-y divide-gray-200 sm:divide-y sm:divide-x lg:divide-y-0
          bg-white
          shadow-[0_18px_45px_rgba(15,23,42,0.12)]
          relative z-[2]  rounded-full
        "
      >
        {STATS.map((s, i) => (
          <div key={i} className="flex items-center justify-center px-4 py-3 xl:py-4">
            <StatItem s={s} />
          </div>
        ))}

        {/* 5th column: rating + Book Demo */}
        <div className="flex items-center justify-center gap-3 px-4 py-3 xl:py-4 sm:col-span-3 lg:col-span-1">
          <div className="flex flex-col items-center gap-0.5 flex-none">
            <span className="text-xl font-extrabold text-slate-900 leading-none">
              4.8/5
            </span>
            <span className="text-orange-500 text-[11px] tracking-wider leading-none" aria-label="4.9 out of 5 stars">
              {"\u2605\u2605\u2605\u2605\u2605"}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <GoogleG />
              <span className="text-[9px] font-bold tracking-wide text-slate-500 whitespace-nowrap">
                GOOGLE RATING
              </span>
            </div>
          </div>

          <a
            href="#book-demo"
            className="
              flex-none inline-flex items-center justify-center
              px-3.5 py-1.5 rounded-full
              bg-orange-500 text-white
              text-[11px] font-extrabold tracking-wide
              no-underline whitespace-nowrap
              shadow-[0_6px_16px_rgba(249,115,22,0.4)]
              transition-all duration-200
              hover:bg-orange-600 hover:-translate-y-px
            "
          >
            BOOK DEMO
          </a>
        </div>
      </div>
    </section>
  );
}