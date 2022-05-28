export interface Transaction {
    id: number;
    transactionDate: Date;
    amount: number;
    transactionCategoryId: number;
    memo: string;
}
