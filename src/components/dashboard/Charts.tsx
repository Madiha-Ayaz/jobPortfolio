import { motion } from 'framer-motion';

export interface ChartDatum {
  label: string;
  value: number;
  color: string;
}

/* ── Responsive SVG donut with tooltips + legend ──────────────────────── */

export function DonutChart({
  data,
  centerLabel,
  size = 180,
}: {
  data: ChartDatum[];
  centerLabel?: string;
  size?: number;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const stroke = 20;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--surface-hover)"
            strokeWidth={stroke}
          />
          {data.map((d, i) => {
            const percent = d.value / total;
            const length = circumference * percent;
            const o = offset;
            offset += length;
            return (
              <motion.circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={stroke}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-o}
                strokeLinecap="butt"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <title>{`${d.label}: ${d.value} (${(percent * 100).toFixed(1)}%)`}</title>
              </motion.circle>
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black tabular-nums" style={{ color: 'var(--text-heading)' }}>
            {total}
          </span>
          {centerLabel && (
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
              {centerLabel}
            </span>
          )}
        </div>
      </div>
      <div className="w-full flex-1 space-y-2">
        {data.map((d, i) => {
          const percent = (d.value / total) * 100;
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="flex-1 truncate" style={{ color: 'var(--text-body)' }}>
                {d.label}
              </span>
              <span className="tabular-nums font-bold" style={{ color: 'var(--text-heading)' }}>
                {d.value}
              </span>
              <span className="tabular-nums w-11 text-right" style={{ color: 'var(--text-dim)' }}>
                {percent.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Horizontal bar chart ─────────────────────────────────────────────── */

export function BarChart({ data, suffix = '' }: { data: ChartDatum[]; suffix?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="w-full space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-28 flex-shrink-0 truncate text-xs" style={{ color: 'var(--text-body)' }}>
            {d.label}
          </span>
          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface-hover)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: d.color }}
              initial={{ width: 0 }}
              whileInView={{ width: `${(d.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
            />
          </div>
          <span className="w-10 text-right text-xs font-bold tabular-nums" style={{ color: 'var(--text-heading)' }}>
            {d.value}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Skill proficiency bars ───────────────────────────────────────────── */

export function SkillBars({ data }: { data: ChartDatum[] }) {
  return (
    <div className="w-full space-y-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-body)' }}>{d.label}</span>
            <span className="tabular-nums font-bold" style={{ color: 'var(--text-heading)' }}>
              {d.value}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-hover)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: d.color }}
              initial={{ width: 0 }}
              whileInView={{ width: `${d.value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.04, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}