import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 9999,
        width: 44,
        height: 44,
        borderRadius: 9999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.85)",
        color: isDark ? "#F8F5F1" : "#FFFFFF",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.3)"}`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        cursor: "pointer",
        padding: 0,
        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
        transition: "background 150ms ease, border-color 150ms ease",
      }}
    >
      {isDark ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
    </button>
  );
}
