import React, { useContext } from "react";
import { useEffect, useState } from "react";

const DEFAULT_THEME = "dark";

export const useThemeInit = () => {
  const [theme, _setTheme] = useState("dark");

  const setTheme = (val: string) => {
    localStorage.setItem("theme", val);
    _setTheme(val);
  };

  useEffect(() => {
    const preferLight =
      localStorage.getItem("theme") === "light" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: light)").matches);

    if (preferLight) {
      setTheme("light");
    }
  }, []);

  return [theme, setTheme] as const;
};

const defaultThemeSetter = (_val: string) => {
  // do nothing
};

export const ThemeContext = React.createContext([
  DEFAULT_THEME as string,
  defaultThemeSetter,
] as const);

export const useTheme = () => {
  const [theme, setTheme] = useContext(ThemeContext);
  return [theme, setTheme] as const;
};
