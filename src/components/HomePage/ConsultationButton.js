"use client";

import { ChevronRight } from "lucide-react";

// const ArrowRight = ({ className }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//     <path d="M5 12h14" />
//     <path d="M13 6l6 6-6 6" />
//   </svg>
// );


export default function ConsultationButton({ onOpenForm }) {
  return (
    <button
      onClick={onOpenForm}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#593adc] px-3 py-2.5  text-white shadow-lg shadow-[#593adc] transition hover:bg-purple-700 sm:w-auto md:px-7 md:py-3 lg:px-7 xl:px-7 text-xs md:text-[15px] lg:text-[15px] xl:text-[15px]"
    >
      Start My Journey
      <ChevronRight size={20}/>
    </button>
  );
}

