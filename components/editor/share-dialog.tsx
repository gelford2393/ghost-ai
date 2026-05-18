"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, Check, Trash, Loader2, User, Users, Shield } from "lucide-react";

interface Collaborator {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  role: "owner" | "collaborator";
}

interface ShareResponse {
  owner: Collaborator;
  collaborators: Collaborator[];
}

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  userRole: "owner" | "collaborator";
}

export function ShareDialog({
  isOpen,
  onClose,
  projectId,
  userRole,
}: ShareDialogProps) {
  const [owner, setOwner] = useState<Collaborator | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch collaborators list
  const fetchCollaborators = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      
      if (!res.ok) {
        throw new Error(await res.text() || "Failed to load collaborators");
      }
      
      const data: ShareResponse = await res.json();
      setOwner(data.owner);
      setCollaborators(data.collaborators);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred while fetching collaborators.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCollaborators();
      setEmailInput("");
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen, projectId]);

  // Copy Link
  const handleCopyLink = async () => {
    try {
      const link = `${window.location.origin}/editor/${projectId}`;
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  // Invite Collaborator
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim() }),
      });

      if (!res.ok) {
        throw new Error(await res.text() || "Failed to invite collaborator");
      }

      setSuccessMsg(`Successfully invited ${emailInput.trim()}!`);
      setEmailInput("");
      
      // Refresh list
      await fetchCollaborators();
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove Collaborator
  const handleRemove = async (id: string, email: string) => {
    if (removingId) return;

    try {
      setRemovingId(id);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch(`/api/projects/${projectId}/collaborators?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(await res.text() || "Failed to remove collaborator");
      }

      setSuccessMsg(`Removed collaborator ${email}.`);
      
      // Refresh list
      await fetchCollaborators();
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setRemovingId(null);
    }
  };

  const isOwner = userRole === "owner";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-full rounded-3xl bg-[#111114] border border-[#2a2a30] p-6 text-[#f0f0f4] overflow-x-hidden min-w-0">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-[#FFA000]" />
            Share Project
          </DialogTitle>
          <DialogDescription className="text-sm text-[#808090]">
            Invite other developers and manage collaboration settings.
          </DialogDescription>
        </DialogHeader>

        {/* ── Link Copy Section ── */}
        <div className="flex flex-col gap-2 mt-2 min-w-0 w-full">
          <Label className="text-xs font-semibold uppercase tracking-wider text-[#808090]">
            Project Link
          </Label>
          <div className="flex items-center gap-2 bg-[#080809] border border-[#2a2a30] rounded-xl p-1.5 pl-3 w-full min-w-0">
            <span className="text-sm text-[#c0c0cc] truncate flex-1 min-w-0 select-all font-mono">
              {typeof window !== "undefined" ? `${window.location.origin}/editor/${projectId}` : `/editor/${projectId}`}
            </span>
            <Button
              size="sm"
              variant={copied ? "default" : "outline"}
              onClick={handleCopyLink}
              className={`h-8 px-3 rounded-lg shrink-0 transition-all ${
                copied 
                  ? "bg-[#34d399] hover:bg-[#34d399] text-[#080809] font-medium" 
                  : "border-[#2a2a30] hover:bg-[#1e1e23] hover:text-[#f0f0f4]"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1.5 shrink-0" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1.5 shrink-0" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>

        <hr className="border-[#2a2a30] my-2" />

        {/* ── Invite Form (Owners only) ── */}
        {isOwner ? (
          <form onSubmit={handleInvite} className="flex flex-col gap-2">
            <Label htmlFor="invite-email" className="text-xs font-semibold uppercase tracking-wider text-[#808090]">
              Invite Collaborators
            </Label>
            <div className="flex gap-2">
              <Input
                id="invite-email"
                type="email"
                placeholder="developer@example.com"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                disabled={isSubmitting}
                className="bg-[#080809] border-[#2a2a30] rounded-xl focus-visible:ring-[#FFA000] placeholder:text-[#505060] text-sm"
                autoComplete="off"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting || !emailInput.trim()} 
                className="bg-[#FFA000] hover:bg-[#FFB300] text-[#080809] font-semibold px-4 rounded-xl shrink-0"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Invite"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="bg-[#18181c] border border-[#2a2a30] rounded-xl p-3 flex items-start gap-2.5">
            <Shield className="h-4 w-4 text-[#808090] shrink-0 mt-0.5" />
            <p className="text-xs text-[#808090] leading-relaxed">
              Only the project owner can invite new collaborators or remove existing members from this workspace.
            </p>
          </div>
        )}

        {/* Feedback alerts */}
        {errorMsg && (
          <p className="text-xs text-[#ff4d4f] font-medium bg-[#ff4d4f]/10 border border-[#ff4d4f]/20 rounded-lg px-3 py-1.5 mt-1">
            {errorMsg}
          </p>
        )}
        {successMsg && (
          <p className="text-xs text-[#34d399] font-medium bg-[#34d399]/10 border border-[#34d399]/20 rounded-lg px-3 py-1.5 mt-1">
            {successMsg}
          </p>
        )}

        {/* ── Collaborators List ── */}
        <div className="flex flex-col gap-3.5 mt-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-[#808090]">
            Workspace Members
          </Label>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2 text-[#808090]">
              <Loader2 className="h-6 w-6 animate-spin text-[#FFA000]" />
              <span className="text-xs">Loading members...</span>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto pr-1 flex flex-col gap-2.5 custom-scrollbar">
              {/* Owner Item */}
              {owner && (
                <div className="flex items-center justify-between bg-[#18181c] border border-[#2a2a30] rounded-2xl p-2.5 pl-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-[#1e1e23] border border-[#2a2a30] flex items-center justify-center shrink-0 overflow-hidden">
                      {owner.imageUrl ? (
                        <img 
                          src={owner.imageUrl} 
                          alt={owner.name || owner.email} 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <User className="h-4 w-4 text-[#808090]" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-[#f0f0f4] truncate">
                        {owner.name || "Project Owner"}
                      </span>
                      <span className="text-xs text-[#808090] truncate">
                        {owner.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFA000] bg-[#FFA000]/12 border border-[#FFA000]/20 px-2 py-0.5 rounded-md mr-1 select-none">
                    Owner
                  </span>
                </div>
              )}

              {/* Collaborators */}
              {collaborators.length > 0 ? (
                collaborators.map((c) => (
                  <div 
                    key={c.id} 
                    className="flex items-center justify-between bg-[#111114] hover:bg-[#18181c] border border-[#2a2a30] rounded-2xl p-2.5 pl-3 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-[#1e1e23] border border-[#2a2a30] flex items-center justify-center shrink-0 overflow-hidden">
                        {c.imageUrl ? (
                          <img 
                            src={c.imageUrl} 
                            alt={c.name || c.email} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <User className="h-4 w-4 text-[#808090]" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        {c.name ? (
                          <>
                            <span className="text-sm font-medium text-[#f0f0f4] truncate">
                              {c.name}
                            </span>
                            <span className="text-xs text-[#808090] truncate">
                              {c.email}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-[#f0f0f4] truncate font-mono">
                            {c.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-[#808090] bg-[#1e1e23] border border-[#2a2a30] px-2 py-0.5 rounded-md group-hover:border-[#3a3a42] select-none">
                        Collaborator
                      </span>
                      
                      {/* Remove Button for Owner only */}
                      {isOwner && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemove(c.id, c.email)}
                          disabled={removingId !== null}
                          className="h-7 w-7 rounded-lg text-[#808090] hover:text-[#ff4d4f] hover:bg-[#ff4d4f]/10 transition-colors cursor-pointer"
                          aria-label={`Remove ${c.email}`}
                        >
                          {removingId === c.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                !isLoading && (
                  <div className="flex flex-col items-center justify-center py-6 border border-dashed border-[#2a2a30] rounded-2xl text-[#808090] gap-1">
                    <Users className="h-5 w-5 text-[#505060]" />
                    <span className="text-xs font-medium">No collaborators yet</span>
                    <span className="text-[10px] text-[#505060]">Invite other developers to work together.</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
