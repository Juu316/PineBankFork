"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, ReceiptText, HandCoins, Trash2 } from "lucide-react";
import { useCurrent } from "@/context/currentUserContext";
import { formatNumber } from "@/utils/balanceFormat";
import { useVisibility } from "@/context/visibilityContext";
import { useRouter } from "next/navigation";
import { DialogDemo } from "./_components/Dialog";
import { useSidebar } from "@/context/sidebarContext";
import { axiosInstance } from "@/lib/addedAxiosInstance";
import { useAuth } from "@clerk/nextjs"; // or your auth hook
import { toast } from "react-toastify";
export default function Page() {
  const { currentUserData } = useCurrent();
  const allAccounts = currentUserData?.accounts || [];
  const { isVisible } = useVisibility();
  const router = useRouter();
  const { setSelectedSidebar } = useSidebar();
  const { getToken } = useAuth(); // <-- add this
  const [loadingId, setLoadingId] = useState<string | null>(null);
  // Add this function:
  const handleDeleteAccount = async (accountId: string) => {
    if (!window.confirm("Та энэ дансыг устгахдаа итгэлтэй байна уу?")) return;
    setLoadingId(accountId);
    try {
      const token = await getToken();
      await axiosInstance.delete(`/account/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Данс амжилттай устгагдлаа!");
      // Option 1: Refresh the page
      window.location.reload();
      // Option 2: Remove from state (if you manage accounts in state)
      // setAccounts((prev) => prev.filter(acc => acc.id !== accountId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Данс устгахад алдаа гарлаа."
      );
    } finally {
      setLoadingId(null);
    }
  };
  return (
    <div className="p-2 sm:p-6 bg-gray-100 dark:bg-gray-900 flex flex-col items-center min-h-screen">
      <div className="w-full max-w-[1252px] px-1">
        <h1 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-gray-800 dark:text-gray-100 text-left">
          Дансны жагсаалт
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 sm:p-4 w-full max-w-[1252px] shadow-2xl">
        <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-5 ml-1 sm:ml-3 mt-2 sm:mt-3">
          <DialogDemo />
        </div>

        <div className="flex flex-col gap-4">
          {allAccounts.map((account, index) => {
            const accountNumber = account?.accountNumber || "Данс олдсонгүй";
            const rawBalance = account?.balance;
            const balance =
              typeof rawBalance === "number"
                ? `${formatNumber(rawBalance)} MNT`
                : "Үлдэгдэл байхгүй";

            return (
              <Card
                key={index}
                className="dark:bg-gray-700 ml-0 sm:ml-3 shadow-none border-none">
                <CardContent className="flex flex-col  lg:flex-row lg:justify-between lg:items-center pb-4 border-b gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                      <div className="rounded-full flex items-center justify-center">
                        <HandCoins className="w-8 h-8 sm:w-9 sm:h-9 text-green-700" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs sm:text-sm text-black dark:text-gray-100 mb-1 sm:mb-2">
                          ХАРИЛЦАХ/ PINE
                        </span>
                        <span className="text-xs">
                          MN
                          <span className="font-bold text-xs ml-2">
                            {accountNumber}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end">
                      <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 mb-1">
                        Боломжит үлдэгдэл:
                      </div>
                      {isVisible ? (
                        <span className="font-semibold text-xs sm:text-sm text-black dark:text-white">
                          {balance ? balance : "N/A"}
                        </span>
                      ) : (
                        <span className="font-semibold text-xs sm:text-sm text-black dark:text-white">
                          *****
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center space-x-2 gap-2 sm:gap-8 mt-2 md:mt-0">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        router.push("/dashboard/transfer");
                        setSelectedSidebar("Гүйлгээ");
                      }}
                      className="w-14 h-14 sm:w-[66px] sm:h-[66px] flex flex-col rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.15)] dark:border-gray-200 dark:text-gray-200 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition duration-500">
                      <ArrowRightLeft className="!w-5 !h-5 shrink-0 font-black" />
                      <span className="text-[10px]">Гүйлгээ</span>
                    </Button>
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/statement/${accountNumber}`)
                      }
                      variant="ghost"
                      className="w-14 h-14 sm:w-[66px] sm:h-[66px] flex flex-col rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.15)] dark:border-gray-200 dark:text-gray-200 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition duration-500">
                      <ReceiptText className="!w-5 !h-5 shrink-0" />
                      <span className="text-[10px]">Хуулга</span>
                    </Button>

                    <Button
                      onClick={() => handleDeleteAccount(account.id)}
                      disabled={loadingId === account.id}
                      variant="ghost"
                      className="w-14 h-14 sm:w-[66px] sm:h-[66px] flex flex-col rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.15)] dark:border-gray-200 dark:text-gray-200 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition duration-500">
                      <Trash2 className="!w-5 !h-5 shrink-0 font-black" />
                      <span className="text-[10px]">
                        {loadingId === account.id
                          ? "Устгаж байна..."
                          : "Устгах"}
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
