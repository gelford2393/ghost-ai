"use client";

import { X, Plus, FolderOpen, Users, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Project } from "@/hooks/use-project-actions";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  ownedProjects: Project[];
  sharedProjects: Project[];
  onNewProject: () => void;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
}

/**
 * Renders an individual project item in the sidebar, with optional actions (rename/delete).
 * 
 * @param props - The properties for the project item component.
 * @param props.project - The project data to display.
 * @param props.showActions - Whether to show the rename and delete action buttons.
 * @param props.onRename - Callback fired when the rename action is triggered.
 * @param props.onDelete - Callback fired when the delete action is triggered.
 * @returns The rendered project item component.
 */
function ProjectItem({
  project,
  showActions,
  onRename,
  onDelete,
}: {
  project: Project;
  showActions: boolean;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  return (
    <div className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors">
      <span className="flex-1 truncate">{project.name}</span>

      {showActions && (
        <div className="flex items-center gap-0.5 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity">          <Button
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

/**
 * Renders the project sidebar containing lists of owned and shared projects, 
 * along with actions to create, rename, or delete projects.
 * 
 * @param props - The properties for the project sidebar component.
 * @param props.isOpen - Whether the sidebar is currently visible (for mobile responsiveness).
 * @param props.onClose - Callback fired to close the sidebar.
 * @param props.ownedProjects - Array of projects owned by the user.
 * @param props.sharedProjects - Array of projects shared with the user.
 * @param props.onNewProject - Callback fired to create a new project.
 * @param props.onRename - Callback fired to rename a project.
 * @param props.onDelete - Callback fired to delete a project.
 * @returns The rendered sidebar component.
 */
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
