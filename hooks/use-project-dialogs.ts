"use client";

import { useState, useCallback, useMemo, useRef } from "react";

export interface MockProject {
  id: string;
  name: string;
  slug: string;
  isOwned: boolean;
}

type DialogType = "create" | "rename" | "delete" | null;

interface DialogState {
  type: DialogType;
  targetProject: MockProject | null;
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

const INITIAL_MOCK_PROJECTS: MockProject[] = [
  { id: "1", name: "E-Commerce Platform", slug: "e-commerce-platform", isOwned: true },
  { id: "2", name: "Chat Application", slug: "chat-application", isOwned: true },
  { id: "3", name: "Analytics Dashboard", slug: "analytics-dashboard", isOwned: true },
  { id: "4", name: "Team Workspace", slug: "team-workspace", isOwned: false },
  { id: "5", name: "Payment Gateway", slug: "payment-gateway", isOwned: false },
];

export function useProjectDialogs() {
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [projects, setProjects] = useState<MockProject[]>(INITIAL_MOCK_PROJECTS);
  const [dialog, setDialog] = useState<DialogState>({ type: null, targetProject: null });
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const slug = useMemo(() => generateSlug(projectName), [projectName]);

  const ownedProjects = useMemo(
    () => projects.filter((p) => p.isOwned),
    [projects],
  );

  const sharedProjects = useMemo(
    () => projects.filter((p) => !p.isOwned),
    [projects],
  );

  // ── Open dialogs ──

  const openCreate = useCallback(() => {
    setProjectName("");
    setDialog({ type: "create", targetProject: null });
  }, []);

  const openRename = useCallback((project: MockProject) => {
    setProjectName(project.name);
    setDialog({ type: "rename", targetProject: project });
  }, []);

  const openDelete = useCallback((project: MockProject) => {
    setDialog({ type: "delete", targetProject: project });
  }, []);

  const closeDialog = useCallback(() => {
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
    setDialog({ type: null, targetProject: null });
    setProjectName("");
    setIsLoading(false);
  }, []);

  // ── Actions (mock — no persistence) ──

  const submitCreate = useCallback(() => {
    if (!projectName.trim()) return;
    setIsLoading(true);

    // Simulate async work
    pendingTimerRef.current = setTimeout(() => {
      const newProject: MockProject = {
        id: crypto.randomUUID(),
        name: projectName.trim(),
        slug: generateSlug(projectName),
        isOwned: true,
      };
      setProjects((prev) => [newProject, ...prev]);
      setDialog({ type: null, targetProject: null });
      setProjectName("");
      setIsLoading(false);
    }, 400);
  }, [projectName]);

  const submitRename = useCallback(() => {
    if (!projectName.trim() || !dialog.targetProject) return;
    setIsLoading(true);

    pendingTimerRef.current = setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === dialog.targetProject!.id
            ? { ...p, name: projectName.trim(), slug: generateSlug(projectName) }
            : p,
        ),
      );
      setDialog({ type: null, targetProject: null });
      setProjectName("");
      setIsLoading(false);
    }, 400);
  }, [projectName, dialog.targetProject]);

  const submitDelete = useCallback(() => {
    if (!dialog.targetProject) return;
    setIsLoading(true);

    pendingTimerRef.current = setTimeout(() => {
      setProjects((prev) => prev.filter((p) => p.id !== dialog.targetProject!.id));
      setDialog({ type: null, targetProject: null });
      setIsLoading(false);
    }, 400);
  }, [dialog.targetProject]);

  return {
    projects,
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
  };
}
