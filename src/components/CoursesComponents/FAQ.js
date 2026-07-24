// components/CoursesComponents/FAQ.js (Updated FAQ)
"use client";

import { useState, useEffect } from 'react';
import styles from '@/styles/CoursesComponents/FAQ.module.css';
// Removed: import { CityContext } from '@/context/CityContext'; // Not needed here anymore

const FAQAccordion = ({ data }) => {
  const [expandedKey, setExpandedKey] = useState(null);

  const normalizeFaqSections = (payload) => {
    if (!payload) return [];

    if (Array.isArray(payload)) {
      return payload.flatMap(normalizeFaqSections);
    }

    if (typeof payload !== "object") {
      return [];
    }

    if (payload.title && Array.isArray(payload.items)) {
      return [payload];
    }

    if (Array.isArray(payload.sections)) {
      return payload.sections.flatMap(normalizeFaqSections);
    }

    return Object.values(payload).flatMap((value) => normalizeFaqSections(value));
  };

  const faqSections = normalizeFaqSections(data);

  const handleToggle = (key) => {
    setExpandedKey(expandedKey === key ? null : key);
  };

  if (!faqSections.length) {
    return (
      <div>
        <p className="text-white text-center">No FAQ data available.</p>
      </div>
    );
  }

  const primaryVideo = faqSections.find((section) => section.video)?.video;

  return (
    <div className={styles.containerFaqDs}>
      <h2 className={styles.containerFaqDsh2}>Frequently Asked Questions</h2>
      <div className={styles.faqContent}>
        <div className={styles.faqImage}>
          {primaryVideo && (
            <video loop autoPlay muted>
              <source src={primaryVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className={styles.faqQuestions}>
          {faqSections.map((section, sectionIndex) => (
            <div key={`${section.title}-${sectionIndex}`} style={{ marginBottom: "16px" }}>
              <h3 className={styles.containerFaqDsh2} style={{ fontSize: "1.1rem", marginBottom: "8px" }}>
                {section.title}
              </h3>
              {section.items && section.items.length > 0 ? (
                section.items.map((item, itemIndex) => {
                  const itemKey = `${sectionIndex}-${itemIndex}`;
                  return (
                    <div key={itemKey} className={styles.accordionItem}>
                      <button
                        aria-expanded={expandedKey === itemKey}
                        onClick={() => handleToggle(itemKey)}
                        className={styles.accordionButton}
                      >
                        <span className={styles.accordionTitle}>{item.question}</span>
                        <span className={styles.icon} aria-hidden="true"></span>
                      </button>
                      <div
                        className={styles.accordionContent}
                        style={{
                          opacity: expandedKey === itemKey ? 1 : 0,
                          maxHeight: expandedKey === itemKey ? "9em" : 0,
                        }}
                      >
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No FAQs available.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQAccordion;