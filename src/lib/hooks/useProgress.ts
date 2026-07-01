"use client";

// src/lib/hooks/useProgress.ts
import { useState, useEffect, useCallback } from "react";
import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useUser } from "@/lib/store";

const LOCAL_KEY = "pv_progress";

// ─── Local storage fallback (for logged-out users) ────────────────────────────
function getLocalProgress(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addLocalProgress(chapterId: string): string[] {
  const current = getLocalProgress();
  if (current.includes(chapterId)) return current;
  const updated = [...current, chapterId];
  localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  return updated;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useProgress() {
  const user = useUser();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load progress on mount / user change
  useEffect(() => {
    async function load() {
      if (!user) {
        setCompletedIds(getLocalProgress());
        setLoading(false);
        return;
      }

      try {
        const ref  = doc(db, "userProgress", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setCompletedIds(data.completedChapters ?? []);
        } else {
          // Create empty progress doc
          await setDoc(ref, {
            uid:               user.uid,
            completedChapters: [],
            completedLabs:     [],
            solvedProblems:    [],
            bookmarks:         [],
            streakDays:        0,
            lastStreakDate:     "",
            totalXP:           0,
            badges:            [],
            weakTopics:        [],
            createdAt:         serverTimestamp(),
          });
          setCompletedIds([]);
        }
      } catch (err) {
        console.error("Progress load error:", err);
        setCompletedIds(getLocalProgress());
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  // Mark a chapter complete
  const markComplete = useCallback(
    async (chapterId: string, xpReward = 50): Promise<void> => {
      if (completedIds.includes(chapterId)) return;

      const updated = [...completedIds, chapterId];
      setCompletedIds(updated); // Optimistic update

      if (!user) {
        addLocalProgress(chapterId);
        return;
      }

      try {
        const ref = doc(db, "userProgress", user.uid);
        await updateDoc(ref, {
          completedChapters: arrayUnion(chapterId),
          totalXP:           (await getDoc(ref)).data()?.totalXP ?? 0 + xpReward,
          lastActiveAt:      serverTimestamp(),
        });
      } catch (err) {
        console.error("markComplete error:", err);
        setCompletedIds(completedIds); // Rollback on error
      }
    },
    [user, completedIds]
  );

  const isComplete = useCallback(
    (chapterId: string) => completedIds.includes(chapterId),
    [completedIds]
  );

  return { completedIds, isComplete, markComplete, loading };
}
