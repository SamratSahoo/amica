export class EndExecutionError extends Error {
    constructor(message: string) {
        super(message); // (1)
        this.name = "EndExecutionError"; // (2)
    }
}

export interface TodoItem {
    id?: string;
    task: string;
    complete: boolean;
    category: string;
}

export interface CalendarItem {
    id?: string;
    event: string;
    year: number;
    day: number;
    month: number;
    time: string
}

export interface User {
    id?: string;
    email: string;
    categories: string[];
    assistant_id: string;
}