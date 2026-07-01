"use client";

// src/components/layout/Providers.tsx
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onAuthChange } from "@/lib/firebase/auth";
import { useStore }     from "@/lib/store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:        60 * 1000,   // 1 minute
      retry:            2,
      refetchOnWindowFocus: false,
    },
  },
});

function ThemeInitializer() {
  const { theme, setTheme } = useStore();

  useEffect(() => {
    // Apply persisted theme on mount
    setTheme(theme);

    // Listen to system preference changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") setTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

function AuthObserver() {
  const { setUser, setLoading } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Map FirebaseUser → our User type
        setUser({
          id:           firebaseUser.uid,
          uid:          firebaseUser.uid,
          email:        firebaseUser.email ?? "",
          displayName:  firebaseUser.displayName ?? "Physics Explorer",
          photoURL:     firebaseUser.photoURL ?? undefined,
          locale:       "en",
          learningPath: "curious",
          level:        "electron",
          createdAt:    new Date(),
          lastActiveAt: new Date(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInitializer />
      <AuthObserver />
      {children}
    </QueryClientProvider>
  );
}
