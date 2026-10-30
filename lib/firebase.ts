import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Project, DEFAULT_PROJECTS } from "@/data/projects";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDWCawEbxq5Q4mONu5O1HLKhL4BayKJi5c",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "zenith-digital-studio.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "zenith-digital-studio",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "zenith-digital-studio.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "350496380365",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:350496380365:web:1cca00a3eb202748032084",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-4MEVH50NKH",
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const PROJECTS_COLLECTION = "portfolio_projects";
const VAULT_CONFIG_COLLECTION = "admin_config";
const VAULT_CONFIG_DOC = "secret_vault";
const LEADS_COLLECTION = "leads";
const DEFAULT_URL_TOKEN = process.env.ADMIN_SECRET_TOKEN || "zenith-vault-2026";

let cachedFirestoreToken: string = DEFAULT_URL_TOKEN;
let lastTokenFetchTime = 0;

/**
 * Returns currently cached Firestore vault token for fast synchronous validations.
 */
export function getCachedFirestoreToken(): string {
  return cachedFirestoreToken;
}

/**
 * Fetches the secret admin URL token from Firestore collection 'admin_config'.
 * Re-reads from Firestore to detect monthly rotations in the Firebase Console.
 */
export async function getAdminUrlTokenFromDb(): Promise<string> {
  const now = Date.now();
  // Cache for 5 seconds to ensure fast SSR response while detecting edits quickly
  if (cachedFirestoreToken && now - lastTokenFetchTime < 5000) {
    return cachedFirestoreToken;
  }

  try {
    const docRef = doc(db, VAULT_CONFIG_COLLECTION, VAULT_CONFIG_DOC);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      if (data && data.token && typeof data.token === "string" && data.token.trim().length > 0) {
        cachedFirestoreToken = data.token.trim();
        lastTokenFetchTime = now;
        return cachedFirestoreToken;
      }
    }

    // Auto-create document in Firestore if not present
    await setDoc(
      docRef,
      {
        token: DEFAULT_URL_TOKEN,
        description:
          "Secret admin URL path token. Edit this token field anytime in Firebase Console to rotate your admin URL and prevent leaks.",
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    cachedFirestoreToken = DEFAULT_URL_TOKEN;
    lastTokenFetchTime = now;
    return cachedFirestoreToken;
  } catch (err) {
    console.warn("Firestore vault token read error, using fallback:", err);
    return cachedFirestoreToken;
  }
}

/**
 * Updates the secret admin URL token in Firestore.
 */
export async function updateAdminUrlTokenInDb(newToken: string): Promise<void> {
  const docRef = doc(db, VAULT_CONFIG_COLLECTION, VAULT_CONFIG_DOC);
  await setDoc(
    docRef,
    {
      token: newToken.trim(),
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  cachedFirestoreToken = newToken.trim();
  lastTokenFetchTime = Date.now();
}

/**
 * Fetch all projects from Firestore (sorted by order asc).
 * If Firestore is empty, returns empty array.
 */
export async function getProjectsFromDb(): Promise<Project[] | null> {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy("order", "asc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const list: Project[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Project, "id">) });
    });
    return list;
  } catch (error) {
    console.warn("Firestore fetch error, falling back to local database:", error);
    return null;
  }
}

/**
 * Seed initial showcase projects to Firestore
 */
export async function seedDefaultProjects(): Promise<void> {
  try {
    for (const proj of DEFAULT_PROJECTS) {
      await setDoc(doc(db, PROJECTS_COLLECTION, proj.id), {
        ...proj,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error("Failed to seed default projects:", err);
  }
}

/**
 * Save / Add / Update a project in Firestore
 */
export async function saveProjectToDb(project: Project): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, project.id);
  await setDoc(
    docRef,
    {
      ...project,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Delete a project by ID from Firestore
 */
export async function deleteProjectFromDb(id: string): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await deleteDoc(docRef);
}

export interface ContactLead {
  id?: string;
  name: string;
  email: string;
  projectType?: string;
  budget?: string;
  message?: string;
  createdAt?: string;
  userAgent?: string;
  ip?: string;
  [key: string]: any;
}

/**
 * Persists a new client inquiry lead into Firestore 'leads' collection.
 */
export async function saveLeadToDb(lead: ContactLead): Promise<string> {
  try {
    const leadsCollection = collection(db, LEADS_COLLECTION);
    const docRef = doc(leadsCollection);
    const payload = {
      ...lead,
      createdAt: lead.createdAt || new Date().toISOString(),
    };
    await setDoc(docRef, payload);
    return docRef.id;
  } catch (error) {
    console.warn("Firestore lead persistence warning:", error);
    return `fallback-${Date.now()}`;
  }
}
