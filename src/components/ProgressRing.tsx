import { useId } from "react";

interface ProgressRingProps {
  completed: number;
  total: number;
  size?: number;
}

export function ProgressRing({ completed, total, size = 74 }: ProgressRingProps) {
  const gradientId = useId();
  const radius = size / 2 - 5;
  const circumference = 2 * Math.PI * radius;
  const ratio = total === 0 ? 0 : completed / total;
  const dashoffset = circumference * (1 - ratio);
  const center = size / 2;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent1)" />
            <stop offset="100%" stopColor="var(--accent2)" />
          </linearGradient>
        </defs>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="oklch(90% 0.02 75)" strokeWidth="6" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="progress-ring__label">
        {completed}/{total}
      </div>
    </div>
  );
}
