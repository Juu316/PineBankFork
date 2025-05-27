export type BankAccountType = {
  id: number;
  accountNumber: string;
  type: string;
  balance: number;
  userId: string;
};

export type TransactionType = {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  reference: string | null;
  timestamp: Date;
  balanceAfterTransaction: number | null;
};
