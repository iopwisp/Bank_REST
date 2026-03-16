export const ICONS = {
  card:         "M2 5a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm0 5h20",
  plus:         "M12 5v14M5 12h14",
  send:         "M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z",
  lock:         "M17 11V7a5 5 0 00-10 0v4M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z",
  unlock:       "M11 11V7a4 4 0 018 0M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z",
  trash:        "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  logout:       "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  check:        "M20 6L9 17l-5-5",
  x:            "M18 6L6 18M6 6l12 12",
  refresh:      "M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0114.83-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  user:         "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  chevronRight: "M9 18l6-6-6-6",
};

export default function Icon({ name, size = 20, color = "currentColor", strokeWidth = 2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}
