import { getProjects } from "@/lib/projects-service";
import { WorkArchiveClient } from "@/components/work/work-archive-client";

export const dynamic = "force-dynamic";

export default async function WorkArchivePage() {
  const projects = await getProjects({ publishedOnly: true });

  return <WorkArchiveClient initialProjects={projects} />;
}
