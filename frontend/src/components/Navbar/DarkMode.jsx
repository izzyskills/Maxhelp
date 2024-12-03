import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "@nextui-org/react";
import { useTheme } from "../../context/ThemeProvider";

const DarkMode = () => {
  const { theme, setTheme } = useTheme();

  const toggleMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button onClick={toggleMode} isIconOnly size="sm" className="relative">
      <FaMoon
        className={`h-4 w-4 transition-all ${theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`}
      />
      <FaSun
        className={`absolute h-4 w-4 transition-all ${theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"}`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default DarkMode;
