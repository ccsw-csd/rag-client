export interface Message {
    id: number,
    author: string,
    user: boolean,
    content: string,
    tokens?: number,
    embeddings?: string[],
    spentTime?: number,
    date?: Date,
}