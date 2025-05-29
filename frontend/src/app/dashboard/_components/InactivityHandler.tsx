"use client";

import { useEffect, useRef, useState } from "react";
import { useClerk } from "@clerk/nextjs";

const InactivityHandler = () => {
  const { signOut } = useClerk();
  const timeout = 5 * 60; // 5 minute, tsagiig n uurchilj bolno
  const [timeLeft, setTimeLeft] = useState(timeout);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    setTimeLeft(timeout);

    timerRef.current = setTimeout(() => {
      signOut();
    }, timeout * 1000);

    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  };

  useEffect(() => {
    // "mousemove" eniig door oruulval mouse hudluh uyd resetTimer ajillana
    const events = ["keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Start on mount

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-[#fafafa] dark:bg-gray-800  dark:text-white text-sm px-3 py-2 rounded shadow-md z-50">
      Холболт салах: {Math.floor(timeLeft / 60)}:
      {(timeLeft % 60).toString().padStart(2, "0")}
    </div>
  );
};

export default InactivityHandler;
