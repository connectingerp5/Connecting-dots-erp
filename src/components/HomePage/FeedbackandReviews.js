"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import styles from "@/styles/HomePage/FeedbackandReviews.module.css";

const FeedbackAndReviews = () => {
  const reviews = useMemo(() => [
    {
      name: "Niveath P",
      review:
        "I completed the SAP HCM course at Connecting Dots ERP in Mumbai, where expert instructors guided me through SAP complexities with clarity. The comprehensive, well-designed course covered all essential modules.",
      image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1784203724/review_image_3_ptk5th_tgirdk.webp",
      rating: 5,
    },
    {
      name: "Shweta Udainiya",
      review:
        "Connecting Dots Advancements offers top SAP training in Mumbai with expert coaches, flexible learning, and strong job support. I completed my SAP SD Course here, highly recommending it for a successful SAP career.",
      image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1784203666/review_image_1_plv1wu_yjudgs.webp",
      rating: 5,
    },
    {
      name: "Seshu Tamma",
      review:
        "In my opinion, Connecting Dots is Mumbai's best SAP training center, offering top-notch SAP Aruba courses with a comprehensive curriculum, expert instructors, and excellent placement assistance.",
      image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1784203579/review_image_2_kh1xcn_uiztqd.webp",
      rating: 4,
    },
    {
      name: "Shreyansh Gupta",
      review:
        "Connecting Dots Advancements offers top SAP training in Mumbai with expert coaches, flexible learning, and strong job support. I completed my SAP SD Course here, highly recommending it for a successful SAP career.",
      image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1784203620/review_image_4_vadjw2_vkf3qu.webp",
      rating: 5,
    },
    {
      name: "Sai Srujan",
      review:
        "I completed the SAP HCM course at Connecting Dots ERP in Mumbai, where expert instructors guided me through SAP complexities with clarity. The comprehensive, well-designed course covered all essential modules.",
      image: "https://res.cloudinary.com/bropujss/image/upload/v1784203985/review_image_5_jjm78u_h8txiq.webp",
      rating: 5,
    },
    {
      name: "Seshu Tamma",
      review:
        "In my opinion, Connecting Dots is Mumbai's best SAP training center, offering top-notch SAP Aruba courses with a comprehensive curriculum, expert instructors, and excellent placement assistance.",
      image: "https://res.cloudinary.com/djdhtkjhn/image/upload/v1784203579/review_image_2_kh1xcn_uiztqd.webp",
      rating: 5,
    },
  ], []);

  const marqueeRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // ✅ OPTIMIZED: Memoized event handlers
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (marquee) {
      marquee.style.animationPlayState = isPaused ? "paused" : "running";
    }
  }, [isPaused]);

  // ✅ OPTIMIZED: Memoized star rendering for performance
  const renderStars = useCallback((rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={i < rating ? styles.starFilled : styles.starEmpty}
      >
        ★
      </span>
    ));
  }, []);

  // ✅ OPTIMIZED: Memoized review card for rendering
  const ReviewCard = useMemo(() => {
    return ({ review, isDuplicate = false }) => (
      <div className={styles.reviewCard}>
        <div className={styles.reviewCardInner}>
          <div className={styles.imageContainer}>
            <Image
              src={review.image}
              alt={`${review.name}'s photo`}
              width={120}
              height={120}
              className={styles.reviewImage}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
            />
            <div className={styles.studentBadge}>Verified Student</div>
            <div className={styles.imageBorder}></div>
          </div>
          <div className={styles.reviewContent}>
            <p className={styles.reviewName}>{review.name}</p>
            <div className={styles.starRating}>
              {renderStars(review.rating)}
            </div>
            <p className={styles.reviewText}>"{review.review}"</p>
          </div>
          <div className={styles.quoteIcon}>"</div>
        </div>
      </div>
    );
  }, [renderStars]);

  return (
  <div>
      <section className={styles.feedbackSection}>
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className={styles.sectionTitle}>What Our Students Say</h2>
            <div className={styles.titleUnderline}></div>
            <p className={styles.sectionSubtitle}>
              Hear from our successful students about their learning experience
              with Connecting Dots
            </p>
          </div>
        </div>

        <div className={styles.marqueeWrapper}>
          <div
            className={styles.marquee}
            ref={marqueeRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {reviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}

            {/* Duplicate reviews for seamless infinite loop */}
            {reviews.map((review, index) => (
              <ReviewCard key={`duplicate-${index}`} review={review} isDuplicate={true} />
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default FeedbackAndReviews;
