import { X, ChevronDown } from "lucide-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface DocumentPreviewModalProps {
  open: boolean;
  title?: string;
  content: string;
  onClose: () => void;
}

export default function DocumentPreviewModal({ open, title = "Agent plan", content, onClose }: DocumentPreviewModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6"
      style={{ background: "rgba(20,20,20,0.35)", backdropFilter: "blur(2px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative bg-white rounded-2xl w-full max-w-[720px] max-h-[82vh] flex flex-col overflow-hidden"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-black/[0.06]">
          <button className="inline-flex items-center gap-1.5 text-[13px] text-[var(--ink-3)] hover:text-[var(--ink)]">
            {title} <ChevronDown size={13} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--ink-3)] hover:bg-black/[0.05] hover:text-[var(--ink)]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-8 py-6">
          <div className="prose prose-sm max-w-none text-[var(--ink)] prose-headings:font-semibold prose-headings:text-[var(--ink)] prose-p:leading-[1.7] prose-p:text-[14px]">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
