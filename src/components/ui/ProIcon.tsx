/**
 * ProIcon — A small library of professional, outline-based SVG icons.
 * No emoji, no cartoon, no decorative sparkles. Clean 1.5px stroke geometry.
 */

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

export const IconCode = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M8 6 2 12l6 6" />
    <path d="m16 6 6 6-6 6" />
    <path d="m14 4-4 16" />
  </svg>
);

export const IconBrain = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M9 4a3 3 0 0 0-3 3v0a3 3 0 0 0-2 3v0a3 3 0 0 0 1 2.3" />
    <path d="M9 4a3 3 0 0 1 3 3v0a3 3 0 0 1 2 3v0a3 3 0 0 1-1 2.3" />
    <path d="M6 12.3a3 3 0 0 0 1 5.7v0a3 3 0 0 0 2 2" />
    <path d="M12 12.3a3 3 0 0 1-1 5.7v0a3 3 0 0 1-2 2" />
    <path d="M9 20v-7" />
    <path d="M12 20v-7" />
  </svg>
);

export const IconGlobe = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18" />
    <path d="M12 3a14 14 0 0 0 0 18" />
  </svg>
);

export const IconLayers = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5" />
    <path d="m3 17 9 5 9-5" />
  </svg>
);

export const IconSpark = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3v4" />
    <path d="M12 17v4" />
    <path d="M3 12h4" />
    <path d="M17 12h4" />
    <path d="m5.6 5.6 2.8 2.8" />
    <path d="m15.6 15.6 2.8 2.8" />
    <path d="m5.6 18.4 2.8-2.8" />
    <path d="m15.6 8.4 2.8-2.8" />
  </svg>
);

export const IconArrowRight = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const IconArrowDown = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14" />
    <path d="m6 13 6 6 6-6" />
  </svg>
);

export const IconChat = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12Z" />
  </svg>
);

export const IconUser = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

export const IconBriefcase = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 13h18" />
  </svg>
);

export const IconMail = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const IconExternal = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
  </svg>
);

export const IconStar = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="m12 3 2.7 5.5 6 .9-4.4 4.3 1.1 6L12 17l-5.4 2.7 1.1-6L3.3 9.4l6-.9L12 3Z" />
  </svg>
);
