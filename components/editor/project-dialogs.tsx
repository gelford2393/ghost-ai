"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Project } from "@/hooks/use-project-actions";

interface ProjectDialogsProps {
  dialogType: "create" | "rename" | "delete" | null;
  project: Project | null;
  projectName: string;
  slug: string;
  isLoading: boolean;
  onProjectNameChange: (value: string) => void;
  onSubmitCreate: () => void;
  onSubmitRename: () => void;
  onSubmitDelete: () => void;
  onClose: () => void;
}

export function ProjectDialogs({
  dialogType,
  project,
  projectName,
  slug,
  isLoading,
  onProjectNameChange,
  onSubmitCreate,
  onSubmitRename,
  onSubmitDelete,
  onClose,
}: ProjectDialogsProps) {
  return (
    <>
      {/* Create Project Dialog */}
      <Dialog open={dialogType === "create"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Give your project a name. You can change it later.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitCreate();
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-project-name">Project name</Label>
              <Input
                id="create-project-name"
                placeholder="My Architecture"
                value={projectName}
                onChange={(e) => onProjectNameChange(e.target.value)}
                autoFocus
                autoComplete="off"
              />
              {slug && (
                <p className="text-xs text-muted-foreground">
                  Slug: <span className="font-mono text-foreground">{slug}</span>
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={!projectName.trim() || isLoading}>
                {isLoading ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rename Project Dialog */}
      <Dialog open={dialogType === "rename"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Renaming <span className="font-medium text-foreground">{project?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitRename();
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="rename-project-name">New name</Label>
              <Input
                id="rename-project-name"
                placeholder="Project name"
                value={projectName}
                onChange={(e) => onProjectNameChange(e.target.value)}
                autoFocus
                autoComplete="off"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={!projectName.trim() || isLoading}>
                {isLoading ? "Renaming…" : "Rename"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={dialogType === "delete"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">{project?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={onSubmitDelete} disabled={isLoading}>
              {isLoading ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
