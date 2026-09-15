interface IconProps {
  size?: number;
}

export function InboxIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16l2 8v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6l2-8z" />
      <path d="M2 12h5l2 3h6l2-3h5" />
    </svg>
  );
}

export function TodayIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" />
      <line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" />
      <line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
    </svg>
  );
}

export function UpcomingIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function PlusIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function ClockIcon({ size = 15 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}

export function CloseIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function FlameIcon({ size = 17 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c0-1-.5-2-1-2.5.8 2 .2 4-2 4.5-2.5.5-4-1.5-4-3.5C8 6 11 5 12 2z" />
    </svg>
  );
}

export function CheckboxIcon({ checked, size = 21 }: IconProps & { checked: boolean }) {
  if (!checked) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: "visible" }}>
      <circle cx="12" cy="12" r="9" fill="var(--accent1)" />
      <path d="M8 12.5l2.5 2.5 5-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <g stroke="var(--accent2)" strokeWidth="1.6" strokeLinecap="round">
        <line x1="12" y1="-1" x2="12" y2="-3" />
        <line x1="23" y1="12" x2="25" y2="12" />
        <line x1="20.5" y1="3.5" x2="22" y2="2" />
        <line x1="3.5" y1="3.5" x2="2" y2="2" />
      </g>
    </svg>
  );
}
