import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  // Determine initial theme based on localStorage or default to light ('fantasy')
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      // Validate saved theme exists in our list (optional but good practice)
      const availableThemes = ["fantasy", "night"];
      if (availableThemes.includes(savedTheme)) {
        return savedTheme;
      }
    }
    // Default to light theme ('fantasy')
    return "fantasy";
  };

  const [currentTheme, setCurrentTheme] = useState(getInitialTheme);

  // Apply theme on component mount and when currentTheme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    // Save the theme to localStorage whenever it changes
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === "fantasy" ? "night" : "fantasy";
    setCurrentTheme(newTheme);
    // The useEffect will handle saving to localStorage and applying the attribute
  };

  return (
    <button
      onClick={toggleTheme}
      to="/build-pc"
      className={`flex flex-col items-center transition`} // Changed text-red-500 to text-primary, text-gray-300 to text-base-content, hover:text-white to hover:text-primary
    >
      <div>
        {currentTheme === "fantasy" ? (
          <MoonIcon className="h-6 w-6" />
        ) : (
          <SunIcon className="h-6 w-6" />
        )}{" "}
      </div>
      <p className="text-xs mt-1">
        {currentTheme === "fantasy" ? "Dark Mode" : "Light Mode"}{" "}
      </p>
    </button>
    // <button
    //   onClick={toggleTheme}
    //   className="btn btn-sm bg-base-100" // Keeping your original classes
    //   aria-label={`Toggle to ${
    //     currentTheme === "fantasy" ? "dark" : "light"
    //   } mode`}
    // >
    //   <div className="flex flex-col items-center p-2">
    //   </div>

    //   {/* Using text labels */}
    // </button>
  );
};

export default ThemeSwitcher;
