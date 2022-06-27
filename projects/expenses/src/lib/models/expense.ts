export interface Expense {
    id: number;
    transactionDate: Date;
    amount: number;
    expenseCategoryId: number;
    memo: string;
}
