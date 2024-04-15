export interface Message {
    id: number,
    author: string,
    user: boolean,
    content: string,
    date?: Date,
}