import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  useRef,
} from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'ai';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  createdAt: number;
  read: boolean;
  important?: boolean;
}

export interface ToastItem {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
}

interface NotifyOptions {
  important?: boolean;
  /** Skip the persistent (bell) notification and only show a transient toast. */
  toastOnly?: boolean;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  toasts: ToastItem[];
  notify: (type: NotificationType, title: string, message?: string, options?: NotifyOptions) => void;
  toast: (type: NotificationType, title: string, message?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
  dismissToast: (id: string) => void;
}

const STORAGE_KEY = 'portfolio-notifications';
const MAX_STORED = 40;
const TOAST_LIFETIME_MS = 5000;

function loadStored(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

let idCounter = 0;
const nextId = () => `n-${Date.now()}-${idCounter++}`;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  // Hydrate from localStorage only once, after mount.
  useEffect(() => {
    setNotifications(loadStored());
  }, []);

  // Persist whenever notifications change.
  useEffect(() => {
    if (notifications.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX_STORED)));
      } catch {
        /* storage full / private mode — non-fatal */
      }
    }
  }, [notifications]);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    if (timersRef.current[id]) {
      window.clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const toast = useCallback(
    (type: NotificationType, title: string, message?: string) => {
      const id = nextId();
      setToasts((prev) => [...prev.slice(-2), { id, type, title, message }]);
      timersRef.current[id] = window.setTimeout(() => {
        dismissToast(id);
      }, TOAST_LIFETIME_MS);
    },
    [dismissToast],
  );

  const notify = useCallback(
    (type: NotificationType, title: string, message?: string, options?: NotifyOptions) => {
      if (!options?.toastOnly) {
        const item: AppNotification = {
          id: nextId(),
          type,
          title,
          message,
          createdAt: Date.now(),
          read: false,
          important: options?.important,
        };
        setNotifications((prev) => [item, ...prev].slice(0, MAX_STORED));
      }
      toast(type, title, message);
    },
    [toast],
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      toasts,
      notify,
      toast,
      markAsRead,
      markAllAsRead,
      dismiss,
      clearAll,
      dismissToast,
    }),
    [notifications, unreadCount, toasts, notify, toast, markAsRead, markAllAsRead, dismiss, clearAll, dismissToast],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotification(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a <NotificationProvider>');
  }
  return context;
}