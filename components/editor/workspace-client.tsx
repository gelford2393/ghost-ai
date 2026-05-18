"use client";

import { useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ShareDialog } from "@/components/editor/share-dialog";
import { useProjectActions, Project } from "@/hooks/use-project-actions";
import { X } from "lucide-react";

interface WorkspaceClientProps {
  projectId: string;
  projectName: string;
  userRole: "owner" | "collaborator";
  initialOwnedProjects: Project[];
  initialSharedProjects: Project[];
}

export function WorkspaceClient({
  projectId,
  projectName,
  userRole,
  initialOwnedProjects,
  initialSharedProjects,
}: WorkspaceClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

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
        onShare={() => setIsShareOpen(true)}
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

        {/* AI Sidebar / Drawer */}
        {isAiSidebarOpen && (
          <>
            {/* Mobile Backdrop Scrim */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
              onClick={() => setIsAiSidebarOpen(false)}
            />
            {/* Sidebar / Drawer Container */}
            <aside className="fixed right-0 top-0 bottom-0 z-50 w-80 border-l border-[#2a2a30] bg-[#111114]/98 backdrop-blur-sm flex flex-col items-center justify-center shrink-0 animate-in slide-in-from-right duration-200 md:relative md:inset-auto md:z-auto md:h-auto md:border-border md:bg-card/95 md:flex">
              {/* Close button for mobile */}
              <button 
                onClick={() => setIsAiSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#808090] hover:text-[#f0f0f4] hover:bg-[#1e1e23] md:hidden cursor-pointer"
                aria-label="Close AI Chat"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="text-sm text-muted-foreground">
                AI Chat Placeholder
              </p>
            </aside>
          </>
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

      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        projectId={projectId}
        userRole={userRole}
      />
    </div>
  );
}
