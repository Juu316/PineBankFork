import React, { createContext, useContext, useState, useEffect } from "react";

interface VisibilityContextProps {
  isVisible: boolean;
  toggleVisibility: () => void;
}

const VisibilityContext = createContext<VisibilityContextProps | undefined>(
  undefined
);

export const VisibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("isVisible");
      return stored === null ? true : stored === "true";
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("isVisible", String(isVisible));
  }, [isVisible]);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <VisibilityContext.Provider value={{ isVisible, toggleVisibility }}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = () => {
  const context = useContext(VisibilityContext);
  if (!context) {
    throw new Error("useVisibility must be used within a VisibilityProvider");
  }
  return context;
};
