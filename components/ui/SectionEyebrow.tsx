// Section: Imports
import type { ReactNode } from "react";

interface SectionEyebrowProps {
  label: string;
  className?: string;
  icon?: ReactNode;
}

export default function SectionEyebrow({ label, className = "", icon }: SectionEyebrowProps) {
  return (
    <div className={`mb-6 flex items-center gap-3 ${className}`}>
      <span aria-hidden className="h-px w-6 bg-[var(--accent-copper)]" />
      <p
        style={{ fontFamily: "var(--font-mono)" }}
        className="text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent-copper)]"
      >
        {icon}
        {label}
      </p>
    </div>
  );
}
