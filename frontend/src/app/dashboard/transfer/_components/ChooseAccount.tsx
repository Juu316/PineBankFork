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
type ChooseAccountProps = {
  selectedAccountId: string;
  setSelectedAccountId: (accountId: string) => void;
};
const ChooseAccount = (props: ChooseAccountProps) => {
  const { isVisible } = useVisibility();
  const context = useContext(CurrentUser);
  const currentUserData = context?.currentUserData;
  const { selectedAccountId, setSelectedAccountId } = props;

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
    return <div>...Loading</div>;
  }

  if (!currentUserData) {
    return <div>...Loading</div>;
  }

  const { accounts } = currentUserData;

  if (!accounts || accounts.length === 0) {
    return <div>No accounts available</div>;
  }

  return (
    <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
      <SelectTrigger className="w-full flex items-center text-left justify-center min-h-16 border cursor-pointer  shadow-2xs rounded-lg">
        {selectedAccountId ? (
          <div className="flex justify-between items-center gap-1 w-full">
            <div className="flex flex-col">
              <div className="text-[10px]  sm:text-sm font-semibold">
                ХАРИЛЦАХ / PINE
              </div>
              <span className="text-[10px] sm:text-sm font-semibold text-gray-500 block">
                MN{" "}
                {
                  accounts.find((acc) => acc.id === selectedAccountId)
                    ?.accountNumber
                }
              </span>
            </div>
            {isVisible ? (
              <span className="text-[10px] sm:text-sm font-semibold text-gray-500 block">
                {formatNumber(
                  Number(
                    accounts.find((acc) => acc.id === selectedAccountId)
                      ?.balance
                  ) || 0
                )}{" "}
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
              className="w-full p-2 block cursor-pointer"
              key={account.id}
              value={account.id}>
              <div className="flex justify-between items-center w-full mr-6">
                <div className="flex flex-col text-[10px] sm:text-sm">
                  <div className="text-[10px] sm:text-sm font-semibold">
                    ХАРИЛЦАХ / PINE
                  </div>
                  <span className="text-[10px] sm:text-sm font-semibold text-gray-500 block">
                    {account.accountNumber}
                  </span>
                </div>
                {isVisible ? (
                  <span className="text-[10px] sm:text-sm font-semibold text-gray-500 block">
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

export default ChooseAccount;
