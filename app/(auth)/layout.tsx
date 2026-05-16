import { Network, Share2, FileText } from "lucide-react";

const features = [
  {
    icon: Network,
    title: "AI Architecture Generation",
    description:
      "Describe your system. AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--bg-base, #080809)" }}
    >
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col w-1/2 p-10">
        {/* Logo — top-left */}
        <div className="flex items-center gap-2 mb-auto">
          <div
            className="flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold"
            style={{
              backgroundColor: "var(--accent-primary, #FFA000)",
              color: "#080809",
            }}
          >
            G
          </div>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary, #f0f0f4)" }}
          >
            Ghost AI
          </span>
        </div>

        {/* Headline + tagline */}
        <div className="flex flex-col justify-center flex-1 max-w-md">
          <h1
            className="text-4xl font-bold leading-tight mb-4"
            style={{ color: "var(--text-primary, #f0f0f4)" }}
          >
            Design systems at the speed of thought.
          </h1>
          <p
            className="text-sm leading-relaxed mb-10"
            style={{ color: "var(--text-secondary, #c0c0cc)" }}
          >
            Describe your architecture in plain English. Ghost AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>

          {/* Feature rows */}
          <ul className="space-y-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <div
                  className="flex items-center justify-center h-9 w-9 rounded-lg shrink-0"
                  style={{
                    backgroundColor: "var(--accent-primary-dim, rgba(255,160,0,0.12))",
                    color: "var(--accent-primary, #FFA000)",
                  }}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold mb-0.5"
                    style={{ color: "var(--text-primary, #f0f0f4)" }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-muted, #808090)" }}
                  >
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Spacer to balance logo */}
        <div className="mt-auto" style={{ height: "2rem" }} />
      </div>

      {/* ── Right Panel ── */}
      <div
        className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:p-8"
        style={{ backgroundColor: "var(--bg-surface, #111114)" }}
      >
        {/* Mobile-only logo — shows when left panel is hidden */}
        <div className="flex items-center gap-2 mb-12 lg:hidden">
          <div
            className="flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold"
            style={{
              backgroundColor: "var(--accent-primary, #FFA000)",
              color: "#080809",
            }}
          >
            G
          </div>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary, #f0f0f4)" }}
          >
            Ghost AI
          </span>
        </div>

        <div className="w-full flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
