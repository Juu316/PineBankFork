import React, { useContext, useEffect } from "react";
import { useVisibility } from "@/context/visibilityContext";
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
import { Skeleton } from "@/components/ui/skeleton";

type ChooseAccountProps = {
  selectedAccountId: string;
  setSelectedAccountId: (accountId: string) => void;
};
const AccountSelector = (props: ChooseAccountProps) => {
  const context = useContext(CurrentUser);
  const currentUserData = context?.currentUserData;
  const { selectedAccountId, setSelectedAccountId } = props;
  const { isVisible } = useVisibility();

  useEffect(() => {
    if (
      currentUserData &&
      Array.isArray(currentUserData.accounts) &&
      currentUserData.accounts.length > 0
    ) {
      setSelectedAccountId(currentUserData.accounts[0].id);
    }
  }, [currentUserData, setSelectedAccountId]);

  if (!context || !context.currentUserData) {
    return (
      <div className="space-y-2 w-full">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    );
  }

  if (!currentUserData) {
    return (
      <div className="space-y-2 w-full">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    );
  }

  const { accounts } = currentUserData;

  if (!accounts || accounts.length === 0) {
    return <div>No accounts available</div>;
  }

  return (
    <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
      <SelectTrigger className="w-full flex items-center text-left justify-center min-h-[8rem] border-0  shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-lg">
        {selectedAccountId ? (
          <div className="flex justify-between items-center gap-1 w-full">
            <div className="flex flex-col">
              <div className="text-sm font-semibold">ХАРИЛЦАХ / PINE </div>
              <span className="text-sm font-semibold text-gray-500 block">
                MN
                {
                  accounts.find((acc) => acc.id === selectedAccountId)
                    ?.accountNumber
                }
              </span>
            </div>
            {isVisible ? (
              <span className="text-sm font-semibold text-gray-500 block">
                {formatNumber(
                  Number(
                    accounts.find((acc) => acc.id === selectedAccountId)
                      ?.balance
                  ) || 0
                )}
                MNT
              </span>
            ) : (
              <div className="text-lg tracking-widest select-none">******</div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">Данс сонгоно уу</span>
        )}
      </SelectTrigger>

      <SelectContent className="max-h-[500px] w-full">
        <SelectGroup className="w-full">
          <SelectLabel className="ml-5.5 uppercase ">Данс</SelectLabel>
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

export default AccountSelector;
