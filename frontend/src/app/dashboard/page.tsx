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
import { CreateDesign } from "./_components/CreateDesign";

const Dashboard = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { getToken } = useAuth();
  const context = useContext(CurrentUser);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const { setSelectedSidebar } = useSidebar();
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
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
    if (isLoaded && isSignedIn) {
      const hasRefreshed = localStorage.getItem("hasRefreshed");

      if (!hasRefreshed) {
        localStorage.setItem("hasRefreshed", "true");
        window.location.reload();
      } else {
        localStorage.removeItem("hasRefreshed");
      }
    }
  }, [isLoaded, isSignedIn]);
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

  const handleClickNiit = () => {
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
  const designs = currentUserData?.designs;

  return (
    <>
      <div className="w-full pl-[25px] pr-[25px] lg:pr-[40px] lg:pl-[40px] pt-6 text-[#343C6A] dark:text-[white] block md:flex gap-14 max-w-[1500px] min-h-screen">
        <div className="w-full  sm:w-1/2 mb-8">
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
        <div className="flex flex-wrap w-full gap-10 xl:flex-nowrap sm:w-1/2 flex-col">
          <div className="w-full">
            <div className="text-xl font-semibold">Хадгалсан загварууд</div>

            <div className="flex h-[8rem] gap-6 mt-6 overflow-x-auto mb-8">
              <CreateDesign />
              {designs && designs.length ? (
                designs.map((design) => (
                  <div
                    className="bg-secondary p-3 rounded-lg cursor-pointer"
                    key={design.id}
                    onClick={() => {
                      push(`/dashboard/transfer?designId=${design.id}`);
                      setSelectedSidebar("Гүйлгээ");
                    }}>
                    <Image
                      src={"/favicon.ico"}
                      alt="pinebank"
                      width={70}
                      height={70}
                    />
                    <p className="text-black dark:text-gray-100 text-sm rounded-md w-[4rem]">
                      {design.designName}
                    </p>
                  </div>
                ))
              ) : (
                <div className="w-full border rounded-2xl py-3 px-6 shadow-2xl">
                  <div className="text-3xl font-semibold pb-2 dark:text-zinc-100 ">
                    Амархан гүйлгээ
                  </div>
                  <hr></hr>
                  <div className="pt-2 dark:text-gray-200 ">
                    Тогтмол харьцдаг дансны загвараа хадгалаад гүйлгээгээ
                    амарханаар хийгээрэй.
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap w-full gap-10 xl:flex-nowrap ">
              <div className="w-full">
                <div className="text-lg font-semibold ">Сүүлийн гүйлгээ</div>
                <div className="w-full mt-2 overflow-y-auto border sm:mt-6 rounded-2xl p-4 max-h-[900px] shadow-2xl">
                  {Object.keys(groupedTransactions).length > 0 && (
                    <div className="">
                      {Object.keys(groupedTransactions).map((date) => (
                        <div key={date} className="">
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
      </div>
    </>
  );
};
export default Dashboard;
