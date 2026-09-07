import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, Sparkles, X } from 'lucide-react';
import { useNotification, NotificationType } from '@/context/NotificationContext';

const TYPE_ICON: Record<NotificationType, React.ComponentType<{ size?: number | string; style?: React.CSSProperties }>> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  ai: Sparkles,
};

const TYPE_COLOR: Record<NotificationType, string> = {
  success: 'var(--success)',
  error: 'var(--danger)',
  warning: 'var(--warning)',
  info: 'var(--accent)',
  ai: 'var(--highlight)',
};

const ToastViewport = () => {
  const { toasts, dismissToast } = useNotification();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-20 right-4 z-[90] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)] pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = TYPE_ICON[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              className="pointer-events-auto rounded-xl border shadow-2xl backdrop-blur-xl overflow-hidden"
              style={{
                background: 'var(--modal-bg)',
                borderColor: 'var(--border-default)',
                boxShadow: 'var(--card-shadow)',
              }}
              role="status"
            >
              <div className="flex gap-3 px-4 py-3">
                <Icon size={18} style={{ color: TYPE_COLOR[t.type], marginTop: 1, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--text-heading)' }}>
                    {t.title}
                  </p>
                  {t.message && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {t.message}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => dismissToast(t.id)}
                  className="p-1 rounded-md hover:opacity-70 transition-opacity flex-shrink-0 self-start"
                  style={{ color: 'var(--text-dim)' }}
                  aria-label="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="h-0.5" style={{ background: TYPE_COLOR[t.type] }} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastViewport;