import styles from "../../styles/HomePage/TrustBar.module.css";

const CapIcon = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M12 3 1 8l11 5 9-4.09V15h2V8L12 3zM5 13.18v3.5C5 18.5 8.13 20 12 20s7-1.5 7-3.32v-3.5l-7 3.18-7-3.18z" />
  </svg>
);

const PeopleIcon = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 19v-1.5C2 15 5.3 14 8 14s6 1 6 3.5V19H2zm12.2-4.9c1.9.4 3.8 1.3 3.8 3.4V19h4v-1.5c0-2.2-2.8-3.2-5-3.4-.9 0-1.9.1-2.8.5z" />
  </svg>
);

const BriefcaseIcon = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M9 4h6a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v3H2V9a2 2 0 0 1 2-2h3V6a2 2 0 0 1 2-2zm0 3h6V6H9v1zM2 14h9v2h2v-2h9v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5z" />
  </svg>
);

const CheckDocIcon = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM8.6 13.2l2.1 2.1 4.7-4.7 1.4 1.4-6.1 6.1-3.5-3.5 1.4-1.4z" />
  </svg>
);

const ITEMS = [
  {
    value: "10+",
    label: "Years Of Legacy",
    tint: "#3a56b8",
    icon: CapIcon,
  },
  {
    value: "5,000+",
    label: "Students Trained",
    tint: "#c95f08",
    icon: PeopleIcon,
  },
  {
    value: "200+",
    label: "Hiring Partners",
    tint: "#5a3ecf",
    icon: BriefcaseIcon,
  },
  {
    value: "100%",
    label: "Placement Assistance",
    tint: "#1a7a42",
    icon: CheckDocIcon,
  },
];

const Star = (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="#e58f0e" aria-hidden="true">
    <path d="m12 2 2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.5 5.8 21l1.6-7L2 9.3l7.1-.7L12 2z" />
  </svg>
);

export default function TrustBar() {
  return (
    <>
      <div className={styles.wrap}>
        <ul className={styles.bar} aria-label="Institute highlights">
          {ITEMS.map((it, i) => (
            <li key={i} className={styles.item}>
              <span className={styles.iconWell}>
                <span className={styles.iconDisc} style={{ color: it.tint }}>
                  {it.icon}
                </span>
              </span>

              <span className={styles.text}>
                <span className={styles.value}>{it.value}</span>
                <span className={styles.label}>{it.label}</span>
              </span>
            </li>
          ))}

          <li className={`${styles.item} ${styles.rating}`}>
            <span className={styles.text}>
              <span className={styles.value}>4.8/5</span>

              <span
                className={styles.stars}
                aria-label="4.8 out of 5 stars on Google"
              >
                {Star}
                {Star}
                {Star}
                {Star}
                {Star}
                <span className={styles.gLabel}>GOOGLE RATING</span>
              </span>
            </span>
          </li>

          <li className={`${styles.item} ${styles.ctaItem}`}>
            <a href="#book-demo" className={styles.cta}>
              Book Demo
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}