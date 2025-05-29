"use client";

import InactivityHandler from "@/app/dashboard/_components/InactivityHandler";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect, useState } from "react";
import { ThemeToggleButton } from "@/components/ui/themeToggleButton";
import ToggleVisibility from "./_components/ToggleVisibility";
import { Menu, House, Settings, UserRound, Send } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { VisibilityProvider } from "@/context/visibilityContext";
import { useSidebar } from "@/context/sidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { selectedSidebar, setSelectedSidebar } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        window.innerWidth < 768 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSidebarClick = () => {
    router.push("/dashboard");
    setSelectedSidebar("Эхлэл");
  };

  return (
    <>
      <InactivityHandler />
      <VisibilityProvider>
        <section className="relative flex ">
          {isSidebarOpen && (
            <div
              id="SIDEBAR"
              ref={sidebarRef}
              style={{ top: 0, left: 0 }}
              className="fixed md:relative z-50  w-[10rem] min-w-[10rem] lg:w-[15rem] lg:min-w-[15rem] min-h-screen bg-white dark:bg-gray-800 border-r">
              <div className="flex items-center justify-center w-full mt-4 text-2xl font-bold h-21 sm:text-3xl lg:text-4xl">
                <div
                  onClick={handleSidebarClick}
                  className="cursor-pointer dark:hidden"
                  style={{
                    position: "relative",
                    width: "50px",
                    aspectRatio: "1/1",
                  }}>
                  <Image
                    src="/images/Pinebank_Printstream.png"
                    alt="Example"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <span
                  onClick={handleSidebarClick}
                  className="hidden cursor-pointer dark:block">
                  P
                </span>
                <p className="cursor-pointer" onClick={handleSidebarClick}>
                  inebank
                </p>
              </div>
              <div className="w-full">
                <div
                  onClick={() => {
                    setSelectedSidebar("Эхлэл");
                    router.push("/dashboard");
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`flex h-15 items-center pl-4 gap-4 rounded-3xl cursor-pointer transition ${
                    selectedSidebar === "Эхлэл"
                      ? "text-blue-600 dark:hover:bg-gray-700 hover:bg-gray-100"
                      : "dark:hover:bg-gray-700 hover:bg-gray-100"
                  }`}>
                  <House /> Эхлэл
                </div>
                <div
                  onClick={() => {
                    setSelectedSidebar("Гүйлгээ");
                    router.push("/dashboard/transfer");
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`flex h-15 items-center pl-4 gap-4 rounded-3xl cursor-pointer transition ${
                    selectedSidebar === "Гүйлгээ"
                      ? "text-blue-600 dark:hover:bg-gray-700 hover:bg-gray-100"
                      : "dark:hover:bg-gray-700 hover:bg-gray-100"
                  }`}>
                  <Send /> Гүйлгээ
                </div>
                <div
                  onClick={() => {
                    setSelectedSidebar("Данс");
                    router.push("/dashboard/accounts");
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`flex h-15 items-center pl-4 gap-4 rounded-3xl cursor-pointer transition ${
                    selectedSidebar === "Данс"
                      ? "text-blue-600 dark:hover:bg-gray-700 hover:bg-gray-100"
                      : "dark:hover:bg-gray-700 hover:bg-gray-100"
                  }`}>
                  <UserRound /> Данс
                </div>
                <div
                  onClick={() => {
                    setSelectedSidebar("Тохиргоо");
                    router.push("/dashboard/settings");
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`flex h-15 items-center pl-4 gap-4 rounded-3xl cursor-pointer transition ${
                    selectedSidebar === "Тохиргоо"
                      ? "text-blue-600 dark:hover:bg-gray-700 hover:bg-gray-100"
                      : "dark:hover:bg-gray-700 hover:bg-gray-100"
                  }`}>
                  <Settings /> Тохиргоо
                </div>
              </div>
            </div>
          )}

          <div className="w-full">
            <header className="flex items-center justify-between w-full h-24 border-b">
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="ml-4 focus:outline-none md:hidden"
                aria-label="Toggle sidebar">
                <Menu size={50} />
              </button>
              <div className="flex flex-col items-center justify-between w-full sm:flex-row ">
                <div className="hidden sm:block sm:text-4xl text-3xl sm:ml-4 lg:ml-8 xl:ml-10 text-[#343C6A] font-bold">
                  {selectedSidebar}
                </div>
                <div className="flex ml-auto mr-8 items-center gap-6 sm:gap-7 sm:mr-10">
                  <ToggleVisibility />
                  <ThemeToggleButton
                    showLabel
                    variant="circle"
                    start="top-right"
                  />
                  <SignedOut>
                    <button className="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700">
                      <SignInButton />
                    </button>
                    <button className="px-4 py-2 text-white transition bg-green-600 rounded hover:bg-green-700">
                      <SignUpButton />
                    </button>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </header>
            <div className="dark:bg-[#111111] bg-[#FFFAFA]">{children}</div>
          </div>
        </section>
      </VisibilityProvider>
    </>
  );
}
