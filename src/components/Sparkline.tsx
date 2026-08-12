export function Sparkline({ points, color = "var(--series-1)" }: { points: string; color?: string }) {
  return (
    <svg
      width="100%"
      height="28"
      viewBox="0 0 72 24"
      preserveAspectRatio="none"
      className="mt-1"
      aria-hidden
    >
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
