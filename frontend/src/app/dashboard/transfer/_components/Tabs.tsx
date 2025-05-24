"use client";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import GetProfileInput from "./GetProfileInput";
import { axiosInstance } from "@/lib/addedAxiosInstance";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { CurrentUser } from "@/context/currentUserContext";
import { SwitchDemo } from "./SwitchSave";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, X } from "lucide-react";
import { formatNumber } from "@/utils/balanceFormat";
import Image from "next/image";
import ChooseAccount from "./ChooseAccount";

export const TabsDemo = () => {
  const [amount, setAmount] = useState<number | "">("");
  const [reference, setReference] = useState("");
  const [design, setDesign] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toAccountId, setToAccountId] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState("");
  const [success, setSuccess] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionPassword, setTransactionPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const context = useContext(CurrentUser);
  const currentUserData = context?.currentUserData;
  const userTransactionPassword = currentUserData?.transactionPassword;
  const { getToken } = useAuth();
  interface TransactionResponse {
    amount?: number;
    timestamp?: string;
    toAccountNumber?: string;
    reference?: string;
  }

  const [dataResponse, setDataResponse] = useState<TransactionResponse>({});
  const searchParams = useSearchParams();
  const designId = searchParams.get("designId") || "";
  const { push } = useRouter();
  const selectedDesign = currentUserData?.designs.find(
    (design) => design.id === designId
  );

  useEffect(() => {
    if (selectedDesign) {
      setAccountNumber(selectedDesign.toAccountNumber);
    }
  }, [selectedDesign]);

  const createTransaction = async () => {
    if (!toAccountId) {
      setError("Хүлээн авагчийн данс хоосон байна.");
      openDialog();
      return;
    }
    if (!amount) {
      setError("Гүйлгээний дүн хоосон байна.");
      openDialog();
      return;
    }
    if (!reference) {
      setError("Гүйлгээний утга хоосон байна.");
      openDialog();
      return;
    }

    if (transactionPassword !== userTransactionPassword) {
      setError("Гүйлгээний нууц үг буруу байна.");
      openDialog();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const transaction = {
        fromAccountId: selectedAccountId,
        toAccountId,
        amount: Number(amount),
        reference,
        transactionPassword,
      };
      const res = await axiosInstance.post("/transaction", transaction);

      if (res.status === 201) {
        const response = res.data.transaction;
        setSuccess("Transaction successful!");
        openDialog();
        setDataResponse(response);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "An error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
      openDialog();
    } finally {
      setLoading(false);
    }
  };
  const createDesign = async () => {
    const token = await getToken();
    if (!toAccountId) {
      setError("Хүлээн авагчийн данс хоосон байна.");
      openDialog();
      return;
    }

    if (!design || design === "") {
      return;
    }
    setLoading(true);
    setError("");

    try {
      const saveDesign = {
        toAccountNumber: accountNumber,
        designName: design,
      };
      const res = await axiosInstance.post("/design", saveDesign, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 201) {
        console.log(res.data.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "An error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
      openDialog();
    } finally {
      setLoading(false);
    }
  };
  const openDialog = () => setIsDialogOpen(true);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, "");
    if (value !== "") {
      const numericValue = parseFloat(value);
      setAmount(isNaN(numericValue) ? "" : numericValue);
    } else {
      setAmount("");
    }
  };

  const formatAmount = (amount: number | "") => {
    if (amount === "") return "";
    return amount.toLocaleString();
  };
  return (
    <div className="min-h-screen h-auto mb-10 w-full max-w-5xl  ">
      <Tabs
        defaultValue="account"
        className="flex xl:flex-col mt-1 lg:gap-6 2xl:gap-12 w-full justify-center items-center">
        <div className="flex-1 w-4/5 mx-5 max-md:w-[320px]">
          <TabsContent
            className="shadow-2xl rounded-lg bg-white dark:bg-gray-900"
            value="account">
            <div className="flex flex-col gap-8 items-center">
              <CardHeader className="bg-black w-full h-[104px]  rounded-t-lg">
                <CardTitle className="text-white text-xs mt-5">
                  Гүйлгээний төрөл
                </CardTitle>
                <CardDescription className="text-black dark:text-white text-[12px] justify-center min-w-full w-full h-11 border rounded-lg flex items-center mb-5 bg-white dark:bg-gray-700 font-bold text-center">
                  PINE БАНКНЫ ДАНС РУУ
                </CardDescription>
              </CardHeader>
              {/* ////////////////////////////////////////////////// */}
              <CardContent className="space-y-6 px-6 pb-2 w-full">
                <div className="space-y-2 mb-2">
                  <Label
                    htmlFor="from-account"
                    className="font-medium text-gray-700 dark:text-gray-300 text-xs">
                    <span className="text-red-600">*</span> Шилжүүлэх дансаа
                    сонгох
                  </Label>
                  <ChooseAccount
                    selectedAccountId={selectedAccountId}
                    setSelectedAccountId={setSelectedAccountId}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="to-account"
                    className="font-medium text-gray-700 dark:text-gray-300 text-xs"></Label>
                  <GetProfileInput
                    setToAccountId={setToAccountId}
                    accountNumber={accountNumber}
                    setAccountNumber={setAccountNumber}
                    fullName={fullName}
                    setFullName={setFullName}
                  />
                </div>
                <div className="flex gap-4">
                  {!selectedDesign && (
                    <SwitchDemo design={design} setDesign={setDesign} />
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="amount"
                    className="font-medium text-gray-700 dark:text-gray-300 text-xs">
                    <span className="text-red-600">*</span> Гүйлгээний дүн
                  </Label>
                  <input
                    id="amount"
                    value={formatAmount(amount)}
                    onChange={handleAmountChange}
                    className="border-0 border-b w-full border-gray-300 dark:border-gray-500 rounded-none focus:outline-none focus:ring-0 focus:border-black hover:border-black bg-transparent text-gray-900 dark:text-white duration-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="reference"
                    className="font-medium text-gray-700 dark:text-gray-300 text-xs">
                    <span className="text-red-600">*</span> Гүйлгээний утга
                  </Label>
                  <input
                    id="reference"
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    autoComplete="off"
                    className="border-0 w-full border-b border-gray-300 dark:border-gray-500 rounded-none focus:outline-none focus:ring-0 focus:border-black hover:border-black bg-transparent text-gray-900 dark:text-white duration-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="transaction-password"
                    className="font-medium text-gray-700 dark:text-gray-300 text-xs">
                    <span className="text-red-600">*</span> Гүйлгээний нууц үг
                  </Label>
                  <input
                    id="transaction-password"
                    type="password"
                    value={transactionPassword}
                    autoComplete="off"
                    onChange={(e) => setTransactionPassword(e.target.value)}
                    className="border-0 border-b w-full border-gray-300 dark:border-gray-500 rounded-none focus:outline-none focus:ring-0 focus:border-black hover:border-black bg-transparent text-gray-900 dark:text-white duration-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="px-4 sm:px-6 pb-6 gap-3 flex flex-col sm:flex-row items-center justify-center w-full">
                <Button
                  type="button"
                  className="w-full sm:w-1/2 xs:w-auto xs:flex-1 h-10 text-[15px] text-gray-900 dark:text-white border bg-white dark:bg-gray-700 duration-400 dark:hover:opacity-75 cursor-pointer hover:bg-black hover:text-white transition rounded-md sm:rounded-2xl font-semibold"
                  onClick={() => {
                    setAccountNumber("");
                    setAmount("");
                    setReference("");
                    setToAccountId(null);
                    setTransactionPassword("");
                  }}
                  disabled={loading}>
                  {loading ? "Шинэчлэл хийгдлээ" : "Шинэчлэх"}
                </Button>
                <Button
                  type="button"
                  className="w-full sm:w-1/2 xs:w-auto xs:flex-1 h-10 text-[15px] text-white bg-black dark:bg-green-700 shadow duration-400 hover:bg-[var(--foreground)]/60 dark:hover:opacity-75 cursor-pointer transition rounded-md sm:rounded-2xl font-semibold"
                  onClick={() => {
                    createTransaction();
                    if (accountNumber.length === 10) {
                      createDesign();
                    }
                  }}
                  disabled={loading}>
                  {loading ? "Гүйлгээ хийгдэж байна" : "Гүйлгээ хийх"}
                </Button>
                <Dialog
                  open={isDialogOpen}
                  onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open && success) {
                      push("/dashboard");
                    }
                  }}>
                  <DialogContent className="p-8 dark:bg-gray-700 bg-secondary rounded-lg shadow-lg w-[400px] flex flex-col items-center">
                    <DialogTitle className="w-full flex flex-col gap-3 justify-center items-center font-semibold text-center bg-white dark:bg-gray-600 p-4 rounded-xl">
                      {success ? (
                        <Check className="bg-green-500 text-white w-10 h-10 rounded-full shadow-lg" />
                      ) : (
                        <X className="bg-red-500 text-white w-10 h-10 rounded-full shadow-lg" />
                      )}
                      <span className="text-gray-900 dark:text-white">
                        {success ? "Гүйлгээ амжилттай" : `${error}`}
                      </span>
                      {success && (
                        <div className="text-4xl text-green-600 dark:text-amber-400 font-bold">
                          {formatNumber(dataResponse.amount)} MNT
                        </div>
                      )}
                      {success && (
                        <div className="text-gray-500 dark:text-gray-300 text-base">
                          {dataResponse.timestamp
                            ? new Date(
                                dataResponse.timestamp
                              ).toLocaleTimeString([], {
                                year: "2-digit",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
                            : "N/A"}
                        </div>
                      )}
                      {!success && (
                        <DialogClose asChild>
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-full bg-secondary hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 mt-2">
                            хаах
                          </Button>
                        </DialogClose>
                      )}
                    </DialogTitle>
                    {success && (
                      <div className="w-full flex flex-col gap-3 mt-4">
                        <div className="bg-white dark:bg-gray-600 w-full p-4 rounded-xl shadow  ">
                          <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 font-medium">
                            Хүлээн авагч
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {fullName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-white">
                                {dataResponse.toAccountNumber}
                              </div>
                            </div>
                            <Image
                              src={"/favicon.ico"}
                              alt="pinebank"
                              width={36}
                              height={36}
                              className="rounded-md mr-3 border border-gray-200 dark:border-amber-200/40 shadow"
                            />
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-600 w-full p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 font-medium">
                            Гүйлгээний утга
                          </p>
                          <span className="text-gray-900 dark:text-white">
                            {dataResponse.reference}
                          </span>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
