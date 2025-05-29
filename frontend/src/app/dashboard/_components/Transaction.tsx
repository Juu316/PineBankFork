import { useVisibility } from "@/context/visibilityContext";

interface TransactionProps {
  date?: string;
  balance?: string;
  amount?: string;
  type?: string;
  reference?: string;
  toAccountId?: string;
  fromAccountId?: string;
  balanceAfterTransaction?: string;
}

const Transaction: React.FC<TransactionProps> = ({
  date,
  balance,
  amount,
  reference,
  type,
  //balanceAfterTransaction,
}) => {
  const { isVisible } = useVisibility();
  return (
    <>
      <div className="border-b flex justify-between items-center mb-2">
        <div className="flex flex-col">
          <div className="">{date}</div>
          <div className="">{reference}</div>
        </div>
        <div className="flex flex-col">
          {isVisible ? (
            <div>
              <div
                className={`text-[1.5rem] ${
                  type === "CREDIT" ? "text-green-500" : "text-red-500"
                }`}>
                {type === "CREDIT" ? "+" : "-"} {amount}
              </div>
              <div>Үлд: {balance}</div>
            </div>
          ) : (
            <div>
              <div
                className={`text-[1.5rem] ${
                  type === "CREDIT" ? "text-green-500" : "text-red-500"
                }`}>
                ****
              </div>
              <div>Үлд: **** </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Transaction;
