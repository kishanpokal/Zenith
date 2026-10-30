import { getProjects } from "@/lib/projects-service";
import initialSettings from "@/data/showcase-settings.json";
import { HomeClientView } from "@/components/home/home-client-view";
import { JsonLd } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjects({ publishedOnly: true });

  return (
    <>
      {/* Enterprise-Grade Multi-Entity JSON-LD Rich Snippet Graph */}
      <JsonLd projects={projects} />

      {/* Fully-Hydrated Server-Rendered Portfolio with Zero Blank CLS */}
      <HomeClientView
        initialProjects={projects}
        initialSettings={initialSettings}
      />
    </>
  );
}
