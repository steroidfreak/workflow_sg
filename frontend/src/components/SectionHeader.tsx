import React from "react";
import { useDesign } from "../lib/design";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, description, align = "center" }) => {
  const { design } = useDesign();
  const isModern = design === "modern-programmer";

  const alignment = align === "center" ? "mx-auto text-center" : "text-left";
  const eyebrowClass = isModern
    ? "text-[11px] font-semibold uppercase tracking-[0.4em] text-emerald-300/80"
    : "text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400";
  const titleClass = isModern
    ? "bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl"
    : "text-3xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 dark:text-white sm:text-4xl";
  const descriptionClass = isModern
    ? "text-base text-slate-300/80 transition-colors duration-300 sm:text-lg"
    : "text-base text-slate-600 transition-colors duration-300 dark:text-slate-300 sm:text-lg";

  return (
    <div className={`max-w-2xl ${alignment} space-y-3`}>
      {eyebrow && (
        <p className={eyebrowClass}>{eyebrow}</p>
      )}
      <h2 className={titleClass}>{title}</h2>
      {description && <p className={descriptionClass}>{description}</p>}
    </div>
  );
};

export default SectionHeader;
