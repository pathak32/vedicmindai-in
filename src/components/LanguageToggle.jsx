import { useLanguage } from "@/lib/LanguageContext";

export function LanguageToggle({ size = "md" }) {
  const { language, toggleLanguage } = useLanguage();

  const isHindi = language === "hi";

  const sizeStyles = {
    xs: { padding: "4px 8px", fontSize: "11px", borderRadius: "16px" },
    sm: { padding: "4px 10px", fontSize: "12px", borderRadius: "20px" },
    md: { padding: "6px 14px", fontSize: "13px", borderRadius: "20px" },
    lg: { padding: "8px 18px", fontSize: "15px", borderRadius: "24px" },
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: isHindi ? "#0A1628" : "#F5F5F5",
        color: isHindi ? "#FFFFFF" : "#0A1628",
        border: "1px solid",
        borderColor: isHindi ? "#0A1628" : "#E0E0E0",
        cursor: "pointer",
        fontWeight: "500",
        whiteSpace: "nowrap",
        flexShrink: 0,
        transition: "all 0.2s ease",
        ...sizeStyles[size],
      }}
      aria-label={isHindi ? "Switch to English" : "हिंदी में बदलें"}
    >
      <span style={{ fontSize: size === "xs" ? "12px" : size === "sm" ? "14px" : "16px" }}>
        {isHindi ? "🇮🇳" : "🔤"}
      </span>
      <span>{isHindi ? "हिंदी" : "EN"}</span>
      {size !== "xs" && (
        <span style={{ opacity: 0.6, fontSize: "11px" }}>
          {isHindi ? "→ EN" : "→ हि"}
        </span>
      )}
    </button>
  );
}
