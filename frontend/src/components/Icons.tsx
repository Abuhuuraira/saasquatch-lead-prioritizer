// Inline 16px stroke icons on a 24-grid. Every semantic color in the UI is paired
// with one of these plus a text label, so meaning never rides on hue alone.
type P = { size?: number; className?: string };
const base = (size: number) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.75,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  "aria-hidden": true, focusable: false
});

export const Flame = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3c.5 3 2.5 4 4 6a6 6 0 1 1-10.4 4.1C5.6 9.5 8.5 8 9 4c1.6.9 2.6 2 3 4Z" />
  </svg>
);
export const HalfSun = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="3.6" /><path d="M12 4.2V2.5M12 21.5v-1.7M19.8 12h1.7M2.5 12h1.7M17.5 6.5l1.2-1.2M5.3 18.7l1.2-1.2" />
  </svg>
);
export const Snowflake = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 2.5v19M4 7l16 10M20 7 4 17M12 6.5 9.6 4.4M12 6.5l2.4-2.1M12 17.5l-2.4 2.1M12 17.5l2.4 2.1" />
  </svg>
);
export const CheckCircle = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" /><path d="m8.5 12.2 2.4 2.4 4.6-5" />
  </svg>
);
export const AlertTriangle = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M10.6 3.9 2.6 17.5A1.6 1.6 0 0 0 4 20h16a1.6 1.6 0 0 0 1.4-2.5L13.4 3.9a1.6 1.6 0 0 0-2.8 0Z" />
    <path d="M12 9.5v4M12 16.8h.01" />
  </svg>
);
export const XCircle = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" /><path d="m9.2 9.2 5.6 5.6M14.8 9.2l-5.6 5.6" />
  </svg>
);
export const Search = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.4-4.4" />
  </svg>
);
export const Upload = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M21 15v3.5A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5V15M12 3v12M7.5 7.5 12 3l4.5 4.5" />
  </svg>
);
export const Download = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M21 15v3.5A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5V15M12 15V3M7.5 10.5 12 15l4.5-4.5" />
  </svg>
);
export const Sun = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.4 5.6 17 7M7 17l-1.4 1.4M18.4 18.4 17 17M7 7 5.6 5.6" />
  </svg>
);
export const Moon = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
  </svg>
);
export const Sliders = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2.2" /><circle cx="8" cy="17" r="2.2" />
  </svg>
);
export const Chevron = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}><path d="m6 9 6 6 6-6" /></svg>
);
export const Phone = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M21 16.5v2.6a1.8 1.8 0 0 1-2 1.8 17.6 17.6 0 0 1-7.7-2.7 17.3 17.3 0 0 1-5.3-5.3A17.6 17.6 0 0 1 3.3 5.1 1.8 1.8 0 0 1 5.1 3h2.6a1.8 1.8 0 0 1 1.8 1.6c.1.9.3 1.7.6 2.5a1.8 1.8 0 0 1-.4 1.9l-1.1 1.1a14 14 0 0 0 5.3 5.3l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.5.6a1.8 1.8 0 0 1 1.6 1.8Z" />
  </svg>
);
export const Layers = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m12 2.5 9.5 5-9.5 5-9.5-5 9.5-5ZM2.5 16.5 12 21.5l9.5-5M2.5 12 12 17l9.5-5" />
  </svg>
);
export const Copy = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="9" y="9" width="12" height="12" rx="2.2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </svg>
);
export const ArrowUpDown = ({ size = 14, className }: P) => (
  <svg {...base(size)} className={className}><path d="M7 15l3 3 3-3M10 18V6M17 9l-3-3-3 3M14 6v12" /></svg>
);
export const Target = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" />
  </svg>
);
export const ShieldCheck = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 21.5s7.5-3.4 7.5-9.2V5.6L12 2.5 4.5 5.6v6.7c0 5.8 7.5 9.2 7.5 9.2Z" /><path d="m9 12 2.2 2.2L15.2 10" />
  </svg>
);
export const Dedupe = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="3" width="11" height="11" rx="2.2" /><path d="M17.5 8H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-1.5" />
  </svg>
);
export const Inbox = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.2" /><path d="m3 6.5 8.1 5.6a1.6 1.6 0 0 0 1.8 0L21 6.5" />
  </svg>
);
