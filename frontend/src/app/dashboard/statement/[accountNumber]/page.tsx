"use client";

import { useVisibility } from "@/context/visibilityContext";
import { axiosInstance } from "@/lib/addedAxiosInstance";
import axios from "axios";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { CurrentUser } from "@/context/currentUserContext";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/app/types";
import { groupTransactionsByDay } from "@/utils/filterByDay";
import { DateRange } from "react-day-picker";
import { addDays, endOfDay, startOfDay, subDays } from "date-fns";
import ChooseAccountWithId from "./_components/ChooseAccountWithId";
import { DatePickerWithRange } from "./_components/filterDate";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadPDF } from "./_components/downloadPDF";

type Account = {
  accountNumber: string;
  balance: number;
};

const Page = () => {
  const [dateButtonOn, setDateButtonOn] = useState("Өчигдөр");
  const [transactionInfo, setTransactionInfo] = useState<TransactionType[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<"ALL" | "CREDIT" | "DEBIT">("ALL");
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(subDays(today, 1)),
    to: addDays(new Date(today), 0),
  });
  const params = useParams();
  const accountNumber = Array.isArray(params?.accountNumber)
    ? params.accountNumber[0]
    : params?.accountNumber;
  const { isVisible } = useVisibility();
  const context = useContext(CurrentUser);
  const currentUserData = context?.currentUserData;

  useEffect(() => {
    const getTransactionInfo = async () => {
      // if (!accountNumber) {
      //   setError("Account not found.");
      //   return;
      // }
      setLoading(true);
      try {
        const response = await axiosInstance.post<{
          transactions: TransactionType[];
        }>(`transaction/all/${accountNumber}`, { dateRange });
        setTransactionInfo(response.data.transactions);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Axios error");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    getTransactionInfo();
  }, [accountNumber, dateRange]);

  const filteredTransactions = transactionInfo.filter((tx) => {
    if (filter === "ALL") return true;
    return tx.type === filter;
  });

  const setYesterday = () => {
    const yesterday = subDays(new Date(), 1);
    setDateRange({
      from: startOfDay(yesterday),
      to: endOfDay(new Date()),
    });
    setDateButtonOn("Өчигдөр");
  };

  const setLast7Days = () => {
    const today = new Date();
    setDateRange({
      from: startOfDay(subDays(today, 6)),
      to: endOfDay(today),
    });
    setDateButtonOn("ДолооХоног");
  };

  const setLastMonth = () => {
    const today = new Date();
    setDateRange({
      from: startOfDay(subDays(today, 29)),
      to: endOfDay(today),
    });
    setDateButtonOn("Сар");
  };

  const groupedTransactions = groupTransactionsByDay(filteredTransactions);

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === "CREDIT")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOutcome = filteredTransactions
    .filter((tx) => tx.type === "DEBIT")
    .reduce((sum, tx) => sum + tx.amount, 0);

  if (!context || !context.currentUserData) return <div>...Loading</div>;

  const accounts = currentUserData?.accounts ?? [];

  if (!accounts || accounts.length === 0) {
    return <div>No accounts available</div>;
  }

  const account = accounts.find(
    (acc: Account) => acc.accountNumber === accountNumber
  );

  if (!account) {
    return <div>Account not found</div>;
  }
  return (
    <div className="flex flex-col min-h-screen max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
      {/* Top bar: account selector and PDF */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-2 sm:gap-3 p-2 sm:p-4 mt-6 sm:mt-10 bg-secondary rounded-2xl">
        <ChooseAccountWithId
          selectedAccountId={selectedAccountId}
          setSelectedAccountId={setSelectedAccountId}
        />
        <Button
          onClick={() => {
            if (account) {
              downloadPDF(filteredTransactions);
            }
          }}
          className="w-full sm:w-12 h-12 rounded-lg mt-2 sm:mt-0 cursor-pointer">
          PDF
        </Button>
      </div>
      {/* Date picker and quick filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-2 sm:p-4 mt-4 bg-secondary rounded-2xl gap-2 sm:gap-0">
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        <div className="flex gap-2 mt-2 md:mt-0 flex-wrap">
          <Button
            onClick={setYesterday}
            size="sm"
            className={
              dateButtonOn === "Өчигдөр"
                ? "bg-green-500 flex cursor-pointer"
                : "flex cursor-pointer"
            }>
            Өчигдөр
          </Button>
          <Button
            onClick={setLast7Days}
            size="sm"
            className={
              dateButtonOn === "ДолооХоног"
                ? "bg-green-500 flex cursor-pointer"
                : "flex cursor-pointer"
            }>
            7 хоног
          </Button>
          <Button
            onClick={setLastMonth}
            size="sm"
            className={
              dateButtonOn === "Сар"
                ? "bg-green-500 flex cursor-pointer"
                : "flex cursor-pointer"
            }>
            1 сар
          </Button>
        </div>
      </div>
      {/* Income/Outcome and filter buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between w-full p-2 sm:p-4 mt-4 rounded-2xl bg-secondary gap-2 sm:gap-0">
        <div className="flex gap-2 mb-2 md:mb-0">
          <div className="flex flex-col items-end p-2 text-base sm:text-xl text-white bg-black dark:text-black dark:bg-white rounded-xl">
            Нийт орлого:
            <div>{totalIncome}₮</div>
          </div>
          <div className="flex flex-col items-end p-2 text-base sm:text-xl text-white bg-black dark:text-black dark:bg-white rounded-xl">
            Нийт зарлага:
            <div>{totalOutcome}₮</div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            className={
              filter === "ALL"
                ? "bg-green-500 flex cursor-pointer"
                : " flex cursor-pointer"
            }
            size="sm"
            onClick={() => setFilter("ALL")}>
            Бүгд
          </Button>
          <Button
            className={
              filter === "CREDIT"
                ? "bg-green-500 flex cursor-pointer"
                : " flex cursor-pointer"
            }
            size="sm"
            onClick={() => setFilter("CREDIT")}>
            Орлого
          </Button>
          <Button
            className={
              filter === "DEBIT"
                ? "bg-green-500 flex cursor-pointer"
                : " flex cursor-pointer"
            }
            size="sm"
            onClick={() => setFilter("DEBIT")}>
            Зарлага
          </Button>
        </div>
      </div>
      {/* Loading skeleton */}
      {loading && (
        <div className="p-2 sm:p-4 mt-4 rounded-2xl">
          {[1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className="p-4 space-y-2 border border-gray-200 rounded-lg">
              <Skeleton className="w-24 h-5" />
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="w-20 h-3" />
                    <Skeleton className="w-40 h-4" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="w-12 h-4" />
                    <Skeleton className="w-20 h-3" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}
      {/* Transactions */}
      {!loading && Object.keys(groupedTransactions).length > 0 && (
        <div className="rounded-2xl mt-4 w-full h-[60vh] sm:h-[700px] overflow-y-auto border bg-white dark:bg-gray-800">
          {Object.keys(groupedTransactions).map((date) => (
            <div key={date} className="p-2 sm:p-4 mb-4">
              <h3 className="text-base sm:text-xl font-semibold">{date}</h3>
              {groupedTransactions[date].map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-4 border-b gap-2">
                  <div className="flex flex-col items-start justify-between">
                    <div className="text-xs sm:text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </div>
                    <div className="text-sm">{transaction.reference}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div
                      className={
                        transaction.type === "DEBIT"
                          ? "text-red-500 flex"
                          : "text-green-500 flex"
                      }>
                      {transaction.type === "DEBIT" ? "-" : "+"}
                      {isVisible ? (
                        <div className="font-medium">{transaction.amount}₮</div>
                      ) : (
                        <div className="text-lg tracking-widest select-none">
                          •••••
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-xs sm:text-sm">
                      Үлдэгдэл:
                      {isVisible ? (
                        <div className="font-medium ml-1">
                          {account
                            ? account.balance + transaction.runningBalance
                            : "—"}
                        </div>
                      ) : (
                        <div className="text-lg tracking-widest select-none ml-1">
                          •••••
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
