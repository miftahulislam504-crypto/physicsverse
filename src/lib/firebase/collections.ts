// src/lib/firebase/collections.ts
// Centralised Firestore collection references + typed converters

import {
  collection,
  doc,
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { db } from "./config";
import type {
  User,
  UserProgress,
  Chapter,
  Formula,
  Lab,
  Problem,
  Post,
  Scientist,
  PhysicsLaw,
  PhysicsConstant,
} from "@/types";

// ─── Generic Converter Factory ────────────────────────────────────────────────
function makeConverter<T extends { id: string }>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: WithFieldValue<T>) {
      const { id: _id, ...rest } = data as T;
      return rest;
    },
    fromFirestore(snap: QueryDocumentSnapshot, options: SnapshotOptions): T {
      return { id: snap.id, ...snap.data(options) } as T;
    },
  };
}

// ─── Collection References ─────────────────────────────────────────────────
export const Collections = {
  // Users
  users: () =>
    collection(db, "users").withConverter(makeConverter<User>()),

  userProgress: (uid: string) =>
    doc(db, "userProgress", uid).withConverter(
      makeConverter<UserProgress>()
    ) as DocumentReference<UserProgress>,

  // Learn
  chapters: () =>
    collection(db, "chapters").withConverter(makeConverter<Chapter>()),

  chapter: (id: string) =>
    doc(db, "chapters", id).withConverter(makeConverter<Chapter>()),

  // Formulas
  formulas: () =>
    collection(db, "formulas").withConverter(makeConverter<Formula>()),

  // Labs
  labs: () =>
    collection(db, "labs").withConverter(makeConverter<Lab>()),

  // Practice
  problems: () =>
    collection(db, "problems").withConverter(makeConverter<Problem>()),

  // Community
  posts: () =>
    collection(db, "posts").withConverter(makeConverter<Post>()),

  post: (id: string) =>
    doc(db, "posts", id).withConverter(makeConverter<Post>()),

  // Encyclopedia
  scientists: () =>
    collection(db, "scientists").withConverter(makeConverter<Scientist>()),

  laws: () =>
    collection(db, "laws").withConverter(makeConverter<PhysicsLaw>()),

  constants: () =>
    collection(db, "constants").withConverter(
      makeConverter<PhysicsConstant>()
    ),
} as const;

/*
 * ─── Firestore Schema Reference ────────────────────────────────────────────
 *
 * /users/{uid}                    — User profile
 * /userProgress/{uid}             — XP, streaks, bookmarks, completions
 *
 * /chapters/{chapterId}           — Chapter content
 *   /chapters/{id}/sections       — (subcollection, for large content)
 *
 * /formulas/{formulaId}           — Interactive formulas
 * /labs/{labId}                   — Virtual lab metadata
 * /problems/{problemId}           — Practice problems
 *
 * /posts/{postId}                 — Community posts
 *   /posts/{id}/answers           — (subcollection)
 *
 * /scientists/{scientistId}       — Encyclopedia — scientists
 * /laws/{lawId}                   — Encyclopedia — physics laws
 * /constants/{constantId}         — Encyclopedia — physical constants
 *
 * /dailyFacts/{date}              — Daily physics fact (YYYY-MM-DD)
 * /challenges/{challengeId}       — Weekly/daily challenges
 * /badges/{badgeId}               — Badge definitions
 *
 * ─── Security Rules Summary ───────────────────────────────────────────────
 *
 * Public read:  chapters, formulas, labs, problems, scientists, laws,
 *               constants, dailyFacts, challenges, badges, posts
 * Auth read:    userProgress (own uid only)
 * Auth write:   userProgress (own uid), posts (auth), answers (auth)
 * Admin write:  chapters, formulas, labs, problems, scientists, laws,
 *               constants, dailyFacts, challenges, badges
 *               (enforced via custom claim: role === "admin")
 */
