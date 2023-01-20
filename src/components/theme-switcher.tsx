import { pascalize } from "humps";
import { Switch } from "@headlessui/react";
import { useTheme } from "./theme";

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useTheme();

  const enabled = theme === "dark";
  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="dark:text-white">{pascalize(theme)}</span>
      <Switch
        checked={enabled}
        onChange={toggle}
        className={`${
          enabled ? "bg-blue-600" : "bg-gray-200"
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span
          className={`${
            enabled ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        ></span>
      </Switch>
    </div>
  );
};
