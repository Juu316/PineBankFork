"use client";
import React from "react";
import { Bell } from "lucide-react";
const NotificationBell = () => {
  return (
    <>
      <button className="hover:shadow-lg hover:shadow-blue-500/50 transition duration-300 w-10 h-10 flex justify-center items-center rounded-2xl bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:cursor-pointer">
        <Bell />
      </button>
    </>
  );
};

export default NotificationBell;
