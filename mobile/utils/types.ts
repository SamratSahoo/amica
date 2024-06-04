export class EndExecutionError extends Error {
    constructor(message: string) {
        super(message); // (1)
        this.name = "EndExecutionError"; // (2)
    }
}

export interface TodoItem {
    name: string;
    complete: boolean;
}

export interface CalendarItem {
    name: string;
    date: Date;
}