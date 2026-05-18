"use client";

import { useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectActions, Project } from "@/hooks/use-project-actions";

interface WorkspaceClientProps {
  projectId: string;
  projectName: string;
  initialOwnedProjects: Project[];
  initialSharedProjects: Project[];
}

export function WorkspaceClient({
  projectId,
  projectName,
  initialOwnedProjects,
  initialSharedProjects,
}: WorkspaceClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);

  const {
    dialog,
    projectName: dialogProjectName,
    setProjectName,
    slug,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  } = useProjectActions();

  return (
    <div className="h-dvh flex flex-col bg-background">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        projectName={projectName}
        onShare={() => {
          // Share functionality placeholder
          console.log("Share clicked");
        }}
        onToggleAi={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
      />

      <div className="flex-1 relative overflow-hidden flex">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={initialOwnedProjects}
          sharedProjects={initialSharedProjects}
          onNewProject={openCreate}
          onRename={openRename}
          onDelete={openDelete}
          activeProjectId={projectId}
        />

        {/* Central canvas placeholder */}
        <main className="flex-1 flex flex-col items-center justify-center bg-zinc-950">
          <p className="text-sm text-muted-foreground">
            Canvas Placeholder
          </p>
        </main>

        {/* AI Sidebar placeholder */}
        {isAiSidebarOpen && (
          <aside className="w-80 border-l border-border bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center shrink-0 hidden md:flex">
            <p className="text-sm text-muted-foreground">
              AI Chat Placeholder
            </p>
          </aside>
        )}
      </div>

      {/* ── Dialogs ── */}
      <ProjectDialogs
        dialogType={dialog.type}
        project={dialog.targetProject}
        projectName={dialogProjectName}
        slug={slug}
        isLoading={isLoading}
        onProjectNameChange={setProjectName}
        onSubmitCreate={submitCreate}
        onSubmitRename={submitRename}
        onSubmitDelete={submitDelete}
        onClose={closeDialog}
      />
    </div>
  );
}
