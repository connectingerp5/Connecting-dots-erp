"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import styles from "@/styles/HomePage/PopCourses.module.css";

// Lazy load Toastify CSS only when needed
if (typeof window !== "undefined") {
  import("react-toastify/dist/ReactToastify.css").catch(console.error);
}
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import SectionBackground from "../BackgroundCss/SectionBackground";

// Country codes with flags (Unicode) and phone number lengths
const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸", minLength: 10, maxLength: 10 },
  { code: "+91", country: "IN", flag: "🇮🇳", minLength: 10, maxLength: 10 },
  { code: "+44", country: "GB", flag: "🇬🇧", minLength: 10, maxLength: 11 },
  { code: "+61", country: "AU", flag: "🇦🇺", minLength: 9, maxLength: 9 },
  { code: "+81", country: "JP", flag: "🇯🇵", minLength: 10, maxLength: 11 },
  { code: "+49", country: "DE", flag: "🇩🇪", minLength: 10, maxLength: 11 },
  { code: "+33", country: "FR", flag: "🇫🇷", minLength: 9, maxLength: 9 },
  { code: "+86", country: "CN", flag: "🇨🇳", minLength: 11, maxLength: 11 },
  { code: "+7", country: "RU", flag: "🇷🇺", minLength: 10, maxLength: 10 },
  { code: "+39", country: "IT", flag: "🇮🇹", minLength: 9, maxLength: 10 },
  { code: "+55", country: "BR", flag: "🇧🇷", minLength: 10, maxLength: 11 },
  { code: "+34", country: "ES", flag: "🇪🇸", minLength: 9, maxLength: 9 },
  { code: "+27", country: "ZA", flag: "🇿🇦", minLength: 9, maxLength: 9 },
  { code: "+971", country: "AE", flag: "🇦🇪", minLength: 9, maxLength: 9 },
  { code: "+62", country: "ID", flag: "🇮🇩", minLength: 10, maxLength: 12 },
  { code: "+90", country: "TR", flag: "🇹🇷", minLength: 10, maxLength: 10 },
  { code: "+82", country: "KR", flag: "🇰🇷", minLength: 9, maxLength: 10 },
  { code: "+60", country: "MY", flag: "🇲🇾", minLength: 9, maxLength: 10 },
  { code: "+31", country: "NL", flag: "🇳🇱", minLength: 9, maxLength: 9 },
  { code: "+52", country: "MX", flag: "🇲🇽", minLength: 10, maxLength: 10 },
];

/* ----------------------------- Course data -----------------------------
   - `image`: your full Cloudinary card image (icon + artwork baked in).
   - `theme`: "blue" | "purple" — controls the gradient tint over the image.
   - `id`/`name` kept as `name` to match backend's expected `coursename` field.
------------------------------------------------------------------------ */
const initialCourses = [
  { id: "1", name: "SAP S/4 HANA Courses", initialCount: 12, count: 12, image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1782995235/SAP_S4_HANA-2_d8krae.webp", startDays: 1, rating: 4.9, theme: "blue" },
  { id: "2", name: "Masters in Data Science", initialCount: 7, count: 7, image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1782995235/DATA_Scienece-2_qsbkqd.webp", startDays: 2, rating: 5.0, theme: "purple" },
  { id: "3", name: "SAP FICO Course", initialCount: 9, count: 9, image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1782995235/ChatGPT_Image_Jun_27_2026_06_31_20_PM-2_khpkmh.webp", startDays: 2, rating: 4.9, theme: "blue" },
  { id: "4", name: "SAP MM Course", initialCount: 8, count: 8, image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1782995235/ChatGPT_Image_Jun_27_2026_06_31_26_PM-2_ewuuiy.webp", startDays: 2, rating: 4.8, theme: "blue" },
  { id: "5", name: "SAP ABAP Course", initialCount: 8, count: 8, image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1782995234/ChatGPT_Image_Jun_27_2026_06_31_36_PM-1_u4vuqn.webp", startDays: 1, rating: 4.8, theme: "purple" },
  { id: "6", name: "SAP HR/HCM Course", initialCount: 12, count: 12, image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1782995234/ChatGPT_Image_Jun_27_2026_06_31_45_PM-1_tuv3xm.webp", startDays: 4, rating: 4.8, theme: "blue" },
  { id: "7", name: "HR Course", initialCount: 15, count: 15, image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1782995233/ChatGPT_Image_Jun_27_2026_06_32_04_PM-4_vghugx.webp", startDays: 3, rating: 4.8, theme: "purple" },
  { id: "8", name: "SAP SD Course", initialCount: 13, count: 13, image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1782995234/ChatGPT_Image_Jun_27_2026_06_32_18_PM-2_uq2auf.webp", startDays: 2, rating: 4.8, theme: "purple" },
  { id: "9", name: "SAP SUCCESSFACTOR Course", initialCount: 17, count: 17, image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1782995234/ChatGPT_Image_Jun_27_2026_06_32_24_PM-3_sinlya.webp", startDays: 5, rating: 5.0, theme: "blue" },
  { id: "10", name: "SAP Ariba", initialCount: 6, count: 6, image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1782995233/ChatGPT_Image_Jun_27_2026_06_32_58_PM-2_yb0wni.webp", startDays: 2, rating: 5.0, theme: "purple" },
  { id: "11", name: "Genrative Ai", initialCount: 3, count: 3, image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1782995233/ChatGPT_Image_Jun_27_2026_06_32_35_PM-2_cnxgir.webp", startDays: 6, rating: 4.7, theme: "blue" },
  { id: "12", name: "AI / ML", initialCount: 8, count: 8, image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1782995233/ChatGPT_Image_Jun_27_2026_06_33_08_PM-2_xzpdro.webp", startDays: 5, rating: 4.8, theme: "purple" },
];

const THEME = {
  blue: "from-[#0a2a8c]/95 via-[#0a2a8c]/55 to-transparent",
  purple: "from-[#3b1d9e]/95 via-[#3b1d9e]/55 to-transparent",
};

/* Pure-CSS star rating (supports half stars, no icon library) */
function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(Math.max(rating - i, 0), 1) * 100;
        return (
          <span key={i} className="relative inline-block text-[15px] leading-none">
            <span className="text-white/30">★</span>
            <span className="absolute inset-0 overflow-hidden text-yellow-400" style={{ width: `${fill}%` }}>★</span>
          </span>
        );
      })}
    </span>
  );
}
function CourseCard({ course, priority, onEnroll }) {
  const isLowSeats = course.count <= 5;

  return (
    <article className="relative isolate flex h-[190px] overflow-hidden rounded-2xl border border-white/40 shadow-[0_10px_25px_rgba(19,35,91,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(19,35,91,0.22)]">
      {/* Background Image */}
      {course.image && (
        <Image
          src={course.image}
          alt={course.name}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover"
        />
      )}

      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${THEME[course.theme]}`}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* ===================== */}
      {/* Diagonal Ribbon */}
      {/* ===================== */}
      <div className="absolute left-0 top-0 z-30">
        <div
          className="
      flex
      h-[110px]
      w-[120px]
      flex-col
      justify-start
      px-1.5
      py-2.5
      text-white
      shadow-[0_8px_24px_rgba(134,32,132,0.35)]
    "
          style={{
            clipPath: "polygon(0 0,100% 0,0 100%)",
            background: "linear-gradient(180deg, #fb474a 0%, #781d8d 70%)",
          }}
        >
          <span className="text-[9px] font-semibold uppercase tracking-widest opacity-90">
            Starts In
          </span>
          <span className="mt-1 text-xl font-black leading-none">
            {course.timeLeft?.days ?? 0}D {course.timeLeft?.hours ?? 0}H
          </span>
          <span className="mt-1 text-xs font-semibold leading-none opacity-95">
            {course.timeLeft?.minutes ?? 0}m {course.timeLeft?.seconds ?? 0}s
          </span>
        </div>
      </div>
      {/* Content */}

      <div className="relative z-10 ml-auto flex w-[60%] flex-col justify-center gap-1.5 pr-5 text-white">
        <h3 className="line-clamp-2 text-lg font-bold leading-tight">
          {course.name}
        </h3>

        <div className="flex items-center gap-2">
          <Stars rating={course.rating} />

          <span className="text-sm text-white/90">
            ({course.rating.toFixed(1)})
          </span>
        </div>

        <p className="text-sm font-medium">
          🔥 {course.count} {course.count === 1 ? "Seat" : "Seats"} Left
          {isLowSeats && (
            <span className="ml-1 animate-pulse font-semibold text-yellow-300">
              · Hurry up!
            </span>
          )}
        </p>

        <button
          onClick={() => onEnroll(course)}
          className="mt-1 inline-flex w-fit items-center gap-1 rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-[#0a2a8c] transition-all duration-300 hover:scale-105 hover:bg-white/90"
        >
          Enroll Now
          <span>›</span>
        </button>
      </div>
    </article>
  );
}
export default function PopularCourses() {
  const [showPopupForm, setShowPopupForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  // Timer refs for cleanup
  const timerRefs = useRef([]);
  const courseStartTimestamps = useRef([]);

  useEffect(() => {
    // Initialize courses with calculated start times
    const now = new Date();

    const initializedCourses = initialCourses.map((course) => {
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() + course.startDays);
      startDate.setHours(9, 0, 0, 0); // 9 AM

      const startTimestamp = startDate.getTime();
      courseStartTimestamps.current.push(startTimestamp);

      const diffMs = startTimestamp - now.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      const timeRatio = diffMs / (course.startDays * 24 * 60 * 60 * 1000);
      const adjustedCount = Math.max(
        2,
        Math.floor(course.initialCount * timeRatio * 0.8 + course.initialCount * 0.2)
      );

      return {
        ...course,
        startTimestamp,
        count: adjustedCount,
        timeLeft: { days: diffDays, hours: diffHours, minutes: diffMinutes, seconds: diffSeconds },
      };
    });

    setCourses(initializedCourses);

    // Start timers for each course
    initializedCourses.forEach((course, index) => {
      const timerId = setInterval(() => {
        updateCourseTimer(index);
      }, 1000);
      timerRefs.current[index] = timerId;
    });

    return () => {
      timerRefs.current.forEach((timerId) => clearInterval(timerId));
    };
  }, []);

  useEffect(() => {
    if (showPopupForm) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [showPopupForm]);

  const updateCourseTimer = (index) => {
    setCourses((prevCourses) => {
      const updatedCourses = [...prevCourses];
      const course = updatedCourses[index];
      if (!course) return prevCourses;

      const now = new Date().getTime();
      const startTimestamp = courseStartTimestamps.current[index];
      let diffMs = startTimestamp - now;

      if (diffMs <= 0) {
        const newDays = Math.floor(Math.random() * 7) + 1;
        const newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() + newDays);
        newStartDate.setHours(9, 0, 0, 0);

        courseStartTimestamps.current[index] = newStartDate.getTime();
        diffMs = newStartDate.getTime() - now;
        course.count = course.initialCount;
      } else {
        const totalTimeMs = course.startDays * 24 * 60 * 60 * 1000;
        const timeRatio = diffMs / totalTimeMs;

        if (diffMs < 24 * 60 * 60 * 1000) {
          if (diffMs < 8 * 60 * 60 * 1000) {
            course.count = Math.max(2, Math.min(5, course.count));
          } else {
            const adjustedCount = Math.max(2, Math.floor(course.initialCount * 0.3));
            if (adjustedCount < course.count) course.count = adjustedCount;
          }
        } else {
          const adjustedCount = Math.max(
            2,
            Math.floor(course.initialCount * timeRatio * 0.8 + course.initialCount * 0.2)
          );
          if (adjustedCount < course.count) course.count = adjustedCount;
        }

        if (Math.random() < 0.0001 && course.count > 2) {
          course.count -= 1;
        }
      }

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      course.timeLeft = { days: diffDays, hours: diffHours, minutes: diffMinutes, seconds: diffSeconds };

      return updatedCourses;
    });
  };

  const handleEnrollNowClick = (course) => {
    setSelectedCourse(course);
    setShowPopupForm(true);
    setName("");
    setEmail("");
    setPhone("");
    setLocation("");
    setSelectedCountryCode("+91");
    setValidated(false);
    setErrors({});
  };

  const handleClosePopupForm = () => {
    setShowPopupForm(false);
    setSelectedCourse(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else {
      const selectedCountry = countryCodes.find((item) => item.code === selectedCountryCode);
      if (selectedCountry) {
        const { minLength, maxLength } = selectedCountry;
        if (phone.length < minLength || phone.length > maxLength) {
          newErrors.phone = `Phone number must be between ${minLength} and ${maxLength} digits for ${selectedCountry.country}`;
        }
      }
    }

    if (!location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = {
        name: name.trim(),
        email: email.trim(),
        contact: phone,
        countryCode: selectedCountryCode,
        location: location.trim(),
        coursename: selectedCourse ? selectedCourse.name : "Not specified",
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Enrollment successful! We'll contact you soon.");
        handleClosePopupForm();
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = countryCodes.find((country) => country.code === selectedCountryCode);
  const contactPlaceholder = selectedCountry
    ? `Enter ${selectedCountry.minLength === selectedCountry.maxLength
      ? selectedCountry.minLength
      : `${selectedCountry.minLength}-${selectedCountry.maxLength}`
    } digits`
    : "Enter phone number";

  return (
    <SectionBackground>
      <section
        className="relative w-full max-w-[1800px] mx-auto overflow-hidden py-16"
      // style={{
      //   background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      // }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
        // style={{
        //   backgroundImage:
        //     'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 .895 2 2 2zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23bfc5ca\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        // }}
        />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-[#13235b] sm:text-4xl">
              Our Popular <span className="text-[#2b5cff]">Courses</span>
            </h2>
            <div className="mx-auto mt-2 h-1 w-16 rounded bg-[#2b5cff]" />
            <p className="mt-4 text-gray-500">Start your learning journey with our in-demand courses</p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course}
                priority={i < 3}
                onEnroll={handleEnrollNowClick}
              />
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleEnrollNowClick({ id: "brochure", name: "Download Brochure" })}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2b5cff] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#1f49d6]"
            >
              ⬇ Download Brochure
            </button>
            <button
              type="button"
              onClick={() => handleEnrollNowClick({ id: "demo", name: "Free Demo Session" })}
              className="inline-flex items-center gap-2 rounded-lg bg-[#13235b] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#0e1a44]"
            >
              📅 Book a Free Demo
            </button>
          </div>
        </div>

        {/* Single-step Enrollment Form Modal */}
        <Modal
          show={showPopupForm}
          onHide={handleClosePopupForm}
          centered
          className={styles.enrollmentModal}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedCourse ? `Enroll in ${selectedCourse.name}` : "Enrollment Form"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            <div className={styles.selectedCourseInfo}>
              <div className={styles.selectedCourseLabel}>Course:</div>
              <div className={styles.selectedCourseName}>
                {selectedCourse ? selectedCourse.name : ""}
              </div>
            </div>

            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
              <div className={styles.formStep}>
                <div className={styles.formGroup}>
                  <div className={styles.inputIcon}>
                    <FaUser className={styles.icon} />
                  </div>
                  <div className={styles.inputField}>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      isInvalid={!!errors.name}
                      required
                      className={styles.formControl}
                    />
                    <Form.Label className={styles.floatingLabel}>Full Name</Form.Label>
                    <div className={styles.errorMessage}>{errors.name}</div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.inputIcon}>
                    <FaEnvelope className={styles.icon} />
                  </div>
                  <div className={styles.inputField}>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      isInvalid={!!errors.email}
                      required
                      className={styles.formControl}
                    />
                    <Form.Label className={styles.floatingLabel}>Email Address</Form.Label>
                    <div className={styles.errorMessage}>{errors.email}</div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.inputIcon}>
                    <FaPhone className={styles.icon} />
                  </div>
                  <div className={styles.inputField}>
                    <div className={styles.phoneInputWrapper}>
                      <Form.Select
                        className={styles.countryCodeSelect}
                        value={selectedCountryCode}
                        onChange={(e) => setSelectedCountryCode(e.target.value)}
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control
                        type="tel"
                        placeholder={contactPlaceholder}
                        value={phone}
                        onChange={(e) => {
                          const regex = /^[0-9\b]+$/;
                          if (e.target.value === "" || regex.test(e.target.value)) {
                            setPhone(e.target.value);
                          }
                        }}
                        isInvalid={!!errors.phone}
                        required
                        className={styles.phoneInput}
                        maxLength={selectedCountry?.maxLength || 15}
                      />
                    </div>
                    <Form.Label className={styles.floatingLabel}>Phone Number</Form.Label>
                    <div className={styles.errorMessage}>{errors.phone}</div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.inputIcon}>
                    <FaMapMarkerAlt className={styles.icon} />
                  </div>
                  <div className={styles.inputField}>
                    <Form.Control
                      type="text"
                      placeholder="Enter your location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      isInvalid={!!errors.location}
                      required
                      className={styles.formControl}
                    />
                    <Form.Label className={styles.floatingLabel}>Location</Form.Label>
                    <div className={styles.errorMessage}>{errors.location}</div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Processing...
                    </>
                  ) : (
                    "Submit Enrollment"
                  )}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <ToastContainer position="bottom-right" autoClose={5000} />
      </section>
      <section  className="w-[80%] mx-auto grid grid-cols-3 my-8">
        <div className="w-auto h-atuo bg-red-500">
          <div className="w-full h-[200px] flex items-center justify-start px-3"
            style={{backgroundImage:"url('/SAPFICO.png')", backgroundPosition:"left", backgroundSize:"cover"}}
          >
            {/* <h5 className="font-semibold text-xl uppercase px-2 py-5 text-[#1166ec]">sap <br/><span className="text-black">Fico</span></h5> */}
          </div>
          </div>
      </section>
    </SectionBackground>
  );
}
