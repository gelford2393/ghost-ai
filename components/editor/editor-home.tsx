"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorHomeProps {
  onNewProject: () => void;
}

export function EditorHome({ onNewProject }: EditorHomeProps) {
  return (
    <main className="h-full flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
        Create a project or open an existing one
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Start a new architecture workspace, or choose a project from the
        sidebar.
      </p>
      <Button onClick={onNewProject} className="mt-2">
        <Plus className="h-4 w-4 mr-2" />
        New Project
      </Button>
    </main>
  );
}
