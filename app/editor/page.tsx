import { getProjects } from "@/lib/projects";
import { EditorClient } from "@/components/editor/editor-client";

export const dynamic = "force-dynamic";

export default async function EditorPage() {
  const { owned, shared } = await getProjects();

  // Serialize Date objects to ISO strings to ensure clean transport to Client Components
  const serializedOwned = owned.map((p) => ({
    id: p.id,
    name: p.name,
    ownerId: p.ownerId,
    createdAt: p.createdAt.toISOString(),
  }));

  const serializedShared = shared.map((p) => ({
    id: p.id,
    name: p.name,
    ownerId: p.ownerId,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <EditorClient
      initialOwnedProjects={serializedOwned}
      initialSharedProjects={serializedShared}
    />
  );
}

