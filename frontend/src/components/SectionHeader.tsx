import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, description, align = "center" }) => {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`max-w-2xl ${alignment} space-y-3`}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">{eyebrow}</p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {description && <p className="text-base text-slate-600 transition-colors duration-300 dark:text-slate-300 sm:text-lg">{description}</p>}
    </div>
  );
};

export default SectionHeader;
