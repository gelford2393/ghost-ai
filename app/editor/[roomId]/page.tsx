import { redirect } from "next/navigation";
import { verifyProjectAccess } from "@/lib/project-access";
import { AccessDenied } from "@/components/editor/access-denied";
import { getProjects } from "@/lib/projects";
import { WorkspaceClient } from "@/components/editor/workspace-client";

export const dynamic = "force-dynamic";

interface WorkspacePageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const resolvedParams = await params;
  const roomId = resolvedParams.roomId;
  
  const accessResult = await verifyProjectAccess(roomId);

  if (!accessResult.authorized) {
    if (accessResult.reason === "unauthenticated") {
      redirect("/sign-in");
    }
    return <AccessDenied />;
  }

  const { project } = accessResult;
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
    <WorkspaceClient
      projectId={project.id}
      projectName={project.name}
      initialOwnedProjects={serializedOwned}
      initialSharedProjects={serializedShared}
    />
  );
}
