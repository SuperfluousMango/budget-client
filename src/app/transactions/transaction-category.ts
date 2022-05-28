export interface GroupedCategories {
    name: string;
    categories: TransactionCategory[];
}

export interface TransactionCategory {
    id: number;
    name: string;
    displayName: string;
}
