import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  value: string | number;
  description?: string;
  trend?: { value: string; positive?: boolean; neutral?: boolean };
  accent?: string;
  index?: number;
}

const StatCard = ({ icon: Icon, label, value, description, trend, accent = 'var(--brand)', index = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="card card-hover p-5 relative overflow-hidden group"
    >
      {/* soft accent glow */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40 pointer-events-none"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center border mb-3"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border-subtle)',
            color: accent,
          }}
        >
          <Icon size={20} />
        </div>
        {trend && (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full"
            style={{
              color: trend.neutral ? 'var(--text-muted)' : trend.positive ? 'var(--success)' : 'var(--danger)',
              background: trend.neutral
                ? 'var(--surface)'
                : trend.positive
                ? 'color-mix(in srgb, var(--success) 12%, transparent)'
                : 'color-mix(in srgb, var(--danger) 12%, transparent)',
            }}
          >
            {trend.neutral ? <Minus size={11} /> : trend.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
        {label}
      </p>
      <p className="text-3xl font-black mt-0.5 tabular-nums" style={{ color: 'var(--text-heading)' }}>
        {value}
      </p>
      {description && (
        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default StatCard;