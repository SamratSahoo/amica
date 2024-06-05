export class EndExecutionError extends Error {
    constructor(message: string) {
        super(message); // (1)
        this.name = "EndExecutionError"; // (2)
    }
}

export interface TodoItem {
    id?: string;
    name: string;
    complete: boolean;
}

export interface FirestoreDate {
    seconds: number;
    nanoseconds: number
}
export interface CalendarItem {
    id?: string;
    name: string;
    date: FirestoreDate
}

export interface User {
    id?: string;
    email: string;
    firebaseUid: string;
    categories: string[];
}