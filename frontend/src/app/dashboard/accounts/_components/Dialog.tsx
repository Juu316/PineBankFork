import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { axiosInstance } from "@/lib/addedAxiosInstance";
const createBankAccount = async (getToken: () => Promise<string | null>) => {
  const token = await getToken();

  if (!token) {
    console.error("No token found.");
    return false;
  }

  try {
    await axiosInstance.post(
      "/account",
      { balance: 10000 },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Account created successfully!");
    return true;
  } catch (error) {
    console.error("Error creating account:", error);
    return false;
  }
};

export function DialogDemo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSuccess(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleCreateAccount = async (accountType: string) => {
    setLoading(true);
    setSuccess(null);

    try {
      const isSuccess = await createBankAccount(getToken);

      if (isSuccess) {
        setSuccess(true);
        console.log(`${accountType} account created`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (err) {
      setError("Failed to create account. Please try again.");
      console.error("Error creating account:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className=" shadow-md hover:shadow-lg transition">
          <Plus /> Шинэ данс нээх
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-2 border-blue-900 dark:border-blue-300 shadow-2xl rounded-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 p-4">
            <div className="w-full h-6 bg-blue-200 dark:bg-blue-900 rounded-md animate-pulse"></div>
            <div className="w-full h-4 bg-blue-100 dark:bg-blue-800 rounded-md animate-pulse mt-2"></div>
            <div className="w-full h-12 bg-blue-100 dark:bg-blue-800 rounded-md animate-pulse mt-4"></div>
            <div className="w-full h-12 bg-blue-200 dark:bg-blue-900 rounded-md animate-pulse mt-4"></div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex justify-center text-sm uppercase tracking-widest text-blue-900 dark:text-blue-200">
                Дансны төрөл сонгоно уу
              </DialogTitle>
              {/* <DialogDescription className="flex justify-center text-center text-xs text-blue-800 dark:text-blue-300">
                Данс нээх онлайн гэрээ таны бүртгэлтэй и-мэйл хаяг руу илгээгдэх
                тул и-мэйл хаягаа тохиргоо цэсээр орж зөв эсэхийг шалгана уу.
              </DialogDescription> */}
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {success === true ? (
                <div className="text-center font-bold text-green-600 dark:text-green-400">
                  <p>Данс амжилттай нээгдлээ</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-600 dark:text-red-400">
                  <p>{error}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-5">
                  <button
                    className="bg-blue-900 text-white flex items-center justify-center border-t shadow-xl dark:text-gray-200 dark:border-gray-200 px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white dark:hover:bg-blue-300 dark:hover:text-gray-900 transition duration-300 w-[262px] font-semibold tracking-wide"
                    onClick={() => handleCreateAccount("BUSINESS")}
                    disabled={loading}>
                    Харилцах данс
                  </button>
                  {/* <button
                  className="flex items-center justify-center border-t shadow-xl text-gray-800 dark:border-gray-200 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition duration-500 w-[262px]"
                  onClick={() => handleCreateAccount("SAVINGS")}
                  disabled={loading}>
                  Хугацаагүй хадгаламж
                </button> */}
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
