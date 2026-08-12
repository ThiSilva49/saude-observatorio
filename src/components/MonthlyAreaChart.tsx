const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function MonthlyAreaChart({
  linePoints,
  areaPoints,
  color = "var(--series-1)",
  fill = "var(--series-1-fill)",
  monthCount = 12,
}: {
  linePoints: string;
  areaPoints: string;
  color?: string;
  fill?: string;
  monthCount?: number;
}) {
  return (
    <div>
      <svg
        viewBox="0 0 600 190"
        preserveAspectRatio="none"
        style={{ width: "100%", height: 200, display: "block" }}
      >
        <line x1="0" x2="600" y1="0" y2="0" stroke="var(--gridline)" strokeWidth="1" />
        <line x1="0" x2="600" y1="63" y2="63" stroke="var(--gridline)" strokeWidth="1" />
        <line x1="0" x2="600" y1="127" y2="127" stroke="var(--gridline)" strokeWidth="1" />
        <line x1="0" x2="600" y1="189" y2="189" stroke="var(--baseline)" strokeWidth="1" />
        <polygon points={areaPoints} fill={fill} />
        <polyline
          points={linePoints}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-[var(--text-muted)]">
        {MONTH_LABELS.slice(0, monthCount).map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}
