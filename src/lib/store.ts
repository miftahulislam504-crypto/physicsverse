// src/lib/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserProgress, Toast } from "@/types";
import type { Locale } from "@/i18n/request";

// ─── Auth Slice ───────────────────────────────────────────────────────────────
interface AuthSlice {
  user:     User | null;
  progress: UserProgress | null;
  loading:  boolean;
  setUser:     (user: User | null) => void;
  setProgress: (progress: UserProgress | null) => void;
  setLoading:  (loading: boolean) => void;
}

// ─── UI Slice ─────────────────────────────────────────────────────────────────
interface UISlice {
  theme:           "light" | "dark" | "system";
  locale:          Locale;
  sidebarOpen:     boolean;
  sidebarCollapsed:boolean;
  toasts:          Toast[];
  setTheme:        (theme: "light" | "dark" | "system") => void;
  setLocale:       (locale: Locale) => void;
  toggleSidebar:   () => void;
  collapseSidebar: (v: boolean) => void;
  addToast:        (toast: Omit<Toast, "id">) => void;
  removeToast:     (id: string) => void;
}

// ─── Combined Store ───────────────────────────────────────────────────────────
type Store = AuthSlice & UISlice;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // ── Auth ────────────────────────────────────────────────────
      user:        null,
      progress:    null,
      loading:     true,
      setUser:     (user)     => set({ user }),
      setProgress: (progress) => set({ progress }),
      setLoading:  (loading)  => set({ loading }),

      // ── UI ──────────────────────────────────────────────────────
      theme:            "dark",     // PhysicsVerse defaults to dark
      locale:           "en",
      sidebarOpen:      true,
      sidebarCollapsed: false,
      toasts:           [],

      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        if (theme === "dark")  root.classList.add("dark");
        else if (theme === "light") root.classList.remove("dark");
        else {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          root.classList.toggle("dark", prefersDark);
        }
      },

      setLocale: (locale) => {
        set({ locale });
        // Set cookie for server components (next-intl)
        document.cookie = `locale=${locale};path=/;max-age=31536000`;
        document.documentElement.lang = locale;
        // Force page reload so next-intl picks up new locale
        window.location.reload();
      },

      toggleSidebar:   () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      collapseSidebar: (v) => set({ sidebarCollapsed: v }),

      addToast: (toast) => {
        const id = Math.random().toString(36).slice(2);
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        // Auto-dismiss
        setTimeout(() => get().removeToast(id), toast.duration ?? 4000);
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name:    "physicsverse-ui",
      // Only persist UI preferences — not auth state
      partialize: (s) => ({
        theme:            s.theme,
        locale:           s.locale,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
    }
  )
);

// ─── Convenience Selectors ─────────────────────────────────────────────────
export const useUser     = () => useStore((s) => s.user);
export const useProgress = () => useStore((s) => s.progress);
export const useLocale   = () => useStore((s) => s.locale);
export const useTheme    = () => useStore((s) => s.theme);
export const useToasts   = () => useStore((s) => s.toasts);
