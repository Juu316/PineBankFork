"use client";

import { axiosInstance } from "@/lib/addedAxiosInstance";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type GetProfileInputProps = {
  accountNumber: string;
  setAccountNumber: (accountNumber: string) => void;
  setToAccountId: (toAccountId: string) => void;
  fullName: string;
  setFullName: (fullName: string) => void;
};

const GetProfileInput = (props: GetProfileInputProps) => {
  const {
    fullName,
    setFullName,
    accountNumber,
    setAccountNumber,
    setToAccountId,
  } = props;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await axiosInstance.post("/profile/user", {
        accountNumber,
      });
      if (response.status === 200) {
        const { userProfile, accounts } = response.data.userInfo;
        const fullName = userProfile
          ? `${userProfile.firstName} ${userProfile.lastName}`
          : "No name found";
        setFullName(fullName);
        setToAccountId(accounts[0].id);
      } else {
        console.log("Error fetching user data");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountNumber.length === 10) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountNumber]);

  if (loading) {
    <div className="space-y-2 w-full">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-16 w-full rounded-lg" />
    </div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <label
        htmlFor="accountNumber"
        className="font-medium text-gray-700 text-xs mt-2 flex gap-1">
        <p className="text-red-700">*</p>
        Хүлээн авагчийн данс
      </label>
      <input
        id="accountNumber"
        type="text"
        value={accountNumber}
        maxLength={10}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
            setAccountNumber(value);
          }
        }}
        className="border-0 border-b border-gray-300 rounded-none 
               focus:outline-none focus:ring-0 focus:border-black 
               hover:border-black duration-500"
      />

      <label
        htmlFor="fullName"
        className="font-medium text-gray-700 text-xs mt-2 flex gap-1">
        <p className="text-red-700">*</p>
        Хүлээн авагчийн нэр
      </label>
      <input
        id="fullName"
        type="text"
        value={fullName}
        readOnly
        className="border-0 border-b border-gray-300 rounded-none 
               focus:outline-none focus:ring-0 focus:border-black 
               hover:border-black duration-500 uppercase cursor-not-allowed"
      />

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default GetProfileInput;
