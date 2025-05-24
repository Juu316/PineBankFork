"use client";
import { useCallback } from "react";
import { User } from "@/app/types";
import { axiosInstance } from "@/lib/addedAxiosInstance";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type CurrentUserProps = {
  currentUserData?: User;
  setCurrentUserData: (user: User) => void;
  error?: string;
};

export const CurrentUser = createContext<CurrentUserProps | null>(null);

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUserData, setCurrentUserData] = useState<User | undefined>();
  const [error, setError] = useState<string>("");

  const { getToken, isLoaded, isSignedIn } = useAuth();

  const getUserData = useCallback(async () => {
    const token = await getToken();

    if (!token) {
      console.error("No token available");
      return;
    }
    try {
      const response = await axiosInstance.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUserData(response.data.user);
    } catch (err) {
      console.error("Error fetching user data:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "Unknown error");
      }
    }
  }, [getToken]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getUserData();
    }
  }, [isLoaded, isSignedIn, getUserData]);
  return (
    <CurrentUser.Provider
      value={{ error, currentUserData, setCurrentUserData }}>
      {children}
    </CurrentUser.Provider>
  );
};

export const useCurrent = (): CurrentUserProps => {
  const context = useContext(CurrentUser);
  if (!context) {
    throw new Error("useCurrent must be used within a CurrentUserProvider");
  }
  return context;
};
