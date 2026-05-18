"use client";

import { PanelLeftOpen, PanelLeftClose, Share, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  projectName?: string;
  onShare?: () => void;
  onToggleAi?: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  onShare,
  onToggleAi,
}: EditorNavbarProps) {
  return (
    <nav className="h-14 flex items-center border-b border-border bg-background px-4 shrink-0">
      {/* Left section — sidebar toggle */}
      <div className="flex items-center w-48">
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
          {projectName || "Untitled Project"}
        </span>
        <span className="text-xs text-muted-foreground">Saved</span>
      </div>

      {/* Right section — User profile */}
      <div className="flex items-center justify-end w-48 gap-2">
        {onShare && (
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
        {onToggleAi && (
          <Button variant="ghost" size="icon" onClick={onToggleAi} aria-label="Toggle AI">
            <MessageSquare className="h-5 w-5" />
          </Button>
        )}
        <UserButton />
      </div>
    </nav>
  );
}
