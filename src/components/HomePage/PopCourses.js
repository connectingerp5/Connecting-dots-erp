"use client";

import { useState, useEffect, useRef } from "react";
import AmbientBlueBackground from "../BackgroundCss/AnimatedBlueBg";
import { AlarmClock, Calendar } from "lucide-react";

// star icon
const Star = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="#e58f0e" aria-hidden="true">
    <path d="m12 2 2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.5 5.8 21l1.6-7L2 9.3l7.1-.7L12 2z" />
  </svg>
);

function CourseCard() {
  const [timeLeft, setTimeLeft] = useState({
    days: "02",
    hours: "02",
    minutes: "02",
    seconds: "02",
  });
  const targetRef = useRef(null);

  useEffect(() => {
    // Countdown target: 2 days, 2 hours, 2 minutes, 2 seconds from mount
    const now = Date.now();
    targetRef.current =
      now +
      2 * 24 * 60 * 60 * 1000 +
      2 * 60 * 60 * 1000 +
      2 * 60 * 1000 +
      2 * 1000;

    const tick = () => {
      const diff = Math.max(targetRef.current - Date.now(), 0);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Card */}
      <div className="w-fit relative flex justify-between flex-wrap h-atuo bg-gradient-to-r from-[#f8fafe] to-[#f4f6fd] border-2 border-gray-300 rounded-xl overflow-hidden p-3 box-border">
        <div className="w-full ">
          <div className="bg-red-200 text-red-600 w-fit flex justify-start items-center gap-2 py-1 px-2 rounded-md">
            <AlarmClock size={20} />
            <p className="text-sm">Hurry Up</p>
          </div>
        </div>
        <div className="w-fit rounded-md p-1 bg-white absolute right-3 top-3 text-xs text-[#0765f0]">5 seats left</div>
        <div className="w-[40%] p-2 my-3 box-border">
          <h5 className="font-semibold text-2xl uppercase text-[#1166ec]">sap <span className="text-black">Fico</span></h5>
          <p className=" text-[14px] my-4">Lorem ipsum taheb hj ljkdonn</p>
          <span className="flex justify-start gap-2 items-center">
            <span
              className="flex gap-0.5"
              aria-label="4.8 out of 5 stars on Google"
            >
              {Star}
              {Star}
              {Star}
              {Star}
              {Star}
            </span>
            <span className="text-sm font-sans font-semibold">4.8/5</span>
          </span>
        </div>
        <div className="w-[60%] h-[200px] flex flex-col items-start py-8 justify-start px-3"
          style={{ backgroundImage: "url('/SAPFICO.png')", backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: 'no-repeat' }}
        >
        </div>
        <div className="w-full -mt-6 flex justify-between ">
          <div className="w-[32%] bg-blue-100 rounded-md p-2 leading-6">
            <div className="flex justify-start items-center text-blue-800 gap-2 box-border">
              <Calendar size={14} /><p className="text-xs">Duration</p>
            </div>
            <p className="text-[12px] pl-6">2-4 Months</p>
          </div>
          <div className="w-[65%] p-2 box-border bg-blue-100 rounded-md flex items-center justify-between">
            <div className="w-[50px] h-[50px] flex flex-col rounded-md bg-white items-center justify-around">
              <p className="text-xl text-red-500">{timeLeft.days}</p>
              <p className="text-xs">DAYS</p>
            </div>
            <div className="w-[50px] h-[50px] flex flex-col rounded-md bg-white items-center justify-around">
              <p className="text-xl text-red-500">{timeLeft.hours}</p>
              <p className="text-xs">HRS</p>
            </div>
            <div className="w-[50px] h-[50px] flex flex-col rounded-md bg-white items-center justify-around">
              <p className="text-xl text-red-500">{timeLeft.minutes}</p>
              <p className="text-xs">MINS</p>
            </div>
            <div className="w-[50px] h-[50px] flex flex-col rounded-md bg-white items-center justify-around">
              <p className="text-xl text-red-500">{timeLeft.seconds}</p>
              <p className="text-xs">SECS</p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default function PopularCourses() {
  return (
    <AmbientBlueBackground>
      <section
        className="relative w-full max-w-[1800px] mx-auto overflow-hidden py-16"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
        />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-[#13235b] sm:text-4xl">
              Our Popular <span className="text-[#2b5cff]">Courses</span>
            </h2>
            <div className="mx-auto mt-2 h-1 w-16 rounded bg-[#2b5cff]" />
            <p className="mt-4 text-gray-500">Start your learning journey with our in-demand courses</p>
          </div>

          <div className="w-full mx-auto grid grid-cols-3 gap-4 my-8 ">
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
            <CourseCard/>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2b5cff] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#1f49d6]"
            >
              ⬇ Download Brochure
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-[#13235b] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#0e1a44]"
            >
              📅 Book a Free Demo
            </button>
          </div>
        </div>

      </section>
    </AmbientBlueBackground>
  );
}