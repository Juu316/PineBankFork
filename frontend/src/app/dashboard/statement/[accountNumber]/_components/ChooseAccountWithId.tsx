"use client";
import { useVisibility } from "@/context/visibilityContext";
import React, { useContext, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { CurrentUser } from "@/context/currentUserContext";
import { formatNumber } from "@/utils/balanceFormat";
import { useRouter } from "next/navigation";

type ChooseAccountProps = {
  selectedAccountId: string;
  setSelectedAccountId: (accountId: string) => void;
};

const ChooseAccountWithId = ({
  selectedAccountId,
  setSelectedAccountId,
}: ChooseAccountProps) => {
  const context = useContext(CurrentUser);
  const currentUserData = context?.currentUserData;
  const { push } = useRouter();
  const { isVisible } = useVisibility();

  useEffect(() => {
    if (
      currentUserData &&
      Array.isArray(currentUserData.accounts) &&
      currentUserData.accounts.length > 0 &&
      !selectedAccountId
    ) {
      const selectedAccount = currentUserData.accounts.find(
        (acc) => acc.id === selectedAccountId
      );
      setSelectedAccountId(
        selectedAccount ? selectedAccount.id : currentUserData.accounts[0].id
      );
    }
  }, [currentUserData, selectedAccountId, setSelectedAccountId]);

  if (!currentUserData) {
    return <div>...Loading</div>;
  }

  const { accounts } = currentUserData;

  if (!accounts || accounts.length === 0) {
    return <div>No accounts available</div>;
  }

  const handleChange = (accountId: string) => {
    setSelectedAccountId(accountId);
    const selectedAccount = accounts.find((acc) => acc.id === accountId);
    if (selectedAccount) {
      push(`/dashboard/statement/${selectedAccount.accountNumber}`);
    }
  };

  return (
    <Select value={selectedAccountId} onValueChange={handleChange}>
      <SelectTrigger className="w-full flex items-center text-left justify-between min-h-16 border-0 shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-lg">
        {selectedAccountId ? (
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col w-full">
              <div className="text-sm font-semibold">ХАРИЛЦАХ/PINE</div>
              <span className="text-sm font-semibold text-gray-500 block">
                {Number(
                  accounts.find((acc) => acc.id === selectedAccountId)
                    ?.accountNumber
                )}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-500 block">
              {formatNumber(
                accounts.find((acc) => acc.id === selectedAccountId)?.balance ||
                  0
              )}{" "}
              MNT
            </span>
          </div>
        ) : (
          <span className="text-gray-400">Данс сонгоно уу</span>
        )}
      </SelectTrigger>
      <SelectContent className="max-h-[500px] w-full">
        <SelectGroup className="w-full">
          <SelectLabel className="ml-5.5 uppercase">Данс</SelectLabel>
          {/* {accounts.map((account) => (
            <SelectItem
              className="w-full flex items-center text-left justify-between min-h-16 border-0 shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-lg"
              key={account.id}
              value={account.id}>
              <div className="flex w-full justify-between items-center ">
                <div className="flex flex-col w-full">
                  <div className="text-sm font-semibold">ХАРИЛЦАХ/PINE</div>
                  <span className="text-sm font-semibold text-gray-500 block">
                    {account.accountNumber}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-500 block">
                  {formatNumber(Number(account.balance))} MNT
                </span>
              </div>
            </SelectItem>
          ))} */}
          {accounts.map((account) => (
            <SelectItem
              className="w-full p-2 block"
              key={account.id}
              value={account.id}>
              <div className="flex justify-between items-center w-full mr-6">
                <div className="flex flex-col">
                  <div className="text-sm font-semibold">ХАРИЛЦАХ / PINE</div>
                  <span className="text-sm font-semibold text-gray-500 block">
                    {account.accountNumber}
                  </span>
                </div>
                {isVisible ? (
                  <span className="text-sm font-semibold text-gray-500 block">
                    {formatNumber(Number(account.balance))} MNT
                  </span>
                ) : (
                  <div className="text-lg tracking-widest select-none">
                    ******
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ChooseAccountWithId;
