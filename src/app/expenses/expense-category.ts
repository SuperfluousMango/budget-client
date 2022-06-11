export interface GroupedCategories {
    name: string;
    categories: ExpenseCategory[];
}

export interface ExpenseCategory {
    id: number;
    name: string;
    displayName: string;
}
