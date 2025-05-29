"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

type SidebarContextType = {
  selectedSidebar: string;
  setSelectedSidebar: (value: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  let initialSidebar = "";
  if (pathname?.includes("/transfer")) {
    initialSidebar = "Гүйлгээ";
  } else if (pathname?.includes("/accounts")) {
    initialSidebar = "Данс";
  } else if (pathname?.includes("/settings")) {
    initialSidebar = "Тохиргоо";
  } else {
    initialSidebar = "Эхлэл";
  }

  const [selectedSidebar, setSelectedSidebar] = useState(initialSidebar);

  return (
    <SidebarContext.Provider value={{ selectedSidebar, setSelectedSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
