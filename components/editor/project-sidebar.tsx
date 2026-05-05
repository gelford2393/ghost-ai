"use client";

import { X, Plus, FolderOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
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
          <TabsContent value="my-projects" className="mt-0 p-4">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No projects yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Create your first project to get started
              </p>
            </div>
          </TabsContent>

          <TabsContent value="shared" className="mt-0 p-4">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No shared projects
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Projects shared with you will appear here
              </p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* New Project button */}
      <div className="p-3 border-t border-border shrink-0">
        <Button className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
