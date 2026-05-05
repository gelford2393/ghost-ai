"use client";

import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
}: EditorNavbarProps) {
  return (
    <nav className="h-14 flex items-center border-b border-border bg-background px-4 shrink-0">
      {/* Left section — sidebar toggle */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Center section — project title + save status */}
      <div className="flex-1 flex items-center justify-center gap-2">
        <span className="text-sm font-medium text-foreground">
          Untitled Project
        </span>
        <span className="text-xs text-muted-foreground">Saved</span>
      </div>

      {/* Right section — reserved for future controls */}
      <div className="flex items-center w-10" />
    </nav>
  );
}
