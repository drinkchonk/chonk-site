const items = [
  "60g protein",
  "Real fruit",
  "Whey isolate",
  "No added sugar",
  "Perth-made",
  "Made to order",
  "Zero gums",
  "Zero artificial colours",
];

/** Pink marquee between hero and proof-bar. Duplicated item list so the
 *  -50% translation in the marquee keyframe produces a seamless loop. */
export default function TickerStrip() {
  const row = [...items, ...items];
  return (
    <div
      className="bg-pink text-[#1A1614] overflow-hidden"
      style={{
        padding: "22px 0",
        borderTop: "1px solid rgba(0,0,0,0.15)",
        borderBottom: "1px solid rgba(0,0,0,0.15)",
      }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {row.map((t, i) => (
          <div
            key={i}
            className="flex items-center flex-shrink-0"
            style={{ gap: 60 }}
          >
            <span
              className="text-section"
              style={{
                fontSize: 32,
                letterSpacing: "-0.015em",
                color: "#1A1614",
              }}
            >
              {t}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              style={{ flexShrink: 0 }}
            >
              <path d="M7 0l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#1A1614" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
