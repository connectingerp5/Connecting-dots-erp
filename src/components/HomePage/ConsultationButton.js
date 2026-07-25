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
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-3 py-2.5  text-white shadow-lg shadow-purple-300/50 transition hover:bg-purple-700 sm:w-auto sm:px-7 sm:py-3"
    >
      Start My Journey
      <ChevronRight size={20}/>
    </button>
  );
}

