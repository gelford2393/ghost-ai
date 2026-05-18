"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string | Date;
}

type DialogType = "create" | "rename" | "delete" | null;

interface DialogState {
  type: DialogType;
  targetProject: Project | null;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateShortId(): string {
  return Math.random().toString(36).substring(2, 8);
}

export function useProjectActions() {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogState>({ type: null, targetProject: null });
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Memoize suffix to prevent it from changing on every keystroke
  const [suffix, setSuffix] = useState("");

  const slug = useMemo(() => {
    if (!projectName.trim()) return "";
    const baseSlug = generateSlug(projectName);
    return suffix ? `${baseSlug}-${suffix}` : baseSlug;
  }, [projectName, suffix]);

  const openCreate = useCallback(() => {
    setProjectName("");
    setSuffix(generateShortId());
    setDialog({ type: "create", targetProject: null });
  }, []);

  const openRename = useCallback((project: Project) => {
    setProjectName(project.name);
    setDialog({ type: "rename", targetProject: project });
  }, []);

  const openDelete = useCallback((project: Project) => {
    setDialog({ type: "delete", targetProject: project });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog({ type: null, targetProject: null });
    setProjectName("");
    setSuffix("");
    setIsLoading(false);
  }, []);

  const submitCreate = useCallback(async () => {
    if (!projectName.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: projectName.trim(),
          id: slug 
        }),
      });

      if (!response.ok) throw new Error("Failed to create project");

      const project = await response.json();
      closeDialog();
      router.push(`/editor/${project.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [projectName, slug, closeDialog, router]);

  const submitRename = useCallback(async () => {
    if (!projectName.trim() || !dialog.targetProject) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${dialog.targetProject.id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: projectName.trim() }),
      });

      if (!response.ok) throw new Error("Failed to rename project");

      closeDialog();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [projectName, dialog.targetProject, closeDialog, router]);

  const submitDelete = useCallback(async () => {
    if (!dialog.targetProject) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${dialog.targetProject.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete project");

      closeDialog();
      
      if (window.location.pathname.includes(dialog.targetProject.id)) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [dialog.targetProject, closeDialog, router]);

  return {
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
  };
}
