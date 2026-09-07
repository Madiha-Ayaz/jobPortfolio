import React, { useRef, useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { THEME_OPTIONS, AppTheme } from '@/lib/themes';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const current = THEME_OPTIONS.find((t) => t.id === theme) ?? THEME_OPTIONS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        aria-expanded={open}
        aria-haspopup="listbox"
        title="Change theme"
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border-default)',
          color: 'var(--text-muted)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--brand)';
          e.currentTarget.style.color = 'var(--brand-light)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-default)';
          e.currentTarget.style.color = 'var(--text-muted)';
        }}
      >
        <Palette className="w-4.5 h-4.5" size={18} />
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-transparent" style={{ background: current.swatches[0] }} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Theme options"
          className="absolute right-0 top-11 w-64 rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden z-50"
          style={{
            background: 'var(--modal-bg)',
            borderColor: 'var(--border-default)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div
            className="px-4 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-dim)' }}
          >
            Theme
          </div>
          <div className="max-h-80 overflow-y-auto no-scrollbar p-1.5 space-y-1">
            {THEME_OPTIONS.map((opt) => {
              const active = opt.id === theme;
              return (
                <button
                  key={opt.id}
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setTheme(opt.id as AppTheme);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                  style={{
                    background: active ? 'var(--surface-hover)' : 'transparent',
                    border: `1px solid ${active ? 'color-mix(in srgb, var(--brand) 40%, transparent)' : 'transparent'}`,
                  }}
                >
                  <div className="flex gap-1">
                    {opt.swatches.map((c) => (
                      <span
                        key={c}
                        className="w-3.5 h-3.5 rounded-full border"
                        style={{ background: c, borderColor: 'rgba(255,255,255,0.15)' }}
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold" style={{ color: active ? 'var(--brand-light)' : 'var(--text-heading)' }}>
                      {opt.label}
                    </div>
                    <div className="text-[11px] truncate" style={{ color: 'var(--text-dim)' }}>
                      {opt.description}
                    </div>
                  </div>
                  {active && <Check size={14} style={{ color: 'var(--brand)' }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;