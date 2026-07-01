"use client";

// src/lib/hooks/useBookmarks.ts
import { useState, useEffect, useCallback } from "react";
import {
  doc, getDoc, updateDoc, arrayUnion, arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useUser } from "@/lib/store";
import type { Bookmark } from "@/types";

const LOCAL_KEY = "pv_bookmarks";

function getLocalBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLocalBookmarks(bookmarks: Bookmark[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(bookmarks));
}

export function useBookmarks() {
  const user = useUser();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setBookmarks(getLocalBookmarks());
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "userProgress", user.uid));
        if (snap.exists()) setBookmarks(snap.data().bookmarks ?? []);
      } catch { setBookmarks(getLocalBookmarks()); }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  const addBookmark = useCallback(
    async (item: Omit<Bookmark, "id" | "savedAt">) => {
      const bookmark: Bookmark = {
        ...item,
        id:      `${item.type}-${item.targetId}`,
        savedAt: new Date(),
      };
      // Deduplicate
      if (bookmarks.some((b) => b.id === bookmark.id)) return;

      const updated = [...bookmarks, bookmark];
      setBookmarks(updated);

      if (!user) { saveLocalBookmarks(updated); return; }
      try {
        await updateDoc(doc(db, "userProgress", user.uid), {
          bookmarks: arrayUnion(bookmark),
        });
      } catch { setBookmarks(bookmarks); }
    },
    [user, bookmarks]
  );

  const removeBookmark = useCallback(
    async (bookmarkId: string) => {
      const target  = bookmarks.find((b) => b.id === bookmarkId);
      if (!target) return;

      const updated = bookmarks.filter((b) => b.id !== bookmarkId);
      setBookmarks(updated);

      if (!user) { saveLocalBookmarks(updated); return; }
      try {
        await updateDoc(doc(db, "userProgress", user.uid), {
          bookmarks: arrayRemove(target),
        });
      } catch { setBookmarks(bookmarks); }
    },
    [user, bookmarks]
  );

  const isBookmarked = useCallback(
    (type: Bookmark["type"], targetId: string) =>
      bookmarks.some((b) => b.type === type && b.targetId === targetId),
    [bookmarks]
  );

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, loading };
}
