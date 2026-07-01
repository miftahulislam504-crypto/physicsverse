// src/lib/firebase/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";
import type { User } from "@/types";

const googleProvider = new GoogleAuthProvider();

// ─── Create user doc in Firestore after registration ─────────────────────────
async function createUserDocument(firebaseUser: FirebaseUser, displayName?: string) {
  const userRef = doc(db, "users", firebaseUser.uid);
  const snap    = await getDoc(userRef);

  if (!snap.exists()) {
    const newUser: Omit<User, "id"> = {
      uid:           firebaseUser.uid,
      email:         firebaseUser.email ?? "",
      displayName:   displayName ?? firebaseUser.displayName ?? "Physics Explorer",
      photoURL:      firebaseUser.photoURL ?? undefined,
      locale:        "en",
      learningPath:  "curious",
      level:         "electron",
      createdAt:     new Date(),
      lastActiveAt:  new Date(),
    };
    await setDoc(userRef, { ...newUser, createdAt: serverTimestamp(), lastActiveAt: serverTimestamp() });
  }
}

// ─── Email / Password ─────────────────────────────────────────────────────────
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  await createUserDocument(credential.user, displayName);
  return credential.user;
}

export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────
export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  await createUserDocument(credential.user);
  return credential.user;
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export async function signOut() {
  await firebaseSignOut(auth);
}

// ─── Password Reset ───────────────────────────────────────────────────────────
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

// ─── Auth State Observer ─────────────────────────────────────────────────────
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
