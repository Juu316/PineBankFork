"use client";
import { CurrentUser } from "@/context/currentUserContext";
import { TransactionType } from "../types";
import { useState, useContext, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { groupTransactionsByDay } from "@/utils/filterByDay";
import Transaction from "./_components/Transaction";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/sidebarContext";
import AccountSelector from "./_components/AccountSelector";
import { fetchTransactions } from "@/lib/api";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import ExchangeRateTable from "./_components/ExchangeRateTable";
import { Designs } from "../types";
import { deleteDesign } from "@/lib/api";
import { CreateDesign } from "./_components/CreateDesign";

const Dashboard = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { getToken } = useAuth();
  const context = useContext(CurrentUser);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const { setSelectedSidebar } = useSidebar();
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [designs, setDesigns] = useState<Designs[]>([]);
  const currentUserData = context?.currentUserData;
  const { push } = useRouter();

  useEffect(() => {
    if (
      isLoaded &&
      isSignedIn &&
      currentUserData &&
      !currentUserData.userProfile
    ) {
      router.push("/user-profile");
    }
  }, [isLoaded, isSignedIn, currentUserData, router]);

  const selectedAccount = currentUserData?.accounts?.find(
    (account) => account.id === selectedAccountId
  );
  const accountNumber = selectedAccount?.accountNumber;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!accountNumber) return;
    const loadTransactions = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const fetchedTransactions = await fetchTransactions(
          accountNumber,
          token
        );
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Failed to load transactions", error);
      }
    };
    loadTransactions();
  }, [accountNumber, getToken]);

  // Load designs when user data changes
  useEffect(() => {
    if (currentUserData?.designs) {
      setDesigns(currentUserData.designs || []);
    }
  }, [currentUserData]);

  const handleClickNiit: () => void = () => {
    router.push("/dashboard/accounts");
    setSelectedSidebar("Данс");
  };

  const groupedTransactions = groupTransactionsByDay(transactions);
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <>
      <div className=" w-full max-w-screen  pl-[25px] pr-[25px] lg:pr-[40px] lg:pl-[40px] pt-6 text-[#343C6A] dark:text-[white] block md:flex gap-14 md:gap-6 lg:gap-14 min-h-screen ">
        <div className="w-full md:w-1/2 mb-8">
          <div className="flex justify-between mb-4">
            <div className="flex text-xl font-semibold">
              <div className="w-[100px] mb-2">Данс</div>
            </div>
            <div
              onClick={handleClickNiit}
              className="text-[orange] hover:underline cursor-pointer">
              нийт
            </div>
          </div>
          <AccountSelector
            selectedAccountId={selectedAccountId}
            setSelectedAccountId={setSelectedAccountId}
          />
          <div>
            <ExchangeRateTable />
          </div>
        </div>
        <div className="flex flex-wrap flex-col w-full max-w-full md:max-w-1/2 gap-10  md:w-1/2 ">
          <div className="text-xl font-semibold">Хадгалсан загварууд</div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
            <CreateDesign setDesigns={setDesigns} />
            {designs &&
              designs.map((design) => (
                <div
                  key={design.id}
                  className="bg-secondary p-2 rounded-lg cursor-pointer flex-shrink-0 min-w-[80px] relative">
                  <div
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (
                        window.confirm("Загварыг устгахдаа итгэлтэй байна уу?")
                      ) {
                        try {
                          const token = await getToken();
                          if (!token) return;
                          await deleteDesign(design.id, token);
                          // Refresh designs after successful deletion
                          const updatedDesigns = designs.filter(
                            (d) => d.id !== design.id
                          );
                          setDesigns(updatedDesigns);
                        } catch (error) {
                          console.error("Failed to delete design", error);
                        }
                      }
                    }}>
                    ✕
                  </div>
                  <div
                    onClick={() => {
                      push(`/dashboard/transfer?designId=${design.id}`);
                      setSelectedSidebar("Гүйлгээ");
                    }}
                    className="p-2 flex flex-col items-center">
                    <Image
                      src={"/images/user.png"}
                      alt="pinebank"
                      width={70}
                      height={70}
                      className="object-contain"
                    />
                    <p className="text-black dark:text-gray-100 text-sm rounded-md truncate mt-1">
                      {design.designName}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex flex-wrap w-full gap-10  ">
            <div className="w-full">
              <div className="text-lg font-semibold ">Сүүлийн гүйлгээ</div>
              <div className="w-full mt-2 overflow-y-auto border sm:mt-6 rounded-2xl p-4 max-h-[900px] shadow-2xl">
                {Object.keys(groupedTransactions).length > 0 && (
                  <div>
                    {Object.keys(groupedTransactions).map((date) => (
                      <div key={date}>
                        <h3 className="text-l font-semibold bg-[#F8F8F8] dark:bg-[#171717]">
                          {date}
                        </h3>
                        {groupedTransactions[date].map((transaction) => (
                          <Transaction
                            key={transaction.id}
                            date={new Date(
                              transaction.timestamp
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                            amount={String(transaction.amount)}
                            balance={String(transaction.runningBalance)}
                            type={transaction.type}
                            reference={transaction.reference}
                            fromAccountId={transaction.fromAccountId}
                            toAccountId={transaction.toAccountId}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
