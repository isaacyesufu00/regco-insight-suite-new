import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "dark", toggle: () => {}, setTheme: () => {} });

const STORAGE_KEY = "regco-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme) || "dark";
    // Apply class synchronously during render to avoid a light→dark flash.
    const root = document.documentElement;
    if (stored === "light") {
      root.classList.add("regco-light");
      root.classList.remove("dark");
    } else {
      root.classList.remove("regco-light");
      root.classList.add("dark");
    }
    return stored;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("regco-light");
      root.classList.remove("dark");
    } else {
      root.classList.remove("regco-light");
      root.classList.add("dark");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggle = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));

  return <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
