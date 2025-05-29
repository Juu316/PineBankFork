import React from "react";
import { Eye, EyeOff } from "lucide-react";

import { useVisibility } from "@/context/visibilityContext";
const ToggleVisibility = () => {
  const { isVisible, toggleVisibility } = useVisibility();
  return (
    <>
      <button
        onClick={toggleVisibility}
        className="hover:shadow-lg hover:shadow-blue-500/50 transition duration-300 w-10 h-10 flex justify-center items-center rounded-2xl bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:cursor-pointer">
        {isVisible ? (
          <Eye className="w-5 h-5" />
        ) : (
          <EyeOff className="w-5 h-5" />
        )}
      </button>
    </>
  );
};

export default ToggleVisibility;
