import React from "react";

interface SpinnerProps {
  size?: number;
  strokeWidth?: number;
}

export function Spinner({ size = 32, strokeWidth = 4 }: SpinnerProps) {
  const half = size / 2;
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="status"
      aria-label="Loading"
    >
      <circle
        cx={half}
        cy={half}
        r={half - strokeWidth / 2}
        className="opacity-25"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <path
        d={`
          M ${half} ${strokeWidth / 2}
          a ${half - strokeWidth / 2} ${half - strokeWidth / 2} 0 1 1 0 ${
          size - strokeWidth
        }
        `}
        className="opacity-75"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
