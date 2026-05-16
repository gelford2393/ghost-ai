"use client";

import { useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { EditorHome } from "@/components/editor/editor-home";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    ownedProjects,
    sharedProjects,
    dialog,
    projectName,
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
  } = useProjectDialogs();

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 relative overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onNewProject={openCreate}
          onRename={openRename}
          onDelete={openDelete}
        />

        {/* Editor home — center content */}
        <EditorHome onNewProject={openCreate} />
      </div>

      {/* ── Dialogs ── */}
      <ProjectDialogs
        dialogType={dialog.type}
        project={dialog.targetProject}
        projectName={projectName}
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
