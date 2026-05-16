"use client";

import { X, Plus, FolderOpen, Users, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MockProject } from "@/hooks/use-project-dialogs";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  ownedProjects: MockProject[];
  sharedProjects: MockProject[];
  onNewProject: () => void;
  onRename: (project: MockProject) => void;
  onDelete: (project: MockProject) => void;
}

function ProjectItem({
  project,
  showActions,
  onRename,
  onDelete,
}: {
  project: MockProject;
  showActions: boolean;
  onRename: (project: MockProject) => void;
  onDelete: (project: MockProject) => void;
}) {
  return (
    <div className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors">
      <span className="flex-1 truncate">{project.name}</span>

      {showActions && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation();
              onRename(project);
            }}
            aria-label={`Rename ${project.name}`}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            aria-label={`Delete ${project.name}`}
            className="hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  onNewProject,
  onRename,
  onDelete,
}: ProjectSidebarProps) {
  return (
    <>
      {/* Mobile backdrop scrim */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-hidden={!isOpen}
        className={`
          absolute inset-y-0 left-0 z-40 w-72
          flex flex-col
          bg-card/95 backdrop-blur-sm
          border-r border-border
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full invisible pointer-events-none"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-border shrink-0">
          <h2 className="text-sm font-semibold text-foreground">Projects</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close sidebar"
            className="h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my-projects" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-10 px-2 shrink-0">
            <TabsTrigger value="my-projects" className="text-xs">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="text-xs">
              Shared
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="my-projects" className="mt-0 p-2">
              {ownedProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FolderOpen className="h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No projects yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Create your first project to get started
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {ownedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      showActions={true}
                      onRename={onRename}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="shared" className="mt-0 p-2">
              {sharedProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No shared projects
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Projects shared with you will appear here
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {sharedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      showActions={false}
                      onRename={onRename}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* New Project button */}
        <div className="p-3 border-t border-border shrink-0">
          <Button className="w-full" size="sm" onClick={onNewProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
