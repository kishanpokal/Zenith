import fs from "fs";
import path from "path";
import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";
import { Project, DEFAULT_PROJECTS } from "@/data/projects";
import {
  getProjectsFromDb,
  saveProjectToDb,
  deleteProjectFromDb,
  seedDefaultProjects,
} from "@/lib/firebase";

const DB_PATH = path.join(process.cwd(), "data", "projects-db.json");

/**
 * Safely reads the local JSON file.
 * Returns an array of projects or falls back to DEFAULT_PROJECTS.
 */
function readLocalProjects(): Project[] {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(content) as Project[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[projects-service] Local projects-db.json read error:", err);
  }
  return Array.isArray(DEFAULT_PROJECTS) ? [...DEFAULT_PROJECTS] : [];
}

/**
 * Writes projects to local JSON cache strictly in development mode.
 * In serverless production environments (Vercel, Firebase App Hosting),
 * the filesystem is read-only (EROFS). Skipping writes prevents fatal crashes.
 */
function writeLocalProjects(projects: Project[]): void {
  if (process.env.NODE_ENV === "development") {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(projects, null, 2), "utf-8");
    } catch (err) {
      console.warn("[projects-service] Local disk sync skipped or failed:", err);
    }
  }
}

/**
 * Raw data pipeline:
 * 1. Attempts to fetch from Firestore.
 * 2. If Firestore is populated, returns the sorted list and syncs local cache in dev.
 * 3. If Firestore is unconfigured or empty, falls back to data/projects-db.json / data/projects.ts
 *    and seeds Firestore if a connection is established.
 */
async function fetchProjectsRaw(): Promise<Project[]> {
  let firestoreProjects: Project[] | null = null;

  try {
    firestoreProjects = await getProjectsFromDb();
  } catch (err) {
    console.warn("[projects-service] Firestore fetch failed, utilizing fallback:", err);
  }

  // If Firestore successfully returned projects
  if (Array.isArray(firestoreProjects) && firestoreProjects.length > 0) {
    firestoreProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
    writeLocalProjects(firestoreProjects);
    return firestoreProjects;
  }

  // Fallback to local disk / default data
  const fallback = readLocalProjects();
  fallback.sort((a, b) => (a.order || 0) - (b.order || 0));

  // If Firestore is connected but empty, auto-seed with default showcase
  if (Array.isArray(firestoreProjects) && firestoreProjects.length === 0 && fallback.length > 0) {
    try {
      console.info("[projects-service] Firestore collection is empty. Auto-seeding initial projects...");
      await seedDefaultProjects();
    } catch (seedErr) {
      console.warn("[projects-service] Auto-seeding Firestore failed:", seedErr);
    }
  }

  return fallback;
}

/**
 * Sub-10ms ISR Caching:
 * Cached across requests using Next.js unstable_cache with key ['portfolio-projects']
 * and tag ['projects'], revalidated every 3600s or on-demand via revalidateTag('projects').
 */
export const getCachedProjects = unstable_cache(
  async () => fetchProjectsRaw(),
  ["portfolio-projects"],
  {
    tags: ["projects"],
    revalidate: 3600,
  }
);

/**
 * Public Server Read API:
 * Returns all projects or only published ones.
 */
export async function getProjects(options?: { publishedOnly?: boolean }): Promise<Project[]> {
  const all = await getCachedProjects();
  if (options?.publishedOnly) {
    return all.filter((p) => p.published !== false);
  }
  return all;
}

/**
 * Retrieve a single project by ID.
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => p.id === id) || null;
}

/**
 * Revalidates Next.js cache tags and paths after mutations.
 */
export function revalidatePortfolioCache(): void {
  try {
    revalidateTag("projects");
    revalidatePath("/");
    revalidatePath("/work");
  } catch (err) {
    console.warn("[projects-service] revalidate error:", err);
  }
}

/**
 * Persists a new or updated project to Firestore and local disk (dev only),
 * then triggers cache revalidation.
 */
export async function saveProject(project: Project): Promise<Project> {
  // 1. Save to Firestore
  try {
    await saveProjectToDb(project);
  } catch (err) {
    console.warn("[projects-service] Firestore write failed:", err);
  }

  // 2. Persist to local disk if running in development
  if (process.env.NODE_ENV === "development") {
    const local = readLocalProjects();
    const index = local.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      local[index] = project;
    } else {
      local.push(project);
    }
    local.sort((a, b) => (a.order || 0) - (b.order || 0));
    writeLocalProjects(local);
  }

  // 3. Instant Cache Invalidation
  revalidatePortfolioCache();

  return project;
}

/**
 * Deletes a project by ID from Firestore and local disk (dev only),
 * then re-orders remaining projects and triggers cache revalidation.
 */
export async function deleteProject(id: string): Promise<boolean> {
  // 1. Delete from Firestore
  try {
    await deleteProjectFromDb(id);
  } catch (err) {
    console.warn("[projects-service] Firestore delete failed:", err);
  }

  // 2. Update local disk if in development
  if (process.env.NODE_ENV === "development") {
    let local = readLocalProjects();
    local = local.filter((p) => p.id !== id);
    local.forEach((p, idx) => {
      p.order = idx + 1;
    });
    writeLocalProjects(local);
  }

  // 3. Invalidate caches
  revalidatePortfolioCache();

  return true;
}

/**
 * Reorders projects by an array of IDs.
 */
export async function reorderProjects(orderedIds: string[]): Promise<Project[]> {
  const current = await getProjects();
  const projectMap = new Map(current.map((p) => [p.id, p]));

  const reordered: Project[] = [];
  orderedIds.forEach((id, index) => {
    const p = projectMap.get(id);
    if (p) {
      p.order = index + 1;
      reordered.push(p);
      projectMap.delete(id);
    }
  });

  // Append any projects not explicitly in orderedIds
  projectMap.forEach((p) => {
    p.order = reordered.length + 1;
    reordered.push(p);
  });

  // 1. Sync updated orders to Firestore
  for (const proj of reordered) {
    saveProjectToDb(proj).catch((err) => {
      console.warn(`[projects-service] Error syncing order for ${proj.id}:`, err);
    });
  }

  // 2. Sync to local disk in dev
  if (process.env.NODE_ENV === "development") {
    writeLocalProjects(reordered);
  }

  // 3. Invalidate caches
  revalidatePortfolioCache();

  return reordered;
}
