export interface Message {
    id: number,
    author: string,
    user: boolean,
    content: string,
    tokens?: number,
    spentTime?: number,
    date?: Date,
    tabActiveIndex?: number,
}