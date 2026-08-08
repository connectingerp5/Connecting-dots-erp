// components/CoursesComponents/Header.js

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from 'next/dynamic';
import { countryCodes } from '@/utils/countryCodes';
import styles from "@/styles/CoursesComponents/Header.module.css";
const Btnform = dynamic(() => import('@/components/HomePage/Btnform'), {
  ssr: false,
  loading: () => null
});

const courseOptions = {
  "SAP Functional": [
    "SAP FICO", "SAP Ariba", "SAP MM", "SAP SD", "SAP HR/HCM",
    "SAP PP", "SAP QM", "SAP PM", "SAP PS", "SAP EWM",
    "SAP SCM", "SAP SUCCESSFACTOR", "SAP BTP", "SAP EHS",
    "SAP GRC", "SAP IBP"
  ],
  "SAP Technical": [
    "SAP ABAP", "SAP S/4 HANA", "SAP BW/BI", "SAP BASIS"
  ],
  "Data Visualization": [
    "Tableau", "Power BI", "SQL"
  ],
  "Digital Marketing": [
    "Advance Digital Marketing", "Pay Per Click Training",
    "Search Engine Optimization", "Social Media Marketing",
    "Advance Google Analytics Training"
  ],
  "HR Courses": [
    "HR Training", "Core HR", "HR Payroll",
    "HR Management", "HR Generalist", "HR Analytics"
  ],
  "IT Courses": [
    "MASTERS IN DATA ANALYTICS", "MASTERS IN DATA SCIENCE",
    "MASTERS IN BUSINESS ANALYTICS", "Generative AI",
    "Full Stack Training", "JAVA",
    "Python", "Salesforce", "Software Development",
    "AWS", "Azure", "DevOps", "AIML"
  ]
};

/* Confetti field — same approach/config shape as IndependenceHero,
   recoloured to the brand palette (orange / navy / white) instead
   of the festival tricolour. */
const CONFETTI = [
  { l: 8.2, s: 8, c: '#f45807', d: 15, delay: 0 },
  { l: 18.4, s: 6, c: '#0a1a5c', d: 18, delay: 3.1 },
  { l: 34.9, s: 7, c: '#ffffff', d: 16, delay: 1.4 },
  { l: 47.1, s: 6, c: '#dc2626', d: 19, delay: 5.2 },
  { l: 58.6, s: 8, c: '#0a1a5c', d: 14, delay: 2.3 },
  { l: 66.8, s: 6, c: '#f45807', d: 20, delay: 7.0 },
  { l: 75.2, s: 7, c: '#ffffff', d: 17, delay: 4.1 },
  { l: 86.5, s: 6, c: '#dc2626', d: 21, delay: 0.9 },
  { l: 92.7, s: 7, c: '#0a1a5c', d: 15, delay: 6.4 },
];

// DSHeader now directly receives the 'data' prop (already processed with city placeholders replaced)
const DSHeader = ({ data }) => {
  const [formData, setFormData] = useState({ countryCode: "+91", contact: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const [showForm, setShowForm] = useState(false);
  const [location, setLocation] = useState("");
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  /* ---------- canvas motion: refs, entrance reveal, parallax ---------- */
  const rootRef = useRef(null);
  const robotRef = useRef(null);
  const bgRef = useRef(null);
  const [visible, setVisible] = useState(false);

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

  const state = useRef({ mx: 0, my: 0, raf: 0 });
  const apply = useCallback(() => {
    state.current.raf = 0;
    const { mx, my } = state.current;
    if (bgRef.current) {
      bgRef.current.style.transform = `scale(1.06) translate3d(${mx * 12}px, ${my * 9}px, 0)`;
    }
  }, []);
  const schedule = useCallback(() => {
    if (!state.current.raf) state.current.raf = requestAnimationFrame(apply);
  }, [apply]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 900px)").matches) return;

    const el = rootRef.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      state.current.mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      state.current.my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      schedule();
    };
    const onLeave = () => {
      state.current.mx = 0;
      state.current.my = 0;
      schedule();
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (state.current.raf) cancelAnimationFrame(state.current.raf);
    };
  }, [schedule]);

  // Clear status message after 5 seconds
  useEffect(() => {
    if (statusMessage.text) {
      const timer = setTimeout(() => {
        setStatusMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.locationContainer}`)) {
        setShowSuggestions(false);
        setShowCourseDropdown(false);
        setSelectedCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCities = async () => {
      try {
        const citiesModule = await import("@/data/india-cities.json");
        const cities = citiesModule.default || citiesModule;
        const indianCities = cities.filter(
          (city) => city.country === "IN" || city.country === "India"
        );

        const uniqueLocations = [
          ...new Set(
            indianCities.map((c) =>
              c.subcountry ? `${c.name}, ${c.subcountry}` : c.name
            )
          ),
        ].sort();

        if (isMounted) {
          setLocationSuggestions(uniqueLocations);
        }
      } catch (error) {
        console.error("Error loading cities data:", error);
      }
    };

    loadCities();

    return () => {
      isMounted = false;
    };
  }, []);

  // If data is null or undefined, render a loading/error state
  if (!data) {
    return (
      <div className={styles.hero}>
        <p>Loading header data...</p>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "contact") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prevData) => ({ ...prevData, [name]: digitsOnly }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;

    setLocation(value);
    setIsLocationSelected(false);

    if (value.length > 0) {
      const filtered = locationSuggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );

      const results = [...filtered.slice(0, 9)];

      // 🔥 ALWAYS add "Other"
      if (!results.includes("Other")) {
        results.push("Other");
      }

      setFilteredSuggestions(results);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  const handleSuggestionClick = (val) => {
    setLocation(val);
    setIsLocationSelected(true);
    setShowSuggestions(false);
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.contact) {
      setStatusMessage({
        text: "Please fill all required fields",
        type: "error",
      });
      return false;
    }

    const selectedCountry = countryCodes.find(
      (country) => country.code === formData.countryCode
    );

    if (!selectedCountry) {
      setStatusMessage({
        text: "Invalid country code",
        type: "error",
      });
      return false;
    }

    const { minLength, maxLength } = selectedCountry;

    if (
      formData.contact.length < minLength ||
      formData.contact.length > maxLength
    ) {
      setStatusMessage({
        text: `Phone number for ${selectedCountry.country} must be between ${minLength} and ${maxLength} digits`,
        type: "error",
      });
      return false;
    }

    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(formData.contact)) {
      setStatusMessage({
        text: "Phone number must contain only digits",
        type: "error",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatusMessage({
        text: "Please enter a valid email address",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ text: "", type: "" });

    const isValidLocation =
      locationSuggestions.includes(location) || location === "Other";

    if (!isValidLocation || !isLocationSelected) {
      setStatusMessage({
        text: "Please select a location from dropdown only",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            location: location,
            course: formData.course,
            coursename: data.title,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Submission failed. Please try again.");
      }

      setStatusMessage({
        text: "Form submitted successfully!",
        type: "success",
      });

      setFormData({
        name: "",
        email: "",
        course: "",
        countryCode: "+91",
        contact: "",
      });
    } catch (error) {
      setStatusMessage({
        text: error.message || "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonClick = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  /* ------------------------------------------------------------- blocks -- */
  const Headline = (
    <h1 className={`${styles.headline} ${styles.reveal} ${styles.d2} text-[12px]`}>
      <span className={`${styles.hLine} ${styles.hLine1}`}>{data.title}</span>
      <span className={`${styles.hLine} ${styles.hLine2}`}>{data.subtitle}</span>
    </h1>
  );

  const Desc = (
    <p className={`${styles.desc} ${styles.reveal} ${styles.d3}`}>{data.description}</p>
  );

  const Features = (
    <ul className={`${styles.features} ${styles.reveal} ${styles.d4}`}>
      {data.features.map((feature, index) => (
        <li className={styles.featureChip} key={index}>
          {feature}
        </li>
      ))}
    </ul>
  );

  const Alumni = (
    <div className={`${styles.alumni} ${styles.reveal} ${styles.d5}`}>
      <span>Find our Alumni at -</span>
      <div className={styles.alumniLogos}>
        {data.alumni.map((company, index) => (
          <img key={index} src={company.logo} alt={`${company.name} logo`} />
        ))}
      </div>
    </div>
  );

  const Buttons = (
    <div className={`${styles.buttons} ${styles.reveal} ${styles.d6}`}>
      {data.buttons.map((button, index) => (
        <button
          key={index}
          className={index === 0 ? styles.buttonStyle1 : styles.buttonStyle2}
          onClick={handleButtonClick}
        >
          {button.text}
        </button>
      ))}
    </div>
  );

  const FormPanel = (
    <div className={`${styles.formWrap} ${styles.reveal} ${styles.d3}`}>
      <div className={styles.formCard}>
        <h3 className={styles.formTitle}>{data.form.title}</h3>

        {statusMessage.text && (
          <div className={`${styles.statusMessage} ${styles[statusMessage.type]}`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {(() => {
            return data.form?.inputs?.map((input, index) => {
              if (input.countryCode) {
                const selectedCountry = countryCodes.find(
                  (country) => country.code === formData.countryCode
                );
                const maxLength = selectedCountry?.maxLength || 10;
                return (
                  <div key={index} className={styles.phoneInputItDs}>
                    <select
                      id="countryCode"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className={styles.selectCountryCode}
                      disabled={isSubmitting}
                    >
                      {countryCodes.map(({ code, country }) => (
                        <option key={code} value={code}>
                          {code} ({country})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="contact"
                      name="contact"
                      placeholder="Enter phone number"
                      value={formData.contact}
                      onChange={handleChange}
                      maxLength={maxLength}
                      required
                      disabled={isSubmitting}
                      className={styles.input}
                    />
                  </div>
                );
              } else {

                if (input.name === "location") {
                  return (
                    <div key={index} className={styles.locationContainer}>
                      <input
                        type="text"
                        name="location"
                        value={location}
                        onChange={handleLocationChange}
                        onFocus={() => {
                          if (filteredSuggestions.length > 0) setShowSuggestions(true);
                        }}
                        className={styles.input}
                        placeholder="Enter your location"
                      />

                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div
                          className={styles.suggestionsDropdown}
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          {filteredSuggestions.slice(0, 6).map((suggestion, i) => (
                            <div
                              key={i}
                              className={styles.dropdownItem}
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                if (input.type === "course") {
                  return (
                    <div key={index} className={styles.locationContainer}>
                      <div
                        className={styles.input}
                        onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer"
                        }}
                      >
                        <span style={{ color: formData.course ? "#000" : "#888" }}>
                          {formData.course || "Select Course"}
                        </span>
                        <span>{showCourseDropdown ? "▲" : "▼"}</span>
                      </div>

                      {showCourseDropdown && (
                        <div
                          className={styles.suggestionsDropdown}
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          {!selectedCategory &&
                            Object.keys(courseOptions).map((category) => (
                              <div
                                key={category}
                                className={styles.dropdownCategory}
                                onPointerDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedCategory(category);
                                }}
                              >
                                {category}
                                <span className={styles.categoryArrow}>→</span>
                              </div>
                            ))
                          }

                          {selectedCategory && (
                            <>
                              <div
                                className={styles.dropdownBack}
                                onPointerDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedCategory(null);
                                }}
                              >
                                ← Back
                              </div>

                              {courseOptions[selectedCategory].map((course) => (
                                <div
                                  key={course}
                                  className={styles.dropdownItem}
                                  onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setFormData((prev) => ({
                                      ...prev,
                                      course: course,
                                    }));
                                    setShowCourseDropdown(false);
                                    setSelectedCategory(null);
                                  }}
                                >
                                  {course}
                                </div>
                              ))}

                              <div
                                className={styles.dropdownItem}
                                onPointerDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setFormData((prev) => ({
                                    ...prev,
                                    course: "Other",
                                  }));
                                  setShowCourseDropdown(false);
                                  setSelectedCategory(null);
                                }}
                              >
                                Other
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <input
                    key={index}
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    className={styles.input}
                    value={formData[input.name] || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                );
              }
            });
          })()}

          <button
            type="submit"
            className={`${styles.submitButtonItDs} ${isSubmitting ? styles.loading : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.buttonText}>Submitting</span>
                <span className={styles.buttonLoader}></span>
              </>
            ) : (
              data.form.submitText
            )}
          </button>
        </form>
      </div>
    </div>
  );

  /* --------------------------------------------------------------- view -- */

  return (
    <section
      ref={rootRef}
      className={`${styles.hero} ${visible ? styles.in : ""}`}
      aria-label={data.title}
    >
      {/* ---------- decorative canvas: bg + confetti (this layer clips) ---------- */}
      <div className={styles.canvasDecor} aria-hidden="true">
        <div ref={bgRef} className={styles.bg} />
        <div className={styles.overlay} />
        <div className={styles.confetti}>
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className={styles.flake}
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
      </div>

      <div ref={robotRef} className={styles.robotWrap}>
        <img className={styles.robot} src={`/pngRobo.png`} alt="Friendly AI learning robot" />
      </div>

      {/* ---------- desktop composition (absolute, 1563x1006 canvas) ---------- */}
      <div className={styles.desktop}>
        {Headline}
        {Desc}
        {Features}
        {Alumni}
        {Buttons}
        {FormPanel}
      </div>

      {/* ---------- mobile composition (stacked) ---------- */}
      <div className={styles.mobile}>
        {Headline}
        {Desc}
        {Features}
        {Alumni}
        {Buttons}
        {FormPanel}
      </div>

      {showForm && <Btnform onClose={handleCloseForm} />}
    </section>
  );
};

export default DSHeader;