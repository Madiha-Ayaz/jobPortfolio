import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useNotification, NotificationType } from '@/context/NotificationContext';
import { useTheme } from '@/context/ThemeContext';

const TYPE_ICON: Record<NotificationType, React.ComponentType<{ size?: number | string; style?: React.CSSProperties }>> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  ai: Sparkles,
};

const NotificationCenter = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismiss,
    clearAll,
  } = useNotification();
  const { t } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('time.justNow');
    if (mins < 60) return `${mins}${t('time.minutesAgo')}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}${t('time.hoursAgo')}`;
    const days = Math.floor(hours / 24);
    return `${days}${t('time.daysAgo')}`;
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border"
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
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center border"
            style={{
              background: 'var(--danger)',
              color: '#fff',
              borderColor: 'var(--bg)',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-11 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border shadow-2xl backdrop-blur-2xl overflow-hidden z-50 flex flex-col"
            style={{
              background: 'var(--modal-bg)',
              borderColor: 'var(--border-default)',
              boxShadow: 'var(--card-shadow)',
            }}
            role="dialog"
            aria-label="Notifications"
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <div className="flex items-center gap-2">
                <Bell size={16} style={{ color: 'var(--brand)' }} />
                <span className="text-sm font-bold" style={{ color: 'var(--text-heading)' }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span
                    className="badge"
                    style={{ color: 'var(--brand-light)', borderColor: 'color-mix(in srgb, var(--brand) 40%, transparent)' }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-dim)' }}
                  title="Mark all as read"
                  aria-label="Mark all notifications as read"
                >
                  <CheckCheck size={16} />
                </button>
                <button
                  onClick={clearAll}
                  disabled={notifications.length === 0}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-dim)' }}
                  title="Clear all notifications"
                  aria-label="Clear all notifications"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[320px] no-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <Bell size={28} style={{ color: 'var(--text-dim)' }} />
                  <p className="mt-2 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    You're all caught up
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
                    Activity from your portfolio will show up here.
                  </p>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = TYPE_ICON[n.type];
                  const unread = !n.read;
                  return (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className="flex gap-3 px-4 py-3 border-b transition-colors cursor-pointer group"
                      style={{
                        borderColor: 'var(--border-subtle)',
                        background: unread ? 'color-mix(in srgb, var(--brand) 6%, transparent)' : 'transparent',
                      }}
                    >
                      <div className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border"
                        style={{
                          background: 'var(--surface)',
                          borderColor: 'var(--border-subtle)',
                          color: n.type === 'ai' ? 'var(--highlight)' : n.type === 'success' ? 'var(--success)' : n.type === 'error' ? 'var(--danger)' : n.type === 'warning' ? 'var(--warning)' : 'var(--accent)',
                        }}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-semibold truncate" style={{ color: unread ? 'var(--text-heading)' : 'var(--text-body)' }}>
                            {n.title}
                          </p>
                          <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-dim)' }}>
                            {timeAgo(n.createdAt)}
                          </span>
                        </div>
                        {n.message && (
                          <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                            {n.message}
                          </p>
                        )}
                        {n.important && (
                          <span className="text-[10px] font-bold uppercase tracking-wide mt-1 inline-flex items-center gap-1" style={{ color: 'var(--warning)' }}>
                            Important
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismiss(n.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity self-start p-1 rounded-md"
                        style={{ color: 'var(--text-dim)' }}
                        title="Dismiss"
                        aria-label={`Dismiss notification: ${n.title}`}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div
              className="px-4 py-2 text-[11px] flex items-center justify-between border-t"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-dim)' }}
            >
              <span>Click a notification to mark it read</span>
              {notifications.length > 0 && (
                <span>{notifications.filter((n) => !n.read).length} unread</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;