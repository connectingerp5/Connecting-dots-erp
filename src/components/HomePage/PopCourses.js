"use client";

import { useState, useEffect } from "react";
import AmbientBlueBackground from "../BackgroundCss/AnimatedBlueBg";
import { AlarmClock, Calendar } from "lucide-react";

// star icon
const Star = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="#e58f0e" aria-hidden="true">
    <path d="m12 2 2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.5 5.8 21l1.6-7L2 9.3l7.1-.7L12 2z" />
  </svg>
);

// Simple seeded pseudo-random generator so the same hour always
// produces the same numbers, and a new hour produces new numbers.
function seededRandom(seed) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// Static info for the 6 SAP courses. Update `img` to match your
// actual asset filenames in /public.
const COURSE_META = [
  { key: "fico", title: "sap", subtitle: "Fico", img: "/SAPFICO.png", duration: "2-4 Months",from:'#f8fafe', to:"#f4f6fd",card:"#DBEAFE",head:"#1166ec" },
  { key: "sd", title: "sap", subtitle: "SD", img: "/sapsd.png", duration: "2-4 Months", from:"#fdefd9", to:"#fdefd8", card:"#fef5e6",head:"#fdc53b" },
  { key: "ai", title: "AI", subtitle: "COURSES", img: "/ai.png", duration: "2-4 Months", from:"#f0ecfb", to:"#f0ecfb",card:"#dfccfd", head:"#8b40f4" },
  { key: "data", title: "DATA", subtitle: "ANALYTICS", img: "/dataanalytics.png", duration: "2-4 Months", from:"#d6ead8", to:"#d6ead8", card:"#e7f3eb",head:"#5ed0a0" },
  { key: "hr", title: "HR", subtitle: "MANAGEMENT", img: "/hrmanagement.png", duration: "2-4 Months", from:"#fce4ec", to:"#fce4ec", card:"#fee7ed",head:"#fa4c79" },
  { key: "py", title: "PYTHON", subtitle: "PROGRAMMING", img: "/python.png", duration: "2-4 Months", from:"#d0ddf9", to:"#d0ddf9", card:"#dfe8fc",head:"#003a8e" },
];

// How often the seats / timer data refreshes.
const RESET_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

function getHourBucket() {
  return Math.floor(Date.now() / RESET_INTERVAL_MS);
}

// Builds the 6 courses' dynamic data (seats + countdown target)
// deterministically from the current hour bucket, so every course
// gets a different value and everything changes once per hour.
function buildCourses(hourBucket) {
  return COURSE_META.map((meta, i) => {
    const seatSeed = hourBucket * 1000 + i;
    const timerSeed = hourBucket * 1000 + i + 500;

    // seats between 1 and 12 (below 5 triggers "Hurry Up")
    const seats = 1 + Math.floor(seededRandom(seatSeed) * 12);

    // countdown target: between 30 mins and 3 days out from the
    // start of the current hour bucket
    const minMs = 30 * 60 * 1000;
    const maxMs = 3 * 24 * 60 * 60 * 1000;
    const offset = minMs + seededRandom(timerSeed) * (maxMs - minMs);
    const bucketStart = hourBucket * RESET_INTERVAL_MS;
    const target = bucketStart + offset;

    return {
      ...meta,
      seats,
      target,
    };
  });
}

function CourseCard({ course }) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(course.target - Date.now(), 0);

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
  }, [course.target]);

  // Only show the "Hurry Up" badge when seats are below 5.
  const showHurryUp = course.seats < 5;

  return (
    <>
      {/* Card */}
      <div className={`w-fit relative flex justify-between flex-wrap h-auto border-2 border-gray-300 rounded-xl overflow-hidden p-3 box-border`}
        style={{ backgroundImage: `linear-gradient(to right, ${course.from}, ${course.to})` }}
      >
        <div className="w-full ">
          {showHurryUp && (
            <div className="bg-red-200 text-red-600 w-fit flex justify-start items-center gap-2 py-1 px-2 rounded-md">
              <AlarmClock size={20} />
              <p className="text-sm">Hurry Up</p>
            </div>
          )}
        </div>
        <div className="w-fit rounded-md p-1 bg-white absolute right-3 top-3 text-xs text-[#0765f0]">{course.seats} seats left</div>
        <div className="w-[40%] p-2 my-3 box-border">
          <h5 className="font-semibold relative text-2xl uppercase" style={{color:`${course.head}`}}>{course.title} <span className="text-black">{course.subtitle}</span></h5>
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
          style={{ backgroundImage: `url('${course.img}')`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: 'no-repeat' }}
        >
        </div>
        <div className="w-full -mt-6 flex justify-between ">
          <div className="w-[32%] rounded-md p-2 leading-6"
            style={{backgroundColor:`${course.card}`}}
          >
            <div className="flex justify-start items-center text-blue-800 gap-2 box-border">
              <Calendar size={14} /><p className="text-xs">Duration</p>
            </div>
            <p className="text-[12px] pl-6">{course.duration}</p>
          </div>
          <div className="w-[65%] p-2 box-border  rounded-md flex items-center justify-between"
            style={{backgroundColor:`${course.card}`}}
          >
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
  const [hourBucket, setHourBucket] = useState(getHourBucket());
  const [courses, setCourses] = useState(() => buildCourses(getHourBucket()));

  useEffect(() => {
    // Every minute, check whether we've crossed into a new hour bucket.
    // If so, regenerate all 6 courses' seats + timers.
    const check = setInterval(() => {
      const current = getHourBucket();
      setHourBucket((prev) => {
        if (current !== prev) {
          setCourses(buildCourses(current));
          return current;
        }
        return prev;
      });
    }, 60 * 1000);
    return () => clearInterval(check);
  }, []);

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
            {courses.map((course) => (
              <CourseCard key={course.key} course={course} />
            ))}
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