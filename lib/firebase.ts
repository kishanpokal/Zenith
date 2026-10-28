import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
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

const PROJECTS_COLLECTION = "portfolio_projects";

/**
 * Fetch all projects from Firestore (sorted by order asc).
 * If Firestore is empty, auto-seeds default projects.
 */
export async function getProjectsFromDb(): Promise<Project[]> {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Auto seed initial projects so the portfolio is never blank
      await seedDefaultProjects();
      return DEFAULT_PROJECTS;
    }
    
    const list: Project[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Project, "id">) });
    });
    return list;
  } catch (error) {
    console.warn("Firestore fetch error, falling back to local defaults:", error);
    return DEFAULT_PROJECTS;
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
 * Save / Add a new project
 */
export async function saveProjectToDb(project: Project): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, project.id);
  await setDoc(docRef, {
    ...project,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

/**
 * Delete a project by ID
 */
export async function deleteProjectFromDb(id: string): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await deleteDoc(docRef);
}
