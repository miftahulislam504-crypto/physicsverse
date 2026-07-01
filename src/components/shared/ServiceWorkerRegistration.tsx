"use client";

// src/components/shared/ServiceWorkerRegistration.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Wifi, WifiOff } from "lucide-react";

export function ServiceWorkerRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOffline,       setIsOffline]       = useState(false);
  const [showInstall,     setShowInstall]     = useState(false);
  const [deferredPrompt,  setDeferredPrompt]  = useState<any>(null);

  // Register service worker
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            setUpdateAvailable(true);
          }
        });
      });
    }).catch((err) => console.error("SW registration failed:", err));
  }, []);

  // Online/offline detection
  useEffect(() => {
    function updateStatus() { setIsOffline(!navigator.onLine); }
    updateStatus();
    window.addEventListener("online",  updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online",  updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  // PWA install prompt
  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstall(false);
  }

  function handleUpdate() {
    window.location.reload();
  }

  return (
    <>
      {/* Offline indicator */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
            className="fixed top-[var(--navbar-height)] left-0 right-0 z-30 flex items-center justify-center gap-2 py-2 text-xs font-medium"
            style={{ background: "rgba(239,68,68,0.95)", color: "#fff" }}
          >
            <WifiOff size={13} /> You're offline — showing cached content
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update available toast */}
      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-primary)", boxShadow: "var(--shadow-lg)" }}
          >
            <span className="text-sm" style={{ color: "var(--color-text-primary)" }}>
              New version available!
            </span>
            <button onClick={handleUpdate}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ background: "var(--color-primary)" }}>
              Update Now
            </button>
            <button onClick={() => setUpdateAvailable(false)}>
              <X size={14} style={{ color: "var(--color-text-muted)" }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install prompt */}
      <AnimatePresence>
        {showInstall && (
          <motion.div
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border max-w-xs"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-lg)" }}
          >
            <Download size={18} style={{ color: "var(--color-primary)" }} />
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>Install PhysicsVerse</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Quick access, offline support</p>
            </div>
            <button onClick={handleInstall}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex-shrink-0"
              style={{ background: "var(--color-primary)" }}>
              Install
            </button>
            <button onClick={() => setShowInstall(false)}>
              <X size={14} style={{ color: "var(--color-text-muted)" }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
