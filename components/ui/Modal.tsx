"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="line-clamp-1 text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close"
            className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600
              dark:hover:bg-slate-800 dark:hover:text-slate-300">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}