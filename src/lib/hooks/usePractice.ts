"use client";

// src/lib/hooks/usePractice.ts
import { useState, useCallback, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useUser } from "@/lib/store";
import type { Question } from "@/lib/constants/practice-data";

export interface AttemptRecord {
  questionId:   string;
  correct:      boolean;
  attempts:     number;
  lastAttempt:  string;   // ISO date
  nextReview:   string;   // ISO date (spaced repetition)
}

const LOCAL_KEY = "pv_practice";

function getLocalAttempts(): AttemptRecord[] {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]"); } catch { return []; }
}
function saveLocalAttempts(records: AttemptRecord[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(records));
}

// Spaced repetition intervals (days)
function nextReviewDate(correct: boolean, attempts: number): string {
  const days = correct
    ? [1, 3, 7, 14, 30, 60][Math.min(attempts - 1, 5)]
    : 1;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function usePractice() {
  const user = useUser();
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) { setAttempts(getLocalAttempts()); setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, "practiceProgress", user.uid));
        setAttempts(snap.exists() ? (snap.data().attempts ?? []) : []);
      } catch { setAttempts(getLocalAttempts()); }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  const recordAttempt = useCallback(async (questionId: string, correct: boolean) => {
    const existing = attempts.find((a) => a.questionId === questionId);
    const newAttempts = existing ? attempts.map((a) => a.questionId === questionId
      ? { ...a, correct, attempts: a.attempts + 1, lastAttempt: new Date().toISOString(), nextReview: nextReviewDate(correct, a.attempts + 1) }
      : a
    ) : [...attempts, {
      questionId, correct, attempts: 1,
      lastAttempt: new Date().toISOString(),
      nextReview: nextReviewDate(correct, 1),
    }];

    setAttempts(newAttempts);

    if (!user) { saveLocalAttempts(newAttempts); return; }
    try {
      const ref = doc(db, "practiceProgress", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { uid: user.uid, attempts: newAttempts, createdAt: serverTimestamp() });
      } else {
        await updateDoc(ref, { attempts: newAttempts, updatedAt: serverTimestamp() });
      }
    } catch { saveLocalAttempts(newAttempts); }
  }, [user, attempts]);

  const getAttempt = useCallback(
    (questionId: string) => attempts.find((a) => a.questionId === questionId),
    [attempts]
  );

  const isCorrect   = useCallback((id: string) => attempts.find((a) => a.questionId === id)?.correct ?? null, [attempts]);
  const totalSolved = attempts.length;
  const totalCorrect = attempts.filter((a) => a.correct).length;
  const accuracy    = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

  // Questions due for review (spaced repetition)
  const dueForReview = attempts.filter((a) => new Date(a.nextReview) <= new Date() && !a.correct);

  return {
    attempts, loading, recordAttempt, getAttempt,
    isCorrect, totalSolved, totalCorrect, accuracy, dueForReview,
  };
}
