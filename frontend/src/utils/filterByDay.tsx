import { TransactionType } from "@/app/types";

export const groupTransactionsByDay = (
    transactions: TransactionType[]
  ): Record<string, TransactionType[]> => {
    const grouped: Record<string, TransactionType[]> = {};

    transactions.forEach((transaction) => {
      const txDate = new Date(transaction.timestamp);
      const dateString = txDate.toISOString().split("T")[0];
      if (!grouped[dateString]) {
        grouped[dateString] = [];
      }
      grouped[dateString].push(transaction);
    });

    return grouped;
  };