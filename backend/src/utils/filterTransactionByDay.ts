import { TransactionType } from "../types/types";

export const filterByDateRange = (
  transactions: TransactionType[],
  dateRange: { from: string; to: string } | null
): TransactionType[] => {
  if (!dateRange?.from || !dateRange?.to) return transactions;

  const from = new Date(dateRange.from);
  const to = new Date(dateRange.to);
  console.log("from", from);
  return transactions.filter((t) => {
    const txDate = new Date(t.timestamp);
    return txDate >= from && txDate <= to;
  });
};
