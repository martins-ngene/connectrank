import React from 'react';

interface ConnectRankLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  withBackground?: boolean;
}

export const ConnectRankLogo: React.FC<ConnectRankLogoProps> = ({
  size = 28,
  className = '',
  withBackground = false,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ConnectRank Logo"
      {...props}
    >
      <defs>
        <linearGradient id="cr-logo-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>

      {/* Optional container background */}
      {withBackground && (
        <rect
          x="1.5"
          y="1.5"
          width="29"
          height="29"
          rx="8"
          fill="#0B0F19"
          stroke="url(#cr-logo-grad)"
          strokeWidth="1.5"
        />
      )}

      {/* Ascending Rank & Network Connection Trajectory */}
      <path
        d="M7 21L13 15L19 18L25 9"
        stroke="url(#cr-logo-grad)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Vertical projection guides */}
      <path
        d="M13 15V24M19 18V24"
        stroke="#60A5FA"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="1.5 2"
        strokeOpacity="0.6"
      />

      {/* Network Connection Nodes */}
      <circle cx="7" cy="21" r="2.5" fill="currentColor" fillOpacity="0.15" stroke="#93C5FD" strokeWidth="1.5" />
      <circle cx="7" cy="21" r="1" fill="#93C5FD" />

      <circle cx="13" cy="15" r="2.5" fill="currentColor" fillOpacity="0.15" stroke="#60A5FA" strokeWidth="1.5" />
      <circle cx="13" cy="15" r="1" fill="#60A5FA" />

      <circle cx="19" cy="18" r="2.2" fill="currentColor" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.5" />
      <circle cx="19" cy="18" r="0.9" fill="#38BDF8" />

      {/* Apex Authority Node (Top Rank Decision Maker) */}
      <circle cx="25" cy="9" r="3.75" fill="url(#cr-logo-grad)" />
      {/* Radiant 4-point star representing peak match / executive authority */}
      <path
        d="M25 6.8L25.6 8.4L27.2 9L25.6 9.6L25 11.2L24.4 9.6L22.8 9L24.4 8.4Z"
        fill="#FFFFFF"
      />
    </svg>
  );
};
