export interface ExpenseCategoryGroup {
    name: string;
    categories: ExpenseCategory[];
}

export interface ExpenseCategory {
    id: number;
    name: string;
    displayName: string;
}
