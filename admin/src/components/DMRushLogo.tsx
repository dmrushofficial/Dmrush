import React from "react";

interface DMRushLogoProps {
  className?: string;
  /** Height class e.g. "h-10", "h-12", "h-16" */
  height?: string;
  /** Background container mode: "white" for dark backgrounds, "black" or "auto" for light/print */
  textColor?: "black" | "white" | "auto";
  /** Optional subtitle e.g. "IMS PORTAL" */
  showTagline?: boolean;
}

export const DMRushLogo: React.FC<DMRushLogoProps> = ({
  className = "",
  height = "h-10",
  textColor = "auto",
  showTagline = false,
}) => {
  const isDarkBg = textColor === "white";

  return (
    <div className={`inline-flex items-center gap-3 shrink-0 ${className}`}>
      <div
        className={`inline-flex items-center justify-center ${
          isDarkBg
            ? "bg-white px-2.5 py-1.5 rounded-lg shadow-sm border border-slate-200"
            : "bg-transparent"
        }`}
      >
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="DM RUSH Official Logo"
          className={`${height} w-auto object-contain max-w-full shrink-0`}
          loading="eager"
        />
      </div>

      {showTagline && (
        <div
          className={`flex flex-col border-l pl-2.5 leading-none shrink-0 ${
            isDarkBg ? "border-slate-600 text-white" : "border-slate-300 text-slate-800"
          }`}
        >
          <span className="font-extrabold text-sm tracking-wider text-orange-500 font-sans">
            IMS
          </span>
          <span
            className={`text-[9px] font-mono font-semibold tracking-tight ${
              isDarkBg ? "text-slate-300" : "text-slate-500"
            }`}
          >
            PORTAL
          </span>
        </div>
      )}
    </div>
  );
};


